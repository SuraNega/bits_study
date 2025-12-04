class AddRolesToUsers < ActiveRecord::Migration[8.0]
  def up
    add_column :users, :roles, :text
    add_column :users, :active_role, :string

    # Migrate existing users: convert role to roles array
    # 2nd year+ students get both roles, 1st year only gets "user"
    User.reset_column_information
    User.find_each do |user|
      if user.academic_year.to_i >= 2
        # 2nd year and above get both roles
        roles = ["user", "assistant"]
        active_role = user.role || "user"
      else
        # 1st year only gets user role
        roles = ["user"]
        active_role = "user"
      end
      user.update_columns(roles: roles.to_json, active_role: active_role)
    end
  end

  def down
    remove_column :users, :roles
    remove_column :users, :active_role
  end
end
