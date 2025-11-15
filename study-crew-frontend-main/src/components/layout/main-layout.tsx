import { ReactNode, useState } from 'react';
import { Navbar } from './navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/components/context/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

interface Assistant {
  id: string;
  name: string;
  year: number;
  rating: number;
  courses: string[];
  available: boolean;
}

interface HelpRequest {
  assistantId: string;
  message: string;
  noteType: string;
  noteDetails: string;
}

const mockAssistants: Assistant[] = [
  { id: '1', name: 'John Doe', year: 3, rating: 4.5, courses: ['Math101', 'CS102'], available: true },
  { id: '2', name: 'Jane Smith', year: 4, rating: 4.8, courses: ['Physics201', 'Chem101'], available: true },
  { id: '3', name: 'Mike Johnson', year: 2, rating: 4.2, courses: ['Biology101', 'Math201'], available: false },
];

const noteTypes = [
  'Study Notes',
  'Exam Preparation',
  'Assignment Help',
  'Concept Explanation',
  'Practice Problems',
  'Other'
];

export function MainLayout({ children }: MainLayoutProps) {
  const { role } = useAuth();
  const [showAssistants, setShowAssistants] = useState(false);
  const [filteredAssistants, setFilteredAssistants] = useState<Assistant[]>(mockAssistants);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [helpRequest, setHelpRequest] = useState<HelpRequest>({
    assistantId: '',
    message: '',
    noteType: '',
    noteDetails: ''
  });

  const filterAssistants = () => {
    let filtered = mockAssistants;
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(assistant => assistant.year === parseInt(selectedYear));
    }
    
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(assistant => assistant.rating >= minRating);
    }
    
    setFilteredAssistants(filtered);
  };

  const handleRequestHelp = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setHelpRequest({
      ...helpRequest,
      assistantId: assistant.id
    });
    setShowHelpDialog(true);
  };

  const handleSubmitHelpRequest = () => {
    console.log('Help request submitted:', helpRequest);
    setShowHelpDialog(false);
    setHelpRequest({
      assistantId: '',
      message: '',
      noteType: '',
      noteDetails: ''
    });
    setSelectedAssistant(null);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      
      {role === 'user' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  onClick={() => setShowAssistants(!showAssistants)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {showAssistants ? 'Hide' : 'Show'} Assistants
                </Button>
                
                {showAssistants && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="year-filter">Year:</Label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          <SelectItem value="1">Year 1</SelectItem>
                          <SelectItem value="2">Year 2</SelectItem>
                          <SelectItem value="3">Year 3</SelectItem>
                          <SelectItem value="4">Year 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rating-filter">Min Rating:</Label>
                      <Select value={selectedRating} onValueChange={setSelectedRating}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4.5">4.5+</SelectItem>
                          <SelectItem value="4.0">4.0+</SelectItem>
                          <SelectItem value="3.5">3.5+</SelectItem>
                          <SelectItem value="3.0">3.0+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={filterAssistants} variant="outline">
                      Apply Filters
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {showAssistants && (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssistants.map((assistant) => (
                  <Card key={assistant.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{assistant.name}</h3>
                        <p className="text-sm text-gray-600">Year {assistant.year}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{assistant.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Courses:</p>
                      <div className="flex flex-wrap gap-1">
                        {assistant.courses.map((course) => (
                          <span key={course} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${assistant.available ? 'text-green-600' : 'text-red-600'}`}>
                        {assistant.available ? 'Available' : 'Busy'}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleRequestHelp(assistant)}
                        disabled={!assistant.available}
                        className="bg-green-600 hover:bg-green-700"
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
      
      <main className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Help Request Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Request Help from {selectedAssistant?.name}</DialogTitle>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="help-message">Message</Label>
              <Textarea
                id="help-message"
                placeholder="Describe what you need help with..."
                value={helpRequest.message}
                onChange={(e) => setHelpRequest({ ...helpRequest, message: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="note-type">Note Type</Label>
              <Select value={helpRequest.noteType} onValueChange={(value) => setHelpRequest({ ...helpRequest, noteType: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type of note you need" />
                </SelectTrigger>
                <SelectContent>
                  {noteTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="note-details">Note Details</Label>
              <Textarea
                id="note-details"
                placeholder="Specify details about the notes you need..."
                value={helpRequest.noteDetails}
                onChange={(e) => setHelpRequest({ ...helpRequest, noteDetails: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowHelpDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitHelpRequest}
                disabled={!helpRequest.message || !helpRequest.noteType}
              >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
