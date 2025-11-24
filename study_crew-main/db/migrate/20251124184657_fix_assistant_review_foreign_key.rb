class FixAssistantReviewForeignKey < ActiveRecord::Migration[8.0]
  def change
    # Remove the incorrect foreign key to 'assistants' table
    remove_foreign_key :assistant_reviews, :assistants

    # Add the correct foreign key to 'users' table for assistant_id
    add_foreign_key :assistant_reviews, :users, column: :assistant_id

    # Add unique index to enforce uniqueness at DB level
    add_index :assistant_reviews, [:assistant_id, :user_id], unique: true
  end
end
