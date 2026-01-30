# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Software Engineering (B.Sc. SWE) - Regular Program Courses
swe_courses = [
  # Year I - Semester 1
  { name: 'College English I', code: 'SPRT111', credit_hour: 3, year: 'Year I', semester: 1, program: 'Software Engineering', description: 'Develop academic English skills for university-level reading, writing, and communication.' },
  { name: 'Introduction to Logic and Critical Thinking', code: 'SPRT117', credit_hour: 3, year: 'Year I', semester: 1, program: 'Software Engineering', description: 'Introduction to logical reasoning and critical thinking skills.' },
  { name: 'Discrete Mathematics', code: 'MATH161', credit_hour: 3, year: 'Year I', semester: 1, program: 'Software Engineering', description: 'Mathematical foundations for computer science including sets, logic, and combinatorics.' },
  { name: 'Introduction to Computer Systems', code: 'SWEN101', credit_hour: 3, year: 'Year I', semester: 1, program: 'Software Engineering', description: 'Introduction to computer hardware, software, and system architecture.' },
  { name: 'Geography of Ethiopia and the Horn', code: 'SPRT115', credit_hour: 3, year: 'Year I', semester: 1, program: 'Software Engineering', description: 'Study of the geography and regional context of Ethiopia and the Horn of Africa.' },
  { name: 'Fundamentals of Programming', code: 'SWEN131', credit_hour: 3, year: 'Year I', semester: 1, program: 'Software Engineering', description: 'Introduction to programming concepts and problem-solving using a high-level language.' },

  # Year I - Semester 2
  { name: 'College English II', code: 'SPRT112', credit_hour: 3, year: 'Year I', semester: 2, program: 'Software Engineering', description: 'Advanced academic English skills with focus on research and technical writing.' },
  { name: 'Moral and Civic Education', code: 'SPRT118', credit_hour: 2, year: 'Year I', semester: 2, program: 'Software Engineering', description: 'Study of ethics, moral values, and civic responsibilities.' },
  { name: 'Introduction to Software Engineering', code: 'SWEN104', credit_hour: 3, year: 'Year I', semester: 2, program: 'Software Engineering', description: 'Introduction to software engineering principles and practices.' },
  { name: 'Object Oriented Programming', code: 'SWEN132', credit_hour: 4, year: 'Year I', semester: 2, program: 'Software Engineering', description: 'Principles and practice of object-oriented programming.' },
  { name: 'Data Communication and Computer Networks I', code: 'ITSY154', credit_hour: 3, year: 'Year I', semester: 2, program: 'Software Engineering', description: 'Introduction to data communication principles and computer networking.' },
  { name: 'Linear Algebra', code: 'MATH164', credit_hour: 3, year: 'Year I', semester: 2, program: 'Software Engineering', description: 'Vector spaces, matrices, linear transformations, and applications.' },

  # Year II - Semester 1
  { name: 'General Psychology', code: 'SPRT217', credit_hour: 3, year: 'Year II', semester: 1, program: 'Software Engineering', description: 'Introduction to psychological principles and human behavior.' },
  { name: 'Information Assurance and Systems Security', code: 'ITSY256', credit_hour: 2, year: 'Year II', semester: 1, program: 'Software Engineering', description: 'Fundamentals of information security and assurance.' },
  { name: 'Fundamentals of Database Systems', code: 'SWEN241', credit_hour: 3, year: 'Year II', semester: 1, program: 'Software Engineering', description: 'Introduction to database design, implementation, and management.' },
  { name: 'Software Requirements Engineering', code: 'SWEN223', credit_hour: 3, year: 'Year II', semester: 1, program: 'Software Engineering', description: 'Requirements elicitation, analysis, specification, and validation.' },
  { name: 'Data Structures and Algorithms', code: 'SWEN233', credit_hour: 3, year: 'Year II', semester: 1, program: 'Software Engineering', description: 'Study of fundamental data structures and algorithm design.' },
  { name: 'Calculus', code: 'MATH261', credit_hour: 3, year: 'Year II', semester: 1, program: 'Software Engineering', description: 'Differential and integral calculus with applications.' },

  # Year II - Semester 2
  { name: 'Social Anthropology', code: 'SPRT214', credit_hour: 2, year: 'Year II', semester: 2, program: 'Software Engineering', description: 'Introduction to social and cultural anthropology.' },
  { name: 'Advanced Programming', code: 'SWEN232', credit_hour: 4, year: 'Year II', semester: 2, program: 'Software Engineering', description: 'Advanced programming concepts and techniques.' },
  { name: 'Process Modeling and Workflow Design', code: 'SWEN224', credit_hour: 3, year: 'Year II', semester: 2, program: 'Software Engineering', description: 'Business process modeling and workflow automation.' },
  { name: 'Software Design and Architecture', code: 'SWEN226', credit_hour: 4, year: 'Year II', semester: 2, program: 'Software Engineering', description: 'Software design patterns, architectural styles, and design principles.' },
  { name: 'Operating Systems', code: 'SWEN252', credit_hour: 3, year: 'Year II', semester: 2, program: 'Software Engineering', description: 'Operating system concepts, design, and implementation.' },
  { name: 'Boolean Algebra', code: 'MATH266', credit_hour: 3, year: 'Year II', semester: 2, program: 'Software Engineering', description: 'Boolean algebra and its applications in computer science.' },

  # Year III - Semester 1
  { name: 'Business Accounting and Management', code: 'SPRT311', credit_hour: 3, year: 'Year III', semester: 1, program: 'Software Engineering', description: 'Fundamentals of accounting and business management.' },
  { name: 'Web Systems and Services', code: 'SWEN381', credit_hour: 3, year: 'Year III', semester: 1, program: 'Software Engineering', description: 'Web technologies, web services, and web application development.' },
  { name: 'Mobile Application Development', code: 'SWEN331', credit_hour: 3, year: 'Year III', semester: 1, program: 'Software Engineering', description: 'Development of applications for mobile platforms.' },
  { name: 'Enterprise Systems', code: 'SWEN327', credit_hour: 3, year: 'Year III', semester: 1, program: 'Software Engineering', description: 'Enterprise application integration and enterprise resource planning.' },
  { name: 'Statistical Methods', code: 'MATH361', credit_hour: 3, year: 'Year III', semester: 1, program: 'Software Engineering', description: 'Statistical analysis and methods for data interpretation.' },
  { name: 'Introduction to Artificial Intelligence', code: 'SWEN363', credit_hour: 3, year: 'Year III', semester: 1, program: 'Software Engineering', description: 'Fundamentals of artificial intelligence and machine learning.' },

  # Year III - Semester 2
  { name: 'Entrepreneurship', code: 'SPRT312', credit_hour: 3, year: 'Year III', semester: 2, program: 'Software Engineering', description: 'Principles of entrepreneurship and business development.' },
  { name: 'Software Quality Assurance and Testing', code: 'SWEN322', credit_hour: 3, year: 'Year III', semester: 2, program: 'Software Engineering', description: 'Software testing techniques, quality assurance, and validation.' },
  { name: 'Software Usability and Management', code: 'SWEN324', credit_hour: 3, year: 'Year III', semester: 2, program: 'Software Engineering', description: 'User experience design and usability evaluation.' },
  { name: 'Software Project Management', code: 'SWEN376', credit_hour: 3, year: 'Year III', semester: 2, program: 'Software Engineering', description: 'Software project planning, scheduling, and management.' },
  { name: 'Methods for IS Research', code: 'SWEN366', credit_hour: 3, year: 'Year III', semester: 2, program: 'Software Engineering', description: 'Research methods and methodologies for information systems.' },
  { name: 'Foundations of Data Analytics', code: 'ITSY364', credit_hour: 3, year: 'Year III', semester: 2, program: 'Software Engineering', description: 'Data analysis, visualization, and big data fundamentals.' },

  # Year IV - Semester 1
  { name: 'Inclusiveness', code: 'SPRT411', credit_hour: 2, year: 'Year IV', semester: 1, program: 'Software Engineering', description: 'Study of diversity, equity, and inclusion in society and workplace.' },
  { name: 'Software Process Improvement', code: 'SWEN421', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Software Engineering', description: 'Software process assessment and improvement methodologies.' },
  { name: 'Continuous Integration and Deployment', code: 'SWEN423', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Software Engineering', description: 'CI/CD pipelines, DevOps practices, and automation.' },
  { name: 'Service-Oriented Architecture', code: 'SWEN425', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Software Engineering', description: 'SOA principles, web services, and microservices architecture.' },
  { name: 'Systems Thinking and Systems Approach', code: 'SWEN471', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Software Engineering', description: 'Systems theory and approaches to complex problem-solving.' },

  # Year IV - Semester 2
  { name: 'Seminar in Software Engineering', code: 'SWEN426', credit_hour: 3, year: 'Year IV', semester: 2, program: 'Software Engineering', description: 'Current topics and research in software engineering.' },
  { name: 'Software Product Management', code: 'SWEN478', credit_hour: 3, year: 'Year IV', semester: 2, program: 'Software Engineering', description: 'Product lifecycle management and software product strategy.' },
  { name: 'Software Engineering Capstone Project I', code: 'SWEN492', credit_hour: 4, year: 'Year IV', semester: 2, program: 'Software Engineering', description: 'First phase of capstone project: requirements and design.' },
  { name: 'History of Ethiopia and the Horn', code: 'SPRT416', credit_hour: 3, year: 'Year IV', semester: 2, program: 'Software Engineering', description: 'Historical development of Ethiopia and the Horn region.' },
  { name: 'Organizational Behavior', code: 'SPRT418', credit_hour: 2, year: 'Year IV', semester: 2, program: 'Software Engineering', description: 'Organizational dynamics and human behavior in organizations.' },

  # Year V - Semester 1
  { name: 'Industry Practice', code: 'SPRT591', credit_hour: 18, year: 'Year V', semester: 1, program: 'Software Engineering', description: 'Internship and practical industry experience.' },

  # Year V - Semester 2
  { name: 'Software Metrics', code: 'SWEN522', credit_hour: 3, year: 'Year V', semester: 2, program: 'Software Engineering', description: 'Software measurement and metrics for quality assessment.' },
  { name: 'Fundamentals of Financial Technology', code: 'SWEN524', credit_hour: 3, year: 'Year V', semester: 2, program: 'Software Engineering', description: 'FinTech applications, blockchain, and digital payment systems.' },
  { name: 'Computer Simulation and Modelling', code: 'SWEN552', credit_hour: 3, year: 'Year V', semester: 2, program: 'Software Engineering', description: 'Simulation techniques and modeling of complex systems.' },
  { name: 'Management Information Systems', code: 'SWEN576', credit_hour: 2, year: 'Year V', semester: 2, program: 'Software Engineering', description: 'Information systems for management decision-making.' },
  { name: 'Software Engineering Capstone Project II', code: 'SWEN592', credit_hour: 4, year: 'Year V', semester: 2, program: 'Software Engineering', description: 'Final phase of capstone project: implementation and presentation.' }
]

# Information Technology and Systems (B.Sc. ITS) - Regular Program Courses
its_courses = [
  # Year I - Semester 1
  { name: 'Introduction to Computer Systems', code: 'ITSY105', credit_hour: 3, year: 'Year I', semester: 1, program: 'Information Technology and Systems', description: 'Introduction to computer hardware, software, and system architecture.' },
  { name: 'Fundamentals of Programming', code: 'SWEN131', credit_hour: 3, year: 'Year I', semester: 1, program: 'Information Technology and Systems', description: 'Introduction to programming concepts and problem-solving using a high-level language.' },
  { name: 'College English I', code: 'SPRT111', credit_hour: 3, year: 'Year I', semester: 1, program: 'Information Technology and Systems', description: 'Develop academic English skills for university-level reading, writing, and communication.' },
  { name: 'Geography of Ethiopia and the Horn', code: 'SPRT115', credit_hour: 3, year: 'Year I', semester: 1, program: 'Information Technology and Systems', description: 'Study of the geography and regional context of Ethiopia and the Horn of Africa.' },
  { name: 'Introduction to Logic and Critical Thinking', code: 'SPRT117', credit_hour: 3, year: 'Year I', semester: 1, program: 'Information Technology and Systems', description: 'Introduction to logical reasoning and critical thinking skills.' },
  { name: 'Discrete Mathematics', code: 'MATH161', credit_hour: 3, year: 'Year I', semester: 1, program: 'Information Technology and Systems', description: 'Mathematical foundations for computer science including sets, logic, and combinatorics.' },

  # Year I - Semester 2
  { name: 'College English II', code: 'SPRT112', credit_hour: 3, year: 'Year I', semester: 2, program: 'Information Technology and Systems', description: 'Advanced academic English skills with focus on research and technical writing.' },
  { name: 'Moral and Civic Education', code: 'SPRT118', credit_hour: 2, year: 'Year I', semester: 2, program: 'Information Technology and Systems', description: 'Study of ethics, moral values, and civic responsibilities.' },
  { name: 'Linear Algebra', code: 'MATH164', credit_hour: 3, year: 'Year I', semester: 2, program: 'Information Technology and Systems', description: 'Vector spaces, matrices, linear transformations, and applications.' },
  { name: 'Basic Electronics', code: 'ITSY152', credit_hour: 3, year: 'Year I', semester: 2, program: 'Information Technology and Systems', description: 'Fundamentals of electronic circuits and devices.' },
  { name: 'Foundations of Information Systems', code: 'ITSY108', credit_hour: 3, year: 'Year I', semester: 2, program: 'Information Technology and Systems', description: 'Introduction to information systems concepts and applications.' },
  { name: 'Data Communications and Computer Networks I', code: 'ITSY154', credit_hour: 3, year: 'Year I', semester: 2, program: 'Information Technology and Systems', description: 'Introduction to data communication principles and computer networking.' },

  # Year II - Semester 1
  { name: 'General Psychology', code: 'SPRT217', credit_hour: 3, year: 'Year II', semester: 1, program: 'Information Technology and Systems', description: 'Introduction to psychological principles and human behavior.' },
  { name: 'Database Systems I', code: 'ITSY243', credit_hour: 3, year: 'Year II', semester: 1, program: 'Information Technology and Systems', description: 'Introduction to database design and SQL.' },
  { name: 'Calculus', code: 'MATH261', credit_hour: 3, year: 'Year II', semester: 1, program: 'Information Technology and Systems', description: 'Differential and integral calculus with applications.' },
  { name: 'Introduction to Web Technologies', code: 'ITSY283', credit_hour: 3, year: 'Year II', semester: 1, program: 'Information Technology and Systems', description: 'HTML, CSS, JavaScript, and web development fundamentals.' },
  { name: 'Data Communications and Computer Networks II', code: 'ITSY255', credit_hour: 3, year: 'Year II', semester: 1, program: 'Information Technology and Systems', description: 'Advanced networking concepts, protocols, and network design.' },
  { name: 'Systems Analysis and Design I', code: 'ITSY223', credit_hour: 3, year: 'Year II', semester: 1, program: 'Information Technology and Systems', description: 'Information systems analysis and design methodologies.' },

  # Year II - Semester 2
  { name: 'Information Assurance and Systems Security', code: 'ITSY256', credit_hour: 2, year: 'Year II', semester: 2, program: 'Information Technology and Systems', description: 'Fundamentals of information security and assurance.' },
  { name: 'Database Systems II', code: 'ITSY244', credit_hour: 3, year: 'Year II', semester: 2, program: 'Information Technology and Systems', description: 'Advanced database concepts, PL/SQL, and database administration.' },
  { name: 'Object Oriented Programming', code: 'SWEN132', credit_hour: 4, year: 'Year II', semester: 2, program: 'Information Technology and Systems', description: 'Principles and practice of object-oriented programming.' },
  { name: 'Boolean Algebra', code: 'MATH266', credit_hour: 3, year: 'Year II', semester: 2, program: 'Information Technology and Systems', description: 'Boolean algebra and its applications in computer science.' },
  { name: 'Systems Analysis and Design II', code: 'ITSY224', credit_hour: 3, year: 'Year II', semester: 2, program: 'Information Technology and Systems', description: 'Advanced systems analysis and design techniques.' },
  { name: 'Operating Systems', code: 'SWEN252', credit_hour: 3, year: 'Year II', semester: 2, program: 'Information Technology and Systems', description: 'Operating system concepts, design, and implementation.' },

  # Year III - Semester 1
  { name: 'Business Accounting', code: 'SPRT311', credit_hour: 3, year: 'Year III', semester: 1, program: 'Information Technology and Systems', description: 'Fundamentals of accounting and financial management.' },
  { name: 'Software Design and Construction', code: 'ITSY325', credit_hour: 3, year: 'Year III', semester: 1, program: 'Information Technology and Systems', description: 'Software design principles and construction techniques.' },
  { name: 'Web Systems and Services', code: 'SWEN381', credit_hour: 3, year: 'Year III', semester: 1, program: 'Information Technology and Systems', description: 'Web technologies, web services, and web application development.' },
  { name: 'Enterprise Systems', code: 'SWEN327', credit_hour: 3, year: 'Year III', semester: 1, program: 'Information Technology and Systems', description: 'Enterprise application integration and enterprise resource planning.' },
  { name: 'Statistical Methods', code: 'MATH361', credit_hour: 3, year: 'Year III', semester: 1, program: 'Information Technology and Systems', description: 'Statistical analysis and methods for data interpretation.' },

  # Year III - Semester 2
  { name: 'Entrepreneurship', code: 'SPRT312', credit_hour: 3, year: 'Year III', semester: 2, program: 'Information Technology and Systems', description: 'Principles of entrepreneurship and business development.' },
  { name: 'IT Systems Acquisition and Integration', code: 'ITSY328', credit_hour: 3, year: 'Year III', semester: 2, program: 'Information Technology and Systems', description: 'IT procurement, integration, and vendor management.' },
  { name: 'Cyber Security and Ethical Hacking', code: 'ITSY358', credit_hour: 3, year: 'Year III', semester: 2, program: 'Information Technology and Systems', description: 'Cybersecurity threats, defenses, and ethical hacking techniques.' },
  { name: 'IT Needs Assessment and Management', code: 'ITSY374', credit_hour: 3, year: 'Year III', semester: 2, program: 'Information Technology and Systems', description: 'IT needs analysis and technology management.' },
  { name: 'Methods for IS Research', code: 'SWEN366', credit_hour: 3, year: 'Year III', semester: 2, program: 'Information Technology and Systems', description: 'Research methods and methodologies for information systems.' },
  { name: 'Foundations of Data Analytics', code: 'ITSY364', credit_hour: 3, year: 'Year III', semester: 2, program: 'Information Technology and Systems', description: 'Data analysis, visualization, and big data fundamentals.' },

  # Year IV - Semester 1
  { name: 'Inclusiveness', code: 'SPRT411', credit_hour: 2, year: 'Year IV', semester: 1, program: 'Information Technology and Systems', description: 'Study of diversity, equity, and inclusion in society and workplace.' },
  { name: 'Systems Thinking and Systems Approach', code: 'SWEN471', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Information Technology and Systems', description: 'Systems theory and approaches to complex problem-solving.' },
  { name: 'IT Project Management', code: 'ITSY471', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Information Technology and Systems', description: 'IT project planning, execution, and management methodologies.' },
  { name: 'Cloud Computing and Data Centre Management', code: 'ITSY481', credit_hour: 3, year: 'Year IV', semester: 1, program: 'Information Technology and Systems', description: 'Cloud services, virtualization, and data center operations.' },
  { name: 'IT Capstone Project I', code: 'ITSY493', credit_hour: 4, year: 'Year IV', semester: 1, program: 'Information Technology and Systems', description: 'First phase of IT capstone project: planning and requirements.' },

  # Year IV - Semester 2
  { name: 'History of Ethiopia and the Horn', code: 'SPRT416', credit_hour: 3, year: 'Year IV', semester: 2, program: 'Information Technology and Systems', description: 'Historical development of Ethiopia and the Horn region.' },
  { name: 'Basics of Organizational Behaviour', code: 'SPRT418', credit_hour: 2, year: 'Year IV', semester: 2, program: 'Information Technology and Systems', description: 'Organizational dynamics and human behavior in organizations.' },
  { name: 'Special Topics in IT', code: 'ITSY474', credit_hour: 3, year: 'Year IV', semester: 2, program: 'Information Technology and Systems', description: 'Current and emerging topics in information technology.' },
  { name: 'IT Service Management', code: 'ITSY476', credit_hour: 3, year: 'Year IV', semester: 2, program: 'Information Technology and Systems', description: 'ITIL framework and IT service delivery best practices.' },
  { name: 'IT Capstone Project II', code: 'ITSY494', credit_hour: 4, year: 'Year IV', semester: 2, program: 'Information Technology and Systems', description: 'Final phase of IT capstone project: implementation and delivery.' }
]

# Combine all courses
all_courses = swe_courses + its_courses

# Create or update courses
all_courses.each do |course_attrs|
  Course.find_or_create_by!(code: course_attrs[:code]) do |course|
    course.assign_attributes(course_attrs)
  end
end

puts "Seeded #{Course.count} courses successfully!"
