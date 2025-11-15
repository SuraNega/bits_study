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

  # Skip CSRF protection for JSON requests (API)
  # protect_from_forgery with: :null_session, if: -> { request.format.json? }
end
