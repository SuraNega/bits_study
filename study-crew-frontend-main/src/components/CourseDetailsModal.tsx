
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import AssistantDetailsModal from "./AssistantDetailsModal";
import { X, Filter, Star } from "lucide-react";

interface Assistant {
  id: number;
  name: string;
  email: string;
  bio?: string;
  academic_year: number;
  role: string;
  created_at: string;
  updated_at?: string;
  profileImage?: string;
  telegram?: string;
  phone?: string;
  rating?: number;
  // Courses can be either an array of objects with code/name/special or an array of strings
  courses?: Array<{
    code: string;
    name: string;
    special: boolean;
  } | string> | null;
  // Standardized to use 'comment' instead of 'content' to match the actual data structure
  comments?: Array<{
    id: number;
    comment: string;  // Changed from 'content' to 'comment' to match the actual data structure
    rating: number;
    created_at: string;
    author: string;
  }>;
  // Additional properties from CourseDetailsModal
  year?: number;
  available?: boolean;
  activity_status?: string;
  availabilityLabel?: string;
  availabilityClass?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  image?: string;
  isAvailable?: boolean;
  averageRating?: string | null;
}

interface Course {
  id: number;
  name: string;
  code: string;
  year: string;
  semester: number;
  description: string;
  credit_hour: number;
}

interface CourseDetailsModalProps {
  courseCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseDetailsModal({
  courseCode,
  isOpen,
  onClose,
}: CourseDetailsModalProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assistantRatings, setAssistantRatings] = useState<Record<number, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    availability: 'all', // 'all', 'available', 'busy', 'not_available'
    specialCourse: false, // true = special courses only, false = all courses
    minRating: 0, // 0 means no rating filter
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (!courseCode || !isOpen) return;

    setLoading(true);
    setError(null);

