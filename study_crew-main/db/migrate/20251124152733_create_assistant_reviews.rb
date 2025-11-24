class CreateAssistantReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :assistant_reviews do |t|
      t.references :assistant, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :rating
      t.text :comment

      t.timestamps
    end
  end
end
