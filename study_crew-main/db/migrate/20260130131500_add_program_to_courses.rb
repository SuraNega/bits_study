class AddProgramToCourses < ActiveRecord::Migration[8.0]
  def change
    add_column :courses, :program, :string
  end
end
