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
    availability_updates = params[:availability_updates] || []
    # Handle legacy 'availability' parameter for backward compatibility
    if params[:availability].present? && availability_updates.empty?
      availability_updates = course_ids.map do |course_code|
        {
          "course_code" => course_code,
          "availability" => params[:availability]
        }
      end
    end

    # Debug logging
    Rails.logger.info "bulk_update_with_availability called with:"
    Rails.logger.info "assistant_id: #{assistant_id}"
    Rails.logger.info "course_ids: #{course_ids}"
    Rails.logger.info "availability_updates: #{availability_updates}"

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
          # Also remove availability for this course before destroying assignment
          AvailableTime.where(assistant_id: assistant_id, course_id: assignment.course_id).delete_all
          assignment.destroy!
          removed_assignments << assignment
        end
      end

      # Add new course assignments
      added_assignments = []
      courses_to_add.each do |course_code|
        course = courses.find { |c| c.code == course_code }
        next unless course

        # Get assigned_time from params if provided
        assigned_time = params[:assigned_time]

        ac = AssistantCourse.new(
          assistant_id: assistant_id,
          course_id: course.id
        )
        ac.save!
        added_assignments << ac
      end

      # Handle availability updates - UPDATE existing records instead of deleting/creating
      updated_availability = []
      availability_updates.each do |update_data|
        course_code = update_data[:course_code]
        course = Course.find_by(code: course_code)
        next unless course

        # Find existing availability records for this course
        existing_times = AvailableTime.where(assistant_id: assistant_id, course_id: course.id)

        if update_data[:availability].present?
          selected_days = update_data[:availability][:days] || []
          start_time_str = update_data[:availability][:start_time]
          end_time_str = update_data[:availability][:end_time]

          # Validate availability data
          if selected_days.empty? || start_time_str.blank? || end_time_str.blank?
            render json: { error: "Invalid availability data for course." }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end

          start_time = Time.zone.parse(start_time_str)
          end_time = Time.zone.parse(end_time_str)

          # If end_time is earlier than start_time, assume it's on the next day
          end_time += 1.day if end_time < start_time

          if start_time >= end_time
            render json: { error: "End time must be after start time." }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end

          # Update existing records or create new ones if they don't exist
          selected_days.each do |day|
            existing_time = existing_times.find { |at| at.day == day.downcase }
            if existing_time
              # Update existing record (preserves created_at)
              existing_time.update!(start_time: start_time, end_time: end_time)
              updated_availability << existing_time
            else
              # Create new record for this day
              at = AvailableTime.new(
                assistant_id: assistant_id,
                course_id: course.id,
                day: day.downcase,
                start_time: start_time,
                end_time: end_time
              )
              at.save!
              updated_availability << at
            end
          end

          # Remove availability for days that are no longer selected
          days_to_remove = existing_times.map(&:day) - selected_days.map(&:downcase)
          days_to_remove.each do |day|
            AvailableTime.where(assistant_id: assistant_id, course_id: course.id, day: day).delete_all
          end
        else
          # No availability data provided - remove all availability for this course
          existing_times.delete_all
        end
      end

      render json: {
        message: "Courses and availability updated successfully",
        added_courses_count: added_assignments.size,
        removed_courses_count: removed_assignments.size,
        updated_availability_count: updated_availability.size,
        data: {
          added_assignments: added_assignments.map { |ac| ac.as_json(include: [ :assistant, :course ]) },
          removed_assignments: removed_assignments.map { |ac| ac.as_json(include: [ :assistant, :course ]) },
          updated_availability: updated_availability.map { |at| at.as_json(include: [ :assistant, :course ]) }
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
      # Also include availability times for each course
      courses_with_availability = @assistant_courses.map do |ac|
        availability = AvailableTime.where(assistant_id: params[:assistant_id], course_id: ac.course_id)
        ac.as_json(include: [ :course ]).merge(
          availability_times: availability.map do |at|
            at.as_json(include: [ :course ])
          end
        )
      end
      render json: courses_with_availability
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
      @assistant_courses = AssistantCourse.includes(:assistant).where(course_id: params[:course_id])
      render json: @assistant_courses.as_json(include: [ :assistant ])
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
