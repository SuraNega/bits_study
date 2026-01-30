class Course < ApplicationRecord
        has_many :assistant_courses, dependent: :destroy
        has_many :assistants, through: :assistant_courses, source: :assistant


        validates :name, presence: true
        validates :code, uniqueness: true, presence: true
        validates :year, presence: true
        validates :semester, presence: true
        validates :description, presence: true
        validates :credit_hour, presence: true
        validates :program, presence: true, inclusion: { in: ['Software Engineering', 'Information Technology and Systems'] }
end
