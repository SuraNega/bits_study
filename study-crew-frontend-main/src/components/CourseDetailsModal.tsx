
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
        setAssistants(assistantsData);
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
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto my-8"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
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
                  <Card key={assistant.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{assistant.name}</h3>
                            <p className="text-sm text-gray-600">Year {assistant.year || 3}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{assistant.rating || 4.5}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Courses:</p>
                          <div className="flex flex-wrap gap-2">
                            {(assistant.courses || ['Math101', 'CS102']).map((course) => (
                              <span key={course} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col items-end gap-3">
                        <span className={`text-sm font-medium ${(assistant.available !== false) ? 'text-green-600' : 'text-red-600'}`}>
                          {(assistant.available !== false) ? 'Available' : 'Busy'}
                        </span>
                        <Button
                          onClick={() => handleConnect(assistant.id)}
                          disabled={assistant.available === false}
                          className="bg-green-600 hover:bg-green-700 min-w-[120px]"
                        >
                          Request Help
                        </Button>
                      </div>
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
