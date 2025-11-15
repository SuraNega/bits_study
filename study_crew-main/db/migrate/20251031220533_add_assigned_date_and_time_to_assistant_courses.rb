class AddAssignedDateAndTimeToAssistantCourses < ActiveRecord::Migration[8.0]
  def change
    add_column :assistantcourses, :assigned_date, :date
    add_column :assistantcourses, :assigned_time, :time
  end
end
