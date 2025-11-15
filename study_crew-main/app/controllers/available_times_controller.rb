class AvailableTimesController < ApplicationController
  before_action :set_available_time, only: [ :show, :update, :destroy ]

  # GET /available_times
  def index
    @available_times = AvailableTime.includes(:assistant, :course).all
    render json: @available_times.as_json(include: [ :assistant, :course ])
  end

  # GET /available_times/by_assistant/:assistant_id
  def by_assistant
    assistant = User.find_by(id: params[:assistant_id])
    if assistant.nil?
      render json: { error: "Assistant not found." }, status: :not_found
    else
      @available_times = AvailableTime.includes(:course).where(assistant_id: params[:assistant_id])
      render json: @available_times.as_json(include: [ :course ])
    end
  end

  # GET /available_times/:id
  def show
    render json: @available_time.as_json(include: [ :assistant, :course ])
  end

  # POST /available_times
  def create
    @available_time = AvailableTime.new(available_time_params)

    if @available_time.save
      render json: @available_time.as_json(include: [ :assistant, :course ]), status: :created
    else
      render json: { errors: @available_time.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /available_times/:id
  def update
    if @available_time.update(available_time_params)
      render json: @available_time.as_json(include: [ :assistant, :course ])
    else
      render json: { errors: @available_time.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /available_times/:id
  def destroy
    @available_time.destroy
    render json: { message: "Available time was successfully deleted." }
  end

  # POST /available_times/bulk_create
  def bulk_create
    available_times = params[:available_times].map do |time_params|
      AvailableTime.new(time_params.permit(:assistant_id, :course_id, :day, :start_time, :end_time))
    end

    if available_times.all?(&:valid?)
      available_times.each(&:save!)
      render json: { message: "Available times created successfully", count: available_times.size }, status: :created
    else
      errors = available_times.flat_map { |at| at.errors.full_messages }
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  private

  def set_available_time
    @available_time = AvailableTime.find(params[:id])
  end

  def available_time_params
    params.require(:available_time).permit(:assistant_id, :course_id, :day, :start_time, :end_time)
  end
end
