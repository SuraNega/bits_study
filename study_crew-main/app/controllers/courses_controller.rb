class CoursesController < ApplicationController
  before_action :set_course, only: [ :index, :show, :update, :destroy ]
  # before_action :authorize_assistant, only: [:index, :create, :update, :destroy]
  # before_action :authorize_user, only: [:show]

  # GET /courses
  def index
    year_param = params[:year]
    semester_param = params[:semester]
    program_param = params[:program]

    # Start with all courses
    @courses = Course.all

    # Filter by year if provided
    if year_param.present?
      year_label = case year_param.to_i
      when 1 then "Year I"
      when 2 then "Year II"
      when 3 then "Year III"
      when 4 then "Year IV"
      when 5 then "Year V"
      else nil
      end

      @courses = @courses.where(year: year_label) if year_label
    end

    # Filter by semester if provided
    if semester_param.present?
      semester_num = case semester_param
      when "Semester 1" then 1
      when "Semester 2" then 2
      else nil
      end

      @courses = @courses.where(semester: semester_num) if semester_num
    end

    # Filter by program if provided
    if program_param.present?
      @courses = @courses.where(program: program_param)
    end

    render json: @courses
  end

  # GET /courses/:id
  def show
    if @course.nil?
      render json: { error: "Course not found." }, status: :not_found
    else
      render json: @course
    end
  end

  # POST /courses
  def create
    @course = Course.new(course_params)
    if @course.save
      render json: @course, status: :created
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /courses/:id
  def update
    if @course.nil?
      render json: { error: "Course not found." }, status: :not_found
    elsif @course.update(course_params)
      render json: @course
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /courses/:id
  def destroy
    if @course.nil?
      render json: { error: "Course not found." }, status: :not_found
    else
      @course.destroy
      render json: { message: "Course was successfully deleted." }
    end
  end

  private

  def set_course
    @course = Course.find_by(code: params[:id])
  end

  def course_params
    # Adjust permitted params based on the Course model attributes
    params.require(:course).permit(:name, :code, :year, :semester, :description, :credit_hour, :program)
  end

  def authorize_assistant
    unless current_user&.assistant?
      render json: { error: "Access denied. Only assistants can perform this action." }, status: :forbidden
    end
  end

  def authorize_user
    unless current_user&.assistant? || current_user&.student?
      render json: { error: "Access denied. You need proper authorization to perform this action." }, status: :forbidden
    end
  end
end