    // Fetch course details
    fetch(`/courses/${courseCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch course details");
        return res.json();
      })
      .then((courseData) => {
        setCourse(courseData);
        // Fetch assistants for this course
        return fetch(`/assistant_courses/by_course/${courseData.id}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assistants");
        return res.json();
      })
      .then(async (assistantsData) => {
        console.log('Raw assistants data:', assistantsData);
        
        // Fetch ratings for each assistant
        const assistantsWithRatings = await Promise.all(assistantsData.map(async (ac: any) => {
          const assistant = ac.assistant || ac;
          
          try {
            // Fetch the assistant's details to get the latest rating
            const response = await fetch(`/assistants/${assistant.id}`, {
              credentials: 'include',
            });
            
            if (response.ok) {
              const assistantDetails = await response.json();
              return { ...assistant, ...assistantDetails };
            }
          } catch (error) {
            console.error(`Error fetching details for assistant ${assistant.id}:`, error);
          }
          
          return assistant; // Return original if fetch fails
        }));
        
        // Format the assistants
        const formattedAssistants = assistantsWithRatings.map((assistant: any) => {
          const profileImage = assistant.profile_picture_url || assistant.profile_picture || assistant.image || null;
          const normalizedStatus = (assistant.activity_status || "available").toLowerCase();
          const availabilityLabel =
            normalizedStatus === "available"
              ? "Available"
              : normalizedStatus === "busy"
              ? "Busy"
              : "Not Available";
          const availabilityClass =
            normalizedStatus === "available"
              ? "text-green-600"
              : normalizedStatus === "busy"
              ? "text-yellow-600"
              : "text-red-600";
          const isAvailable = normalizedStatus === "available";
 
          return {
            ...assistant,
            year: assistant.academic_year || 3,
            availabilityLabel,
            availabilityClass,
            isAvailable,
            profileImage,
            telegram: assistant.telegram_username // Map telegram_username to telegram
          };
        });
        setAssistants(formattedAssistants);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseCode, isOpen]);

  // Fetch ratings for all assistants when the component mounts or assistants change
  useEffect(() => {
    const fetchRatings = async () => {
      const ratings: Record<number, string> = {};
      
      // Fetch ratings for each assistant
      for (const assistant of assistants) {
        try {
          const response = await fetch(`http://localhost:3000/assistants/${assistant.id}/reviews`, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const reviews = await response.json();
            if (reviews && reviews.length > 0) {
              const averageRating = (reviews.reduce((sum: number, review: any) => 
                sum + (review.rating || 0), 0) / reviews.length).toFixed(1);
              ratings[assistant.id] = averageRating;
            } else {
              ratings[assistant.id] = 'N/A';
            }
          }
        } catch (error) {
          console.error(`Error fetching reviews for assistant ${assistant.id}:`, error);
          ratings[assistant.id] = 'N/A';
        }
      }
      
      setAssistantRatings(prev => ({ ...prev, ...ratings }));
    };

    if (assistants.length > 0) {
      fetchRatings();
    }
  }, [assistants]);

  const handleAssistantClick = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setIsAssistantModalOpen(true);
  };

  const handleCloseAssistantModal = () => {
    setIsAssistantModalOpen(false);
    setSelectedAssistant(null);
  };

  const handleConnect = async (assistantId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Requesting help from assistant:", assistantId);

    try {
      const response = await fetch('/assistant_courses/request_help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          assistant_id: assistantId,
          course_id: course?.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackMessage(data.message);
        setFeedbackType('success');
      } else {
        setFeedbackMessage(data.error || 'Failed to send help request');
        setFeedbackType('error');
      }
    } catch (error) {
      console.error('Error sending help request:', error);
      setFeedbackMessage('Network error. Please try again.');
      setFeedbackType('error');
    }

    // Clear feedback after 5 seconds
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackType(null);
    }, 5000);
  };

  const handleFilterChange = useCallback((filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const getFilteredAssistants = useCallback(() => {
    return assistants.filter(assistant => {
      // Filter by availability
      if (filters.availability !== 'all') {
        const status = (assistant.activity_status || "available").toLowerCase();
        if (filters.availability === 'available' && status !== 'available') return false;
        if (filters.availability === 'busy' && status !== 'busy') return false;
        if (filters.availability === 'not_available' && status === 'available') return false;
      }

      // Filter by special course
      if (filters.specialCourse) {
        const hasSpecialCourse = assistant.courses?.some(course => {
          if (typeof course === 'object' && course !== null) {
            return course.special === true;
          }
          return false;
        });
        if (!hasSpecialCourse) return false;
      }

      // Filter by rating
      if (filters.minRating > 0) {
        const rating = parseFloat(assistantRatings[assistant.id] || '0');
        if (rating < filters.minRating) return false;
      }

      return true;
    });
  }, [assistants, filters, assistantRatings]);

  const filteredAssistants = getFilteredAssistants();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Course Details"
        className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 my-8 border-none outline-none focus:outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
        style={{
          overlay: {
            zIndex: 50,
            backdropFilter: 'blur(2px)'
          }
        }}
    >
      {loading ? (
        <div className="text-center">Loading course details...</div>
      ) : error || !course ? (
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || "Course not found"}</div>
          <Button onClick={onClose}>Close</Button>
        </div>
      ) : (
        <div>
          {/* Feedback Message */}
          {feedbackMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              feedbackType === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {feedbackMessage}
            </div>
          )}

          {/* Course Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="mb-4"
            >
              ← Close
            </Button>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">{course.code}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {course.year} - Semester {course.semester}
                    </span>
                    <span>{course.credit_hour} Credits</span>
                  </div>
                </div>
              </div>
              {course.description && (
                <p className="mt-4 text-gray-700">{course.description}</p>
              )}
            </Card>
          </div>

          {/* Available Assistants */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Assistants ({filteredAssistants.length})
              </h2>
              
              <div className="flex items-center gap-2">
                {(filters.availability !== 'all' || filters.specialCourse || filters.minRating > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {filters.availability !== 'all' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filters.availability === 'available' ? 'Available' : 
                         filters.availability === 'busy' ? 'Busy' : 'Not Available'}
                        <button 
                          onClick={() => handleFilterChange('availability', 'all')}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 hover:bg-blue-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.specialCourse && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Special Course
                        <button 
                          onClick={() => handleFilterChange('specialCourse', false)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-200 hover:bg-purple-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.minRating > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {filters.minRating}+ <Star className="h-3 w-3 ml-1" />
                        <button 
                          onClick={() => handleFilterChange('minRating', 0)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-200 hover:bg-yellow-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <div className="absolute right-8 top-48 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={filters.availability}
                        onChange={(e) => handleFilterChange('availability', e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="not_available">Not Available</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="specialCourseCheckbox"
                        checked={filters.specialCourse}
                        onChange={(e) => handleFilterChange('specialCourse', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="specialCourseCheckbox" className="ml-2 block text-sm text-gray-700">
                        Special Course
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+` : 'None'}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.minRating}
                        onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {filteredAssistants.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">
                  {assistants.length === 0 
                    ? 'No assistants are currently available for this course.'
                    : 'No assistants match the selected filters.'}
                </p>
                {assistants.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setFilters({
                        availability: 'all',
                        specialCourse: false,
                        minRating: 0
                      });
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAssistants.map((assistant) => (
                  <Card 
                    key={assistant.id} 
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleAssistantClick(assistant)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        {assistant.profileImage ? (
                          <img
                            src={assistant.profileImage}
                            alt={`${assistant.name} avatar`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                            {assistant.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()
                              .substring(0, 2)}
                          </div>
                        )}
                      </div>

                      {/* Details in one line */}
                      <div className="flex-1 flex items-center gap-6 overflow-x-auto hide-scrollbar px-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold whitespace-nowrap text-base">{assistant.name}</h3>
                          <span className="text-gray-400">•</span>
                          <span className="whitespace-nowrap text-gray-700">Year {assistant.year || 3}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-gray-800">
                            {assistantRatings[assistant.id] || 'N/A'}
                          </span>
                          <span className="text-gray-400">•</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`font-medium text-sm ${assistant.availabilityClass || (assistant.isAvailable ? 'text-green-600' : 'text-red-600')}`}
                          >
                            {assistant.availabilityLabel || (assistant.isAvailable ? 'Available' : 'Not Available')}
                          </span>
                          <span className="text-gray-400">•</span>
                        </div>
                      </div>

                      {/* Request Help Button */}
                      <Button
                        onClick={(e) => handleConnect(assistant.id, e)}
                        disabled={assistant.available === false}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 whitespace-nowrap ml-auto"
                      >
                        Request Help
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
    
    {/* Assistant Details Modal */}
    {selectedAssistant && (
      <AssistantDetailsModal
        isOpen={isAssistantModalOpen}
        onClose={handleCloseAssistantModal}
        assistant={{
          ...selectedAssistant,
          bio: selectedAssistant.bio || "This assistant hasn't added a bio yet.",
          comments: selectedAssistant.comments || [],
          telegram: selectedAssistant.telegram,
          phone: selectedAssistant.phone,
          courses: (selectedAssistant.courses || []).map(course => {
            if (typeof course === 'string') {
              return {
                code: course,
                name: course,
                special: false
              };
            }
            return {
              code: course.code || '',
              name: course.name || course.code || '',
              special: course.special || false
            };
          })
        }}
      />
    )}
  </>
  );
}
