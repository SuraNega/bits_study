class AddRatingToConnections < ActiveRecord::Migration[8.0]
  def change
    add_column :connections, :rating, :integer
    add_column :connections, :review, :text
    add_column :connections, :reviewed_at, :datetime
  end
end
