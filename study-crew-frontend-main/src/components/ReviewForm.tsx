import React, { useState } from 'react';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-2">Write a Review</h4>
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
            disabled={isSubmitting}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded mb-3 h-24 text-sm"
        placeholder="Share your experience with this assistant..."
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          size="sm"
          onClick={() => onSubmit(rating, comment)}
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
