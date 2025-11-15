class CoursesController < ApplicationController
  before_action :set_course, only: [ :index, :show, :update, :destroy ]
  # before_action :authorize_assistant, only: [:index, :create, :update, :destroy]
  # before_action :authorize_user, only: [:show]

  # GET /courses
  def index
    year_param = params[:year]
    semester_param = params[:semester]

    if year_param.present? && semester_param.present?
      year_label = case year_param.to_i
      when 1 then "Freshman"
      when 2 then "Sophomore"
      when 3 then "Junior"
      when 4 then "Senior"
      else nil
      end

      semester_num = case semester_param
      when "Semester 1" then 1
      when "Semester 2" then 2
      else nil
      end

      if year_label && semester_num
        @courses = Course.where(year: year_label, semester: semester_num)
      else
        @courses = Course.all
      end
    else
      @courses = Course.all
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
    params.require(:course).permit(:name, :code, :year, :semester, :description, :credit_hour)
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
