class AddTelegramUsernameToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :telegram_username, :string
  end
end
