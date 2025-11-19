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


    validates :name, presence: true
    validates :email, uniqueness: true
    validates :role, presence: true, inclusion: { in: %w[ user assistant ] }
    validates :academic_year, presence: true
    validates :password, presence: true, length: { minimum: 8 }, on: :create
    validates :bio, length: { maximum: 70 }, allow_blank: true
    validate :current_password_must_be_correct, if: -> { password.present? && persisted? }

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

    def assistant?
        role == "assistant"
    end

    def user?
      role == "user"
    end

    # Override as_json to include profile_picture_url
    def as_json(options = {})
      super(options).merge(profile_picture_url: profile_picture_url)
    end
end
