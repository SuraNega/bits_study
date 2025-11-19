class AddSpecialToAssistantCourses < ActiveRecord::Migration[8.0]
  def change
    add_column :assistantcourses, :special, :boolean, default: false
  end
end
