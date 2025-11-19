class DropAvailableTimesAndEnum < ActiveRecord::Migration[8.0]
  def change
    drop_table :available_times
    drop_enum :day_of_week
  end
end
