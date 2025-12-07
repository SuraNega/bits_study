class UsersController < ApplicationController
  before_action :set_user, only: [ :show, :update, :destroy ]
  # before_action :authorize_assistant, only: [:index, :destroy]
  # before_action :authorize_user, only: [:show, :update]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/:id
  def show
    if @user.nil?
      render json: { error: "User not found." }, status: :not_found
    else
      render json: @user
    end
  end

  # POST /users
  def create
    Rails.logger.info "Starting user creation with params: #{user_params.except(:password, :password_confirmation)}"
    @user = User.new(user_params)
    if @user.save
      Rails.logger.info "User saved successfully: #{@user.id}"
      Rails.logger.info "Session user_id before: #{session[:user_id]}"
      session[:user_id] = @user.id
      Rails.logger.info "Session user_id after: #{session[:user_id]}"
      render json: @user, status: :created
    else
      Rails.logger.info "User save failed with errors: #{@user.errors.full_messages}"
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/:id
  def update
    if @user.nil?
      render json: { error: "User not found." }, status: :not_found
    elsif @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /users/:id
  def destroy
    @user.destroy
    render json: { message: "User was successfully deleted." }
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
    unless @user
      render json: { error: "User not found." }, status: :not_found
    end
  end

  def user_params
    # Adjust permitted params as needed
    # Note: role is removed - roles are auto-assigned based on academic_year
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :current_password, :academic_year, :telegram_username, :bio, :activity_status, :profile_picture, :active_role)
  end

  def authorize_assistant
    unless current_user&.assistant?
      render json: { error: "Access denied. Only assistants can perform this action." }, status: :forbidden
    end
  end

  def authorize_user
    unless current_user&.assistant? || current_user == @user
      render json: { error: "Access denied. You can only view or edit your own profile." }, status: :forbidden
    end
  end
end
