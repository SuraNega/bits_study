import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Star, MessageSquare, BookOpen, Clock, Mail } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface Review {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface Assistant {
  id: number;
  name: string;
  email: string;
  bio?: string;
  academic_year: number;
  role: string;
  created_at: string;
  profileImage?: string;
  telegram?: string;
  phone?: string;
  rating?: number;
  courses?: Array<{
    code: string;
    name: string;
    special: boolean;
  }>;
  reviews?: Review[];
  comments?: Array<{
    id: number;
    comment: string;
    rating: number;
    created_at: string;
    author: string;
  }>;
}

interface AssistantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assistant: Assistant | null;
}

export default function AssistantDetailsModal({
  isOpen,
  onClose,
  assistant,
}: AssistantDetailsModalProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews when modal opens
  useEffect(() => {
    const fetchReviews = async () => {
      if (!assistant) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3000/assistants/${assistant.id}/reviews`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && assistant) {
      fetchReviews();
    }
  }, [isOpen, assistant]);
  React.useEffect(() => {
    if (isOpen && assistant) {
      fetchReviews();
    }
  }, [isOpen, assistant?.id]);

  const fetchReviews = async () => {
    if (!assistant) return;
    try {
      const response = await fetch(`http://localhost:3000/assistants/${assistant.id}/reviews`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // Map API response to frontend format
        const mappedReviews = data.map((review: any) => ({
          id: review.id,
          comment: review.comment,
          rating: review.rating,
          created_at: review.created_at,
          author: review.user?.name || 'Anonymous'
        }));
        setReviews(mappedReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  if (!assistant) return null;

  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, comment) => sum + comment.rating, 0) / reviews.length).toFixed(1)
    : "N/A";

const handleSubmitReview = async (rating: number, comment: string) => {
    setIsSubmitting(true);
    try {
      // 1. Check if user is logged in (session-based auth)
      // Note: Token check removed as backend uses sessions, not JWT

      // 2. Send POST request to Rails
      // Adjust URL port if needed (Rails usually runs on 3000)
      const response = await fetch("http://localhost:3000/assistant_reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        // 3. The Payload MUST wrap parameters in 'assistant_review'
        body: JSON.stringify({
          assistant_review: {
            assistant_id: assistant.id,
            rating: rating,
            comment: comment // Backend expects 'comment', not 'content'
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 4. Handle Rails Validation Errors (e.g., "User has already been reviewed")
        const errorMessage = data.errors 
          ? data.errors.join(", ") 
          : "Failed to submit review";
        throw new Error(errorMessage);
      }

      // 5. Refetch reviews to update the list
      await fetchReviews();
      setShowReviewForm(false);
      
    } catch (error) {
      console.error('Failed to submit review:', error);
      // This will show your model's validation error: "Assistant has already been reviewed by you"
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Assistant Details"
      className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 my-8 border-none outline-none focus:outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
      style={{
        overlay: {
          zIndex: 50,
          backdropFilter: 'blur(2px)'
        }
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{assistant.name}</h2>
            <p className="text-gray-600">{assistant.email}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {assistant.profileImage ? (
                  <img
                    src={assistant.profileImage}
                    alt={`${assistant.name}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/10"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
                    {assistant.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{averageRating}</span>
                    <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Year {assistant.academic_year}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assistant.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {assistant.role === 'admin' ? 'Admin' : 'Teaching Assistant'}
                    </span>
                  </div>
                </div>

                <>
                  <Button 
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setShowContactModal(true)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Show Contact Info
                  </Button>

                  {/* Contact Info Modal */}
                  <Modal
                    isOpen={showContactModal}
                    onRequestClose={() => setShowContactModal(false)}
                    contentLabel="Contact Information"
                    className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 border-none outline-none focus:outline-none"
                    overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    style={{
                      overlay: {
                        zIndex: 1000
                      }
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Contact {assistant.name}</h3>
                        <button 
                          onClick={() => setShowContactModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-600" />
                          <a 
                            href={`mailto:${assistant.email}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {assistant.email}
                          </a>
                        </div>
                        
                        {assistant.telegram && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.527 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.1-.29.2-.44.2-.17 0-.26-.06-.34-.22l-1.564-2.15-2.99-.3c-.658-.07-.658-.64.1-.95l11.54-4.45c.538-.2 1.05-.13 1.28.33.18.41.01.63-.31.83z"/>
                            </svg>
                            <a 
                              href={`https://t.me/${assistant.telegram.replace('@', '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              @{assistant.telegram.replace('@', '')}
                            </a>
                          </div>
                        )}
                        
                        {assistant.phone && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a 
                              href={`tel:${assistant.phone.replace(/\D/g, '')}`}
                              className="text-gray-700 hover:text-blue-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {assistant.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </Modal>
                </>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* About Me */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">About Me</h3>
              <p className="text-gray-700">{assistant.bio}</p>
            </Card>

            {/* Courses Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Courses</h3>
              <div className="space-y-2">
                {assistant.courses && assistant.courses.length > 0 ? (
                  assistant.courses.map((course) => {
                    const courseCode = typeof course === 'string' ? course : course.code || '';
                    const courseName = typeof course === 'string' ? course : course.name || course.code || '';
                    const isSpecial = typeof course === 'object' ? course.special : false;
                    
                    return (
                      <div 
                        key={courseCode} 
                        className={`p-3 rounded-lg ${
                          isSpecial ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{courseName}</div>
                        <div className="text-sm text-gray-500">{courseCode}</div>
                        {isSpecial && (
                          <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Specialization
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No courses assigned yet</p>
                )}
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Reviews</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  disabled={isSubmitting}
                >
                  {showReviewForm ? 'Cancel' : 'Leave a Review'}
                </Button>
              </div>
              
              {showReviewForm && (
                <ReviewForm
                  onSubmit={handleSubmitReview}
                  onCancel={() => setShowReviewForm(false)}
                  isSubmitting={isSubmitting}
                />
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading reviews...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{review.user?.name || 'Anonymous'}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Modal>
  );
}
