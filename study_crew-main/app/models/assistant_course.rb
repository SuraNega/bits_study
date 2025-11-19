class AssistantCourse < ApplicationRecord
  self.table_name = "assistantcourses"

  belongs_to :assistant, class_name: "User", foreign_key: "assistant_id"
  belongs_to :course

  validates :assistant_id, :course_id, presence: true
  validates :assistant_id, uniqueness: { scope: :course_id, message: "is already assigned to this course" }
end
