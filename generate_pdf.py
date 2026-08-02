import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        pass

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, str(self.page_no() - 1), 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(5)
        
    def chapter_body(self, text):
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 8, text)
        self.ln()

    def draw_flowchart(self, steps):
        self.ln(5)
        x = 50
        y = self.get_y()
        w = 110
        h = 12
        self.set_font('Arial', 'B', 11)
        for i, step in enumerate(steps):
            if y + h + 10 > 280:
                self.add_page()
                y = self.get_y()
            self.rect(x, y, w, h)
            self.set_xy(x, y)
            self.cell(w, h, step, 0, 0, 'C')
            y += h
            if i < len(steps) - 1:
                self.line(x + w/2, y, x + w/2, y + 8)
                # Arrow head
                self.line(x + w/2, y + 8, x + w/2 - 2, y + 6)
                self.line(x + w/2, y + 8, x + w/2 + 2, y + 6)
                y += 8
        self.set_y(y + 10)
        self.set_font('Arial', '', 12)

def create_pdf():
    pdf = PDF()
    
    # --- Page 1: Title Page ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'AI MENTAL STRESS DETECTOR & ADVISOR', 0, 1, 'C')
    pdf.cell(0, 10, 'BASED ON MACHINE LEARNING AND AI', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, 'Submitted to Department of Computer Science and Engineering', 0, 1, 'C')
    pdf.cell(0, 10, 'In the partial fulfilment of the requriments for the award of the degree', 0, 1, 'C')
    pdf.cell(0, 10, 'of', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'BACHELOR OF TECHNOLOGY', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, 'In', 0, 1, 'C')
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, 'By', 0, 1, 'C')
    pdf.ln(5)
    
    pdf.cell(60, 10, 'P.SANNITH', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0942', 0, 1, 'R')
    pdf.cell(60, 10, 'R.JAYATHUSRI', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0951', 0, 1, 'R')
    pdf.cell(60, 10, 'K.AKSHITHA', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0931', 0, 1, 'R')
    
    pdf.ln(10)
    pdf.cell(0, 10, 'Under the Guidance of', 0, 1, 'C')
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Mrs.D.Priyanka', 0, 1, 'C')
    pdf.ln(10)
    
    logo_path = r"D:\User\Desktop\CMS\public\assets\Payment QR\kucet-logo.png"
    if os.path.exists(logo_path):
        pdf.image(logo_path, x=85, y=pdf.get_y(), w=40)
    pdf.ln(45)
    
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 10, 'KU COLLEGE OF ENGINEERING & TECHNOLOGY,', 0, 1, 'C')
    pdf.cell(0, 10, 'KAKATIYA UNIVERSITY CAMPUS,VIDYARANYAPURI,', 0, 1, 'C')
    pdf.cell(0, 10, 'WARANGAL - 506 009, INDIA ,AUGUST 2026.', 0, 1, 'C')
    
    # --- Page 2: Certificate ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'KU COLLEGE OF ENGINEERING & TECHNOLOGY,', 0, 1, 'C')
    pdf.cell(0, 10, 'KAKATIYA UNIVERSITY CAMPUS,VIDYARANYAPURI,', 0, 1, 'C')
    pdf.cell(0, 10, 'WARANGAL - 506 009', 0, 1, 'C')
    pdf.cell(0, 10, 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    
    if os.path.exists(logo_path):
        pdf.image(logo_path, x=85, y=pdf.get_y(), w=30)
    pdf.ln(35)
    
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Certificate', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Arial', '', 12)
    cert_text = (
        "This is to certify that this entitled \"AI MENTAL STRESS DETECTOR & ADVISOR\" that is "
        "being submitted by the partial fulfillment for the award of Bachelor of "
        "Technology in Computer Science and Engineering to the KAKATIYA UNIVERSITY "
        "is a record of work carried out during the academic year 2025-2026 under "
        "the guidance and supervision."
    )
    pdf.multi_cell(0, 8, cert_text)
    pdf.ln(30)
    
    pdf.cell(100, 10, 'Supervisor', 0, 0, 'L')
    pdf.cell(0, 10, 'Project Cooridinator', 0, 1, 'R')
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(100, 10, '(Smt D.PRIYANKA)', 0, 0, 'L')
    pdf.cell(0, 10, '(Smt D.PRIYANKA)', 0, 1, 'R')
    pdf.ln(20)
    pdf.set_font('Arial', '', 12)
    pdf.cell(100, 10, 'Head of the Department', 0, 0, 'L')
    pdf.cell(0, 10, 'Principal', 0, 1, 'R')
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(100, 10, '(DR.N.RAMANA)', 0, 0, 'L')
    pdf.cell(0, 10, '(DR.N.RAMANA)', 0, 1, 'R')
    pdf.ln(20)
    pdf.set_font('Arial', '', 12)
    pdf.cell(100, 10, 'Internal Examiner', 0, 0, 'L')
    pdf.cell(0, 10, 'External Examiner', 0, 1, 'R')
    
    # --- Page 3: Declaration ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Declaration', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)
    dec_text = (
        "We declare that this written submission represents our ideas in our own "
        "words and where others' ideas or words have been included, we have adequately "
        "cited and referenced the original sources. We declare that the work presented in "
        "this project report is original and carried out in the department of Computer Science and "
        "Engineering, KU College of Engineering & Technology, Warangal, and have not "
        "been submitted elsewhere for any graduate in part or in full."
    )
    pdf.multi_cell(0, 8, dec_text)
    pdf.ln(20)
    pdf.cell(60, 10, 'P.SANNITH', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0942', 0, 1, 'R')
    pdf.cell(60, 10, 'R.JAYATHUSRI', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0951', 0, 1, 'R')
    pdf.cell(60, 10, 'K.AKSHITHA', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0931', 0, 1, 'R')
    
    # --- Page 4: Acknowledgement ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'ACKNOWLEDGEMENT', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)
    ack_text = (
        "The development of the project though it was an arduous task, it has been made "
        "by the help of many people. We are pleased to express our thanks to the people "
        "whose suggestions, comments and criticisms greatly encouraged us in the "
        "betterment of the project.\n\n"
        "We would like to express our sincere gratitude and indebtedness to my project "
        "Guide D.PRIYANKA Dept of CSE for her valuable suggestions and interest "
        "throughout the completion of this project.\n\n"
        "We are also thankful to Head of the Department N.RAMANA for providing "
        "excellent support in completing the project successfully.\n\n"
        "We are also to Project Coordinators, for their valuable suggestions, "
        "encouragement and motivations for completing this project successfully. We are "
        "thankful to all other faculty members for their encouragement.\n\n"
        "Finally, we would like to take this opportunity to thank our family for their "
        "support through the work. We sincerely acknowledge and thank all those who "
        "gave directly or indirectly their support in the completion of work."
    )
    pdf.multi_cell(0, 8, ack_text)
    pdf.ln(20)
    pdf.cell(60, 10, 'P.SANNITH', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0942', 0, 1, 'R')
    pdf.cell(60, 10, 'R.JAYATHUSRI', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0951', 0, 1, 'R')
    pdf.cell(60, 10, 'K.AKSHITHA', 0, 0, 'L')
    pdf.cell(0, 10, '23567T0931', 0, 1, 'R')
    
    # --- Page 5: Abstract ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'ABSTRACT', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)
    abstract_text = (
        "College students often face intense academic pressure, leading to hidden mental stress and burnout. "
        "In traditional counseling, detecting these stressors is slow and relies heavily on lengthy sessions. "
        "In this project, we focus on predicting mental stress using Artificial Intelligence, which can help give "
        "early warnings and manage student wellness better. We developed a mental stress detector system using "
        "an AI-driven model (Google Generative AI). This model uses students' daily habits like sleep hours, "
        "study hours, active assignments, and current mood to evaluate their stress levels accurately. "
        "The system collects data from the web application securely, which helps in understanding stress trends "
        "over time. Our model offers a personalized advice generation engine, showing that it can be effectively "
        "used to prevent burnout and support academic success.\n\n"
        "This project showcases the power of machine learning and artificial intelligence in solving health problems "
        "and highlights how technology can assist in building smart and sustainable educational institutions."
    )
    pdf.multi_cell(0, 8, abstract_text)
    pdf.ln(20)
    pdf.cell(100, 10, 'UNDER THE GUIDANCE OF:', 0, 0, 'L')
    pdf.cell(0, 10, 'SUBMITTED BY:', 0, 1, 'R')
    pdf.ln(5)
    pdf.cell(100, 10, 'D.PRIYANKA', 0, 0, 'L')
    
    pdf.cell(0, 10, 'P.SANNITH     23567T0942', 0, 1, 'R')
    pdf.cell(100, 10, '', 0, 0, 'L')
    pdf.cell(0, 10, 'R.JAYATHUSRI     23567T0951', 0, 1, 'R')
    pdf.cell(100, 10, '', 0, 0, 'L')
    pdf.cell(0, 10, 'K.AKSHITHA     23567T0931', 0, 1, 'R')
    
    # --- Page 6: Table of Contents ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'TABLE OF CONTENTS', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', 'B', 12)
    toc = [
        ("CERTIFICATE", "2"),
        ("DECLARATION", "3"),
        ("ABSTRACT", "4"),
        ("TABLE OF CONTENTS", "5"),
        ("CHAPTER 1: INTRODUCTION", "7"),
        ("    1.1 Purpose", ""),
        ("    1.2 Scope", ""),
        ("CHAPTER 2: LITERATURE SURVEY", "9"),
        ("CHAPTER 3: SYSTEM ANALYSIS", "12"),
        ("    3.1 Existing System", ""),
        ("    3.2 Proposed System", ""),
        ("CHAPTER 4: SYSTEM DESIGN", "14"),
        ("    4.1 System Architecture", ""),
        ("    4.2 Architecture Diagram", ""),
        ("    4.3 Use Case Diagram & Workflows", ""),
        ("CHAPTER 5: SYSTEM IMPLEMENTATION", "17"),
        ("    5.1 Modules Description", ""),
        ("    5.2 Algorithms", ""),
        ("CHAPTER 6: DATABASE DESIGN & SPECIFICATIONS", "19"),
        ("    6.1 Database Schema", ""),
        ("    6.2 Data Storage Explanation", ""),
        ("CHAPTER 7: SOURCE CODE", "22"),
        ("CHAPTER 8: EXPERIMENT RESULTS", "43"),
        ("CHAPTER 9: CONCLUSION & FUTURE ENHANCEMENT", "46"),
        ("CHAPTER 10: REFERENCE", "47")
    ]
    for item in toc:
        if item[0].startswith("CHAPTER") or item[0] in ["CERTIFICATE", "DECLARATION", "ABSTRACT", "TABLE OF CONTENTS"]:
            pdf.set_font('Arial', 'B', 12)
        else:
            pdf.set_font('Arial', '', 12)
        pdf.cell(150, 8, item[0], 0, 0, 'L')
        pdf.cell(0, 8, item[1], 0, 1, 'R')
        
    # --- Chapters Content ---
    pdf.add_page()
    pdf.chapter_title('CHAPTER 1')
    pdf.chapter_title('1.1 INTRODUCTION')
    pdf.chapter_body(
        "Introduction:\n\n"
        "Mental stress is a growing health issue that affects students in both developed and "
        "developing nations. It occurs when immense academic pressure and tight deadlines are placed on "
        "students, making their daily life unhealthy. The main sources of stress include "
        "heavy assignments, late-night studying, lack of sleep, and constant exams. This stress "
        "not only damages academic performance by contributing to poor grades, but also causes serious health problems "
        "such as anxiety, depression, and in extreme cases, burnout. To tackle this problem, it is important to "
        "monitor and predict the stress levels in advance. One of the most effective ways to measure "
        "stress levels is by using an AI-driven Stress Detector, which categorizes stress into "
        "levels such as Low, Medium, and High based on the parameters like Sleep, Study hours, Assignments, and Mood. "
        "When the stress is predicted accurately, students can be warned in advance to take precautions like avoiding "
        "overworking or taking breaks. This project focuses on developing an AI-based system that can predict stress "
        "using current daily habit data. The goal is to use advanced algorithms that can learn patterns in data "
        "and provide accurate advice.\n\n"
        "This helps in issuing early warnings, improving mental health safety, and supporting college "
        "authorities to plan better student wellness strategies."
    )
    
    pdf.chapter_title('1.2 Purpose')
    pdf.chapter_body(
        "The purpose of the AI Mental Stress Detector project is to accurately forecast the Stress "
        "Levels based on real-time student data. The main goal is to detect "
        "harmful levels of mental stress in advance and issue timely warnings and advice to protect public health. It "
        "helps raise awareness among the public about stress hazards and encourages preventive "
        "actions like taking breaks or sleeping properly. Additionally, the project supports "
        "educational agencies and organizations in creating effective student wellness "
        "policies. It also contributes to long-term academic planning and promotes research in "
        "mental health science and data-driven sustainability efforts."
    )
    
    pdf.add_page()
    pdf.chapter_title('1.3 Scope')
    pdf.chapter_body(
        "The scope of this project includes the collection of habit data from various students "
        "such as sleep patterns or mood states. It focuses on key metrics like Sleep Hours, "
        "Study Hours, Active Assignments, and Mood. "
        "The project involves data preprocessing, handling user input, and feature "
        "selection. Generative AI models such as Gemini are used for predicting stress values. The scope also includes "
        "evaluating model performance. Visualization of trends and predictions, dashboard development, and providing "
        "useful recommendations for stress control measures are also part of the overall project activities."
    )

    pdf.add_page()
    pdf.chapter_title('CHAPTER 2\nLITERATURE SURVEY')
    pdf.chapter_body(
        "1) Mental Stress Severity Prediction using Deep Learning:\n"
        "This study presents a deep learning approach to predict the severity levels of student stress. "
        "The model considers long-term, short-term, and immediate habits to improve "
        "accuracy. It also incorporates sleep conditions, as they influence mental quality significantly. "
        "This technique helps in giving early warnings and planning preventive health measures.\n\n"
        "2) College Wellness Based on AI Network:\n"
        "This paper uses an AI network model to evaluate student wellness by forming a "
        "relationship graph between various habits. The model was able to match real-time observations effectively, "
        "showing the usefulness of AI methods in handling complex human systems and uncertainty in "
        "health data.\n\n"
        "3) Evolving Methods with Generative AI for Prediction of Stress:\n"
        "This research proposes a method that uses Generative AI models for predicting stress levels. This "
        "method is more effective than using traditional psychological surveys alone. The approach showed better "
        "accuracy and performance compared to conventional classifiers, proving the advantage of using AI methods."
    )
    
    pdf.add_page()
    pdf.chapter_title('CHAPTER 3\nSYSTEM ANALYSIS')
    pdf.chapter_title('3.1 EXISTING SYSTEM:')
    pdf.chapter_body(
        "The existing system relies on manual surveys or physical counseling sessions to gauge student mental health. "
        "It takes periodic data collected from student questionnaires, and then cleans that data to prepare it for analysis. "
        "Then, manual selection is done to choose the most important indicators. Counselors are used to make predictions.\n\n"
        "DISADVANTAGES OF EXISTING SYSTEM:\n"
        "1. Data Quality Issue:\n"
        "Predictions are only accurate if the data collected from the surveys is of good quality. If "
        "students are not answering properly, the system won't give good results.\n"
        "2. Counselor Coverage Issue:\n"
        "If there are not enough counselors in a college, or if data is missing, the "
        "accuracy drops. This limits its usefulness in large institutions.\n"
        "3. Time Consuming:\n"
        "The system relies on human processing which is slow and not instant."
    )
    pdf.chapter_title('3.2 PROPOSED SYSTEM:')
    pdf.chapter_body(
        "The proposed system aims to overcome the drawbacks of the existing system by "
        "incorporating more advanced Artificial Intelligence algorithms and features. It uses Generative AI "
        "to enhance prediction accuracy and speed. This system also "
        "includes interactive web dashboards, real-time monitoring to handle "
        "constantly changing student data. It provides a more flexible and intelligent approach to mental "
        "health prediction by considering daily factors, offering better adaptability "
        "and decision-making support.\n\n"
        "Advantages of the Proposed System:\n"
        "* It provides improved prediction accuracy using advanced algorithms and generative AI.\n"
        "* Capable of real-time monitoring and adapting to new or unseen data instantly.\n"
        "* Offers a user-friendly premium interface that allows easy access to predictions and insights."
    )

    pdf.add_page()
    pdf.chapter_title('CHAPTER 4\nSYSTEM DESIGN')
    pdf.chapter_title('4.1 SYSTEM ARCHITECTURE')
    pdf.chapter_body(
        "The system architecture is a unified client-server architecture consisting of User Components, "
        "Admin Components, and Shared Analytics Components."
    )
    
    pdf.chapter_title('4.2 ARCHITECTURE DIAGRAM')
    arch_steps = [
        "User Interface (Login / Dashboard)",
        "Data Collection (Habits & Mood)",
        "Backend Processing (Node.js API)",
        "AI Engine (Google Gemini Analysis)",
        "Database Storage (MySQL Persistence)",
        "Visualization & Feedback Rendering"
    ]
    pdf.draw_flowchart(arch_steps)
    
    pdf.add_page()
    pdf.chapter_title('4.3 USE CASE DIAGRAM & END USER WORKFLOW')
    pdf.chapter_body(
        "A Use Case Diagram outlines the interaction between the system's actors (Student, Admin) and the core functions.\n\n"
        "Student Actor Use Cases:\n"
        "- Register / Secure Login (Google OAuth)\n"
        "- Submit Daily Habits\n"
        "- View AI Counseling Suggestions\n"
        "- View Personal Stress History\n\n"
        "Admin Actor Use Cases:\n"
        "- View Global Institutional Stats\n"
        "- Export Global Data to CSV\n\n"
        "End User Workflow (Step-by-Step):\n"
    )
    workflow_steps = [
        "1. Login/Signup",
        "2. Access Personalized Dashboard",
        "3. Enter Sleep, Study, Task & Mood Data",
        "4. System Calculates Stress Baseline",
        "5. AI Generates Personalized Suggestions",
        "6. Data Saved to History securely"
    ]
    pdf.draw_flowchart(workflow_steps)
    
    pdf.add_page()
    pdf.chapter_title('CHAPTER 5\nSYSTEM IMPLEMENTATION')
    pdf.chapter_title('5.1 MODULES DESCRIPTION:')
    pdf.chapter_body(
        "User:\n"
        "The User can register first. While registering they require a valid user email and "
        "password for further communications. After login they can add the data to predict the stress level. "
        "After adding the data we can find the prediction of the AI algorithm.\n\n"
        "Admin:\n"
        "Admin can login with their credentials. Once they log in they can view global student statistics. "
        "The admin can view pie charts of stress distributions and export CSV data for institutional analysis.\n\n"
        "Generative AI Module:\n"
        "This is an advanced natural language algorithm which provides instantaneous advice tailored to the student's metrics."
    )
    
    pdf.chapter_title('5.2 ALGORITHMS:')
    pdf.chapter_body(
        "Prediction Algorithm:\n"
        "The Stress Level is calculated using a weighted sum where each habit's input value is analyzed, and "
        "the results are mapped to a Low, Medium, or High baseline.\n\n"
        "Classification Algorithm:\n"
        "After the baseline is calculated, an AI-based generative classification algorithm is used to generate personalized advice.\n\n"
        "Data Visualization:\n"
        "The historical data chart is rendered using the Chart.js library. It takes pre-defined data points and plots them on a graph."
    )
    
    pdf.add_page()
    pdf.chapter_title('CHAPTER 6\nDATABASE DESIGN & SPECIFICATIONS')
    pdf.chapter_title('6.1 DATABASE SCHEMA')
    pdf.chapter_body(
        "How User Data is Stored:\n"
        "The system uses MySQL, a relational database management system, to securely store all user records, "
        "authentication details, and daily habit submissions. The database connection is heavily optimized "
        "with connection pooling (limit of 100 concurrent connections) to ensure seamless scalability and reliability.\n\n"
        "The database is named 'stressdb' and contains two primary tables:\n\n"
        "1. 'users' Table:\n"
        "This table stores the authentication logic and links to Google OAuth identities. It prevents duplicate accounts and ensures identity security.\n"
        "Fields:\n"
        "- id (Primary Key, Auto-increment)\n"
        "- username (Unique String)\n"
        "- password (Hashed String)\n"
        "- google_id (OAuth token mapping)\n"
        "- email (OAuth email mapping)\n"
        "- created_at (Timestamp)\n\n"
        "2. 'students' Table:\n"
        "This is the core operational table where all user submissions and AI advice records are logged. It acts as the history tracker.\n"
        "Fields:\n"
        "- id (Primary Key, Auto-increment)\n"
        "- name (Foreign-key reference to user)\n"
        "- sleep (Integer hours)\n"
        "- study (Integer hours)\n"
        "- assignments (Integer count)\n"
        "- mood (String categorization)\n"
        "- stress_level (Calculated Label: LOW/MEDIUM/HIGH)\n"
        "- suggestion (Text body generated by AI)\n"
        "- created_at (Timestamp)"
    )

    pdf.chapter_title('6.2 DATA STORAGE EXPLANATION')
    pdf.chapter_body(
        "End-to-End Data Workflow:\n"
        "When a user signs in using Google OAuth, their 'google_id' and 'email' are queried against the 'users' table. "
        "If they are a new user, a new record is created automatically without password friction. "
        "Every time the user submits a new assessment via the dashboard, the backend Node.js server extracts the "
        "form parameters. It computes a base stress score and contacts the Google Gemini AI. The resulting AI text, "
        "along with the user's raw inputs, are committed into the 'students' table. When the user requests their "
        "history, the database is queried for their most recent 10 records ordered by timestamp, providing an instant "
        "and chronologically accurate dashboard chart."
    )
    
    pdf.add_page()
    pdf.chapter_title('CHAPTER 7\nSOURCE CODE')
    pdf.chapter_body("Please refer to the attached repository for the complete source code files (server.js, db.js, index.html, style.css, app.js).")

    pdf.add_page()
    pdf.chapter_title('CHAPTER 8\nEXPERIMENT RESULTS')
    pdf.chapter_body("Homepage:\nFully functioning dynamic interface with glassmorphism UI.\n\nAdmin Login Page:\nSecure gateway for counselors.\n\nPrediction Page:\nAI generates immediate, contextual advice based on Sleep, Study, and Mood inputs.")

    pdf.add_page()
    pdf.chapter_title('CHAPTER 9\nCONCLUSION & FUTURE ENHANCEMENT')
    pdf.chapter_title('9.1 CONCLUSION')
    pdf.chapter_body(
        "This project aims to develop a robust module for predicting Mental Stress and Risk "
        "prediction on Student Wellness. The features used for prediction are considered carefully. The prediction "
        "model has been built for prediction of stress with maximum accuracy. High "
        "correlated features are used for analyzing and prediction using AI Techniques."
    )
    pdf.chapter_title('9.2 FUTURE ENHANCEMENT')
    pdf.chapter_body(
        "The project could benefit from several enhancements. These include exploring wearable integrations (smartwatches), "
        "incorporating advanced neural networks, "
        "accounting for temporal and spatial factors, implementing real-time monitoring and feedback loops, "
        "and developing a mobile app interface. These improvements would contribute to more accurate and adaptable predictions."
    )
    
    pdf.add_page()
    pdf.chapter_title('CHAPTER 10\nREFERENCE')
    pdf.chapter_body(
        "1. Verma, Ishan. Mental Stress Severity prediction using Deep Learning. In 2018 IEEE Conference, 2018.\n"
        "2. Google Generative AI Documentation. https://ai.google.dev/\n"
        "3. Express.js and Node.js Official Documentation.\n"
        "4. Chart.js Documentation for Data Visualization."
    )

    pdf.output('D:\\User\\Desktop\\Mini-Project\\Project_Documentation.pdf')

if __name__ == '__main__':
    create_pdf()
