class AvailableTime < ApplicationRecord
  belongs_to :assistant, class_name: "User", foreign_key: "assistant_id"
  belongs_to :course

  enum :day, {
    monday: "monday",
    tuesday: "tuesday",
    wednesday: "wednesday",
    thursday: "thursday",
    friday: "friday",
    saturday: "saturday"
  }

  validates :start_time, :end_time, presence: true
  validates :day, presence: true
  validate :end_time_after_start_time

  private

  def end_time_after_start_time
    return unless start_time && end_time

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end
