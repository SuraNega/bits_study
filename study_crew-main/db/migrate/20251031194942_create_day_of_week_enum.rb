class CreateDayOfWeekEnum < ActiveRecord::Migration[8.0]
  def change
    create_enum :day_of_week, [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
  end
end
