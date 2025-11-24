class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
  rescue_from ActionDispatch::Http::Parameters::ParseError, with: :handle_parse_error

  def route_not_found
    render json: { error: "Not Found" }, status: :not_found
  end

  private

  def handle_standard_error(exception)
    render json: { error: "Internal Server Error", message: exception.message }, status: :internal_server_error
  end

  def handle_not_found(exception)
    render json: { error: "Not Found", message: exception.message }, status: :not_found
  end

  def handle_parse_error(exception)
    render json: { error: "Bad Request", message: "Invalid JSON format" }, status: :bad_request
  end

  # Get the current logged-in user
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  # Check if user is logged in
  def logged_in?
    !!current_user
  end

  # Require user to be logged in
  def require_login
    unless logged_in?
      render json: { error: "You must be logged in to access this resource" }, status: :unauthorized
    end
  end

  # Require admin privileges
  def require_admin
    unless current_user&.admin?
      render json: { error: "You don't have permission to perform this action" }, status: :forbidden
    end
  end

  # Skip CSRF protection for JSON requests (API)
  # protect_from_forgery with: :null_session, if: -> { request.format.json? }
end
