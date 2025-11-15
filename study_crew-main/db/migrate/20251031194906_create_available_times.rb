class CreateAvailableTimes < ActiveRecord::Migration[8.0]
  def change
    create_table :available_times do |t|
      t.integer :assistant_id, null: false
      t.integer :course_id, null: false
      t.string :day, null: false
      t.time :start_time, null: false
      t.time :end_time, null: false
      t.timestamps
    end

    add_foreign_key :available_times, :users, column: :assistant_id
    add_foreign_key :available_times, :courses
    add_index :available_times, [ :assistant_id, :course_id ]
  end
end
