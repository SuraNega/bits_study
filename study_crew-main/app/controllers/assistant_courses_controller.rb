class AssistantCoursesController < ApplicationController
  before_action :set_assistant_course, only: [ :show, :update, :destroy ]
  # before_action :authorize_assistant, only: [:index, :create, :destroy]
  # before_action :authorize_user, only: [:show]

  # GET /assistant_courses
  def index
    @assistant_courses = AssistantCourse.includes(:assistant, :course).all
    render json: @assistant_courses.as_json(include: [ :assistant, :course ])
  end

  # GET /assistant_courses/:id
  def show
    if @assistant_course.nil?
      render json: { error: "Assistant course assignment not found." }, status: :not_found
    else
      render json: @assistant_course.as_json(include: [ :assistant, :course ])
    end
  end

  # POST /assistant_courses
  def create
    assistant_course_params_copy = assistant_course_params.dup

    # If course_id is a string (course code), convert it to course ID
    if assistant_course_params_copy[:course_id].is_a?(String)
      course = Course.find_by(code: assistant_course_params_copy[:course_id])
      unless course
        render json: { error: "Course with code #{assistant_course_params_copy[:course_id]} does not exist." }, status: :unprocessable_entity
        return
      end
      assistant_course_params_copy[:course_id] = course.id
    end

    @assistant_course = AssistantCourse.new(assistant_course_params_copy)

    # Check if the user is actually an assistant
    assistant = User.find_by(id: params[:assistant_course][:assistant_id])
    unless assistant&.assistant?
      render json: { error: "User must be an assistant to be assigned to a course." }, status: :unprocessable_entity
      return
    end

    # Check if assignment already exists
    existing_assignment = AssistantCourse.find_by(
      assistant_id: params[:assistant_course][:assistant_id],
      course_id: @assistant_course.course_id
    )

    if existing_assignment
      render json: { error: "Assistant is already assigned to this course." }, status: :unprocessable_entity
      return
    end

    if @assistant_course.save
      render json: @assistant_course.as_json(include: [ :assistant, :course ]), status: :created
    else
      render json: { errors: @assistant_course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /assistant_courses/:id
  def update
    if @assistant_course.nil?
      render json: { error: "Assistant course assignment not found." }, status: :not_found
      return
    end

    assistant_course_params_copy = assistant_course_params.dup

    # If course_id is being updated and is a string (course code), convert it to course ID
    if assistant_course_params_copy[:course_id].present? && assistant_course_params_copy[:course_id].is_a?(String)
      course = Course.find_by(code: assistant_course_params_copy[:course_id])
      unless course
        render json: { error: "Course with code #{assistant_course_params_copy[:course_id]} does not exist." }, status: :unprocessable_entity
        return
      end
      assistant_course_params_copy[:course_id] = course.id
    end

    # Check for uniqueness if course_id is being changed
    if assistant_course_params_copy[:course_id].present? && assistant_course_params_copy[:course_id] != @assistant_course.course_id
      existing_assignment = AssistantCourse.find_by(
        assistant_id: @assistant_course.assistant_id,
        course_id: assistant_course_params_copy[:course_id]
      )
      if existing_assignment
        render json: { error: "Assistant is already assigned to this course." }, status: :unprocessable_entity
        return
      end
    end

    if @assistant_course.update(assistant_course_params_copy)
      render json: {
        message: "Assignment updated successfully",
        assignment: @assistant_course.as_json(include: [ :assistant, :course ])
      }
    else
      render json: { errors: @assistant_course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /assistant_courses/bulk_update_with_availability
  def bulk_update_with_availability
    assistant_id = params[:assistant_id]
    course_ids = params[:course_ids] || []
    special_course_codes = params[:special_course_codes] || []

    # Debug logging
    Rails.logger.info "bulk_update_with_availability called with:"
    Rails.logger.info "assistant_id: #{assistant_id}"
    Rails.logger.info "course_ids: #{course_ids}"
    Rails.logger.info "special_course_codes: #{special_course_codes}"

    # Validate assistant
    assistant = User.find_by(id: assistant_id)
    unless assistant&.assistant?
      render json: { error: "User must be an assistant to be assigned to courses." }, status: :unprocessable_entity
      return
    end

    ActiveRecord::Base.transaction do
      # Get course objects for all course codes
      courses = []
      course_ids.each do |course_code|
        course = Course.find_by(code: course_code)
        unless course
          render json: { error: "Course with code #{course_code} does not exist." }, status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end
        courses << course
      end

      # Get currently assigned courses for this assistant
      currently_assigned = AssistantCourse.where(assistant_id: assistant_id).includes(:course)
      currently_assigned_codes = currently_assigned.map { |ac| ac.course.code }

      # Determine courses to add and remove
      courses_to_add = course_ids - currently_assigned_codes
      courses_to_remove = currently_assigned_codes - course_ids

      Rails.logger.info "courses_to_add: #{courses_to_add}"
      Rails.logger.info "courses_to_remove: #{courses_to_remove}"

      # Remove courses that are no longer selected
      removed_assignments = []
      courses_to_remove.each do |course_code|
        assignment = currently_assigned.find { |ac| ac.course.code == course_code }
        if assignment
          assignment.destroy!
          removed_assignments << assignment
        end
      end

      # Add new course assignments
      added_assignments = []
      courses_to_add.each do |course_code|
        course = courses.find { |c| c.code == course_code }
        next unless course

        ac = AssistantCourse.new(
          assistant_id: assistant_id,
          course_id: course.id,
          special: special_course_codes.include?(course_code)
        )
        ac.save!
        added_assignments << ac
      end

      # Update special status for existing assignments
      special_added = []
      special_removed = []
      currently_assigned.each do |assignment|
        course_code = assignment.course.code
        should_be_special = special_course_codes.include?(course_code)
        if assignment.special != should_be_special
          if should_be_special
            special_added << course_code
          else
            special_removed << course_code
          end
          assignment.update!(special: should_be_special)
        end
      end

      # Count special courses in newly added assignments
      newly_added_special = added_assignments.select(&:special).map { |ac| ac.course.code }
      special_added.concat(newly_added_special)

      render json: {
        message: "Courses updated successfully",
        added_courses_count: added_assignments.size,
        removed_courses_count: removed_assignments.size,
        special_added_count: special_added.size,
        special_removed_count: special_removed.size,
        data: {
          added_assignments: added_assignments.map { |ac| ac.as_json(include: [ :assistant, :course ]) },
          removed_assignments: removed_assignments.map { |ac| ac.as_json(include: [ :assistant, :course ]) }
        }
      }, status: :ok
    rescue => e
      Rails.logger.error "Error in bulk_update_with_availability: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: "Internal server error occurred while updating courses." }, status: :internal_server_error
    end
  end

  # DELETE /assistant_courses/:id
  def destroy
    if @assistant_course.nil?
      render json: { error: "Assistant course assignment not found." }, status: :not_found
    else
      @assistant_course.destroy
      render json: { message: "Assistant course assignment was successfully removed." }
    end
  end

  # GET /assistant_courses/by_assistant/:assistant_id
  def by_assistant
    assistant = User.find_by(id: params[:assistant_id])
    if assistant.nil?
      render json: { error: "Assistant not found." }, status: :not_found
    else
      @assistant_courses = AssistantCourse.includes(:course).where(assistant_id: params[:assistant_id])
      # Return courses with the special field from AssistantCourse
      courses_with_special = @assistant_courses.map do |ac|
        ac.course.as_json.merge(special: ac.special)
      end
      render json: courses_with_special
    end
  end

  # GET /assistant_courses/assignment_details/:assistant_id/:course_id
  def assignment_details
    assistant = User.find_by(id: params[:assistant_id])
    if assistant.nil?
      render json: { error: "Assistant not found." }, status: :not_found
      return
    end

    course = Course.find_by(id: params[:course_id]) || Course.find_by(code: params[:course_id])
    if course.nil?
      render json: { error: "Course not found." }, status: :not_found
      return
    end

    assignment = AssistantCourse.find_by(assistant_id: params[:assistant_id], course_id: course.id)
    if assignment.nil?
      render json: { error: "Assignment not found for this assistant and course." }, status: :not_found
    else
      render json: {
        assignment: assignment.as_json(include: [ :assistant, :course ])
      }
    end
  end

  # GET /assistant_courses/by_course/:course_id
  def by_course
    course = Course.find_by(id: params[:course_id])
    if course.nil?
      render json: { error: "Course not found." }, status: :not_found
    else
      @assistant_courses = AssistantCourse.includes(:assistant, :course).where(course_id: params[:course_id])

      # Group assistant courses by assistant and include their courses with special flags
      assistants_with_courses = @assistant_courses.group_by(&:assistant).map do |assistant, acs|
        # Skip current user if they are in student mode
        next if current_user && assistant.id == current_user.id && current_user.active_role == "user"

        courses = acs.map do |ac|
          {
            code: ac.course.code,
            name: ac.course.name,
            special: ac.special
          }
        end

        assistant.as_json.merge(courses: courses)
      end.compact

      render json: assistants_with_courses
    end
  end

  # GET /assistant_courses/special
  def special
    @special_courses = AssistantCourse.includes(:assistant, :course).where(special: true)
    render json: @special_courses.as_json(include: [ :assistant, :course ])
  end

  # POST /assistant_courses/request_help
  def request_help
    assistant_id = params[:assistant_id]
    course_id = params[:course_id]

    Rails.logger.info "Help request initiated - assistant_id: #{assistant_id}, course_id: #{course_id}, user_id: #{current_user&.id}"

    # Validate current user
    unless current_user
      Rails.logger.warn "Help request failed: User not authenticated"
      render json: { error: "You must be logged in to request help." }, status: :unauthorized
      return
    end

    # Find assistant
    assistant = User.find_by(id: assistant_id)
    unless assistant&.assistant?
      Rails.logger.warn "Help request failed: Invalid assistant #{assistant_id}"
      render json: { error: "Assistant not found." }, status: :not_found
      return
    end

    # Find course
    course = Course.find_by(id: course_id)
    unless course
      Rails.logger.warn "Help request failed: Invalid course #{course_id}"
      render json: { error: "Course not found." }, status: :not_found
      return
    end

    # Check if assistant is assigned to this course
    unless AssistantCourse.exists?(assistant_id: assistant_id, course_id: course_id)
      Rails.logger.warn "Help request failed: Assistant #{assistant_id} not assigned to course #{course_id}"
      render json: { error: "Assistant is not assigned to this course." }, status: :unprocessable_entity
      return
    end

    # Send email asynchronously
    begin
      HelpRequestMailer.help_request(assistant, current_user, course).deliver_later
      Rails.logger.info "Help request email queued successfully for assistant #{assistant.email}"
      render json: { message: "Help request sent successfully. The assistant will contact you soon." }, status: :ok
    rescue => e
      Rails.logger.error "Failed to send help request email: #{e.message}"
      render json: { error: "Failed to send help request. Please try again." }, status: :internal_server_error
    end
  end

  private

  def set_assistant_course
    @assistant_course = AssistantCourse.find_by(id: params[:id])
  end

  def assistant_course_params
    params.require(:assistant_course).permit(:assistant_id, :course_id)
  end

  def authorize_assistant
    unless current_user&.assistant?
      render json: { error: "Access denied. Only assistants can perform this action." }, status: :forbidden
    end
  end

  def authorize_user
    unless current_user&.assistant? || current_user&.user?
      render json: { error: "Access denied. You need proper authorization to perform this action." }, status: :forbidden
    end
  end
end
