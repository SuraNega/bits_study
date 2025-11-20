
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";

interface Assistant {
  id: number;
  name: string;
  email: string;
  academic_year: number;
  role: string;
  created_at: string;
  updated_at: string;
  year?: number;
  rating?: number;
  courses?: string[];
  available?: boolean;
  activity_status?: string;
  availabilityLabel?: string;
  availabilityClass?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  image?: string;
  profileImage?: string | null;
  isAvailable?: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      .then((assistantsData) => {
        console.log('Raw assistants data:', assistantsData);
        // Map the assistant_courses to extract the nested assistant data
        const formattedAssistants = assistantsData.map((ac: any) => {
          const assistant = ac.assistant || ac; // Handle both nested and direct assistant objects
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
            profileImage
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

  const handleConnect = (assistantId: number) => {
    // TODO: Implement connection logic
    console.log("Connecting with assistant:", assistantId);
  };

  return (
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Assistants ({assistants.length})
            </h2>

            {assistants.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">
                  No assistants are currently available for this course.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {assistants.map((assistant) => (
                  <Card key={assistant.id} className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        {assistant.profileImage ? (
                          <img
                            src={assistant.profileImage}
                            alt={`${assistant.name} avatar`}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
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
                          <span className="font-medium text-gray-800">{assistant.rating || 4.5}</span>
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

                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm">Courses:</span>
                          <div className="flex gap-2">
                            {(assistant.courses || ['Math101', 'CS102']).map((course) => (
                              <span 
                                key={course} 
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full whitespace-nowrap"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Request Help Button */}
                      <Button
                        onClick={() => handleConnect(assistant.id)}
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
  );
}
