class RemoveAssignedDateFromAssistantCourses < ActiveRecord::Migration[8.0]
  def change
    remove_column :assistantcourses, :assigned_date, :date
  end
end
