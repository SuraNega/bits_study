class User < ApplicationRecord
  include Rails.application.routes.url_helpers

    has_secure_password

    # Profile picture attachment
    has_one_attached :profile_picture

    attr_accessor :current_password

    # used to define the assistant and their courses
    has_many :assistant_courses, foreign_key: :assistant_id
    has_many :courses, through: :assistant_courses, source: :course


    # used to define the connections of a user(learner) and its assistant
    has_many :connections, dependent: :destroy
    has_many :assistants, through: :connections, source: :assistant

    # used to define the connections of a user(learner) and its assistant
    has_many :received_connections, class_name: "Connection", foreign_key: :assistant_id, dependent: :destroy
    has_many :learners, through: :received_connections, source: :user

    # Reviews given by this user (when they review assistants)
    has_many :reviews_given, class_name: 'AssistantReview', foreign_key: :user_id, dependent: :destroy
    
    # Reviews received by this user (when they are the assistant being reviewed)
    has_many :reviews_received, class_name: 'AssistantReview', foreign_key: :assistant_id, dependent: :destroy
    
    # Helpers for reviews
    def average_rating
      return 0 if reviews_received.empty?
      reviews_received.average(:rating).to_f.round(1)
    end
    
    def review_count
      reviews_received.count
    end


    validates :name, presence: true
    validates :email, uniqueness: true
    validates :academic_year, presence: true
    validates :password, presence: true, length: { minimum: 8 }, on: :create
    validates :bio, length: { maximum: 70 }, allow_blank: true
    validates :active_role, inclusion: { in: %w[ user assistant ] }, allow_nil: true
    validate :current_password_must_be_correct, if: -> { password.present? && persisted? }
    validate :valid_roles

    # Set default roles before create
    before_validation :set_default_roles, on: :create

    # Parse roles from JSON
    def roles
      return ["user"] if self[:roles].blank?
      JSON.parse(self[:roles]) rescue ["user"]
    end

    # Set roles as JSON
    def roles=(value)
      self[:roles] = value.is_a?(Array) ? value.to_json : value
    end

    # Check if user has a specific role
    def has_role?(role_name)
      roles.include?(role_name.to_s)
    end

    # Check if user can be an assistant (2nd year or above)
    def can_be_assistant?
      academic_year.to_i >= 2
    end

    def assistant?
      has_role?("assistant")
    end

    def user?
      has_role?("user")
    end

    # Returns relative URL path to the profile picture if attached
    def profile_picture_url
      return unless profile_picture.attached?
      rails_blob_url(profile_picture, host: ENV.fetch("RAILS_HOST", "http://localhost:3000"))
    end

    def current_password_must_be_correct
      return if current_password.blank?
      old_digest = password_digest_was
      unless old_digest && BCrypt::Password.new(old_digest) == current_password
        errors.add(:current_password, "is incorrect")
      end
    end

    # Override as_json to include roles and active_role
    def as_json(options = {})
      super(options).merge(
        profile_picture_url: profile_picture_url,
        roles: roles,
        active_role: active_role
      )
    end

    private

    def set_default_roles
      return if self[:roles].present?
      
      if can_be_assistant?
        # 2nd year and above get both roles
        self.roles = ["user", "assistant"]
        self.active_role ||= "user"
      else
        # 1st year only gets user role
        self.roles = ["user"]
        self.active_role = "user"
      end
    end

    def valid_roles
      return if roles.blank?
      
      invalid_roles = roles - ["user", "assistant"]
      if invalid_roles.any?
        errors.add(:roles, "contains invalid roles: #{invalid_roles.join(', ')}")
      end

      if roles.include?("assistant") && !can_be_assistant?
        errors.add(:roles, "1st year students cannot be assistants")
      end
    end
end

