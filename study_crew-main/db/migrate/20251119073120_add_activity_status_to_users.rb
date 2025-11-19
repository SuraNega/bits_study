class AddActivityStatusToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :activity_status, :string
  end
end