class AssistantReview < ApplicationRecord
  belongs_to :assistant, class_name: 'User'
  belongs_to :user
  
  validates :rating, presence: true, 
                    numericality: { 
                      only_integer: true, 
                      greater_than_or_equal_to: 1, 
                      less_than_or_equal_to: 5 
                    }
  validates :comment, length: { maximum: 1000 }, allow_blank: true
  
  # Ensure a user can only review an assistant once
  validates :assistant_id, uniqueness: { scope: :user_id, message: 'has already been reviewed by you' }
  
  # Ensure a user cannot review themselves
  validate :cannot_review_self
  
  private
  
  def cannot_review_self
    if user_id == assistant_id
      errors.add(:base, 'You cannot review yourself')
    end
  end
end
