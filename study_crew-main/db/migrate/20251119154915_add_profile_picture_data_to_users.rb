class AddProfilePictureDataToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :profile_picture_data, :text
  end
end
