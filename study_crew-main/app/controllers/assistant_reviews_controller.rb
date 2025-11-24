class AssistantReviewsController < ApplicationController
  before_action :require_login, except: [:index, :show, :by_assistant, :by_user]
  before_action :set_assistant_review, only: [:show, :update, :destroy]
  before_action :authorize_user, only: [:update, :destroy]

  # GET /assistant_reviews
  def index
    @assistant_reviews = AssistantReview.all
    render json: @assistant_reviews
  end

  # GET /assistant_reviews/1
  def show
    render json: @assistant_review
  end

  # POST /assistant_reviews
  def create
    @assistant_review = current_user.reviews_given.new(assistant_review_params)

    if @assistant_review.save
      render json: @assistant_review, status: :created, location: @assistant_review
    else
      render json: { errors: @assistant_review.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique
    render json: { errors: ["Assistant has already been reviewed by you"] }, status: :unprocessable_entity
  end

  # PATCH/PUT /assistant_reviews/1
  def update
    if @assistant_review.update(assistant_review_params)
      render json: @assistant_review
    else
      render json: { errors: @assistant_review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /assistant_reviews/1
  def destroy
    @assistant_review.destroy
    head :no_content
  end

  # GET /assistants/:assistant_id/reviews
  def by_assistant
    @reviews = AssistantReview.where(assistant_id: params[:assistant_id])
      .includes(:user)
      .order(created_at: :desc)
    render json: @reviews, include: :user
  end

  # GET /users/:user_id/reviews
  def by_user
    @reviews = AssistantReview.where(user_id: params[:user_id])
      .includes(:assistant)
      .order(created_at: :desc)
    render json: @reviews, include: :assistant
  end

  private

  def set_assistant_review
    @assistant_review = AssistantReview.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Review not found" }, status: :not_found
  end

  def assistant_review_params
    params.require(:assistant_review).permit(:assistant_id, :rating, :comment)
  end

  def authorize_user
    if @assistant_review.nil?
      render json: { error: "Review not found" }, status: :not_found
    elsif !current_user.admin? && @assistant_review.user != current_user
      render json: { error: "You are not authorized to perform this action" }, status: :forbidden
    end
  end
end
