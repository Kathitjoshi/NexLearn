# NexLearn - Learning Management System

<!-- Badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-green.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/JWT-Enabled-yellow.svg)](https://jwt.io/)

---

<!-- Screenshots / Hero -->
<img width="2835" height="1439" alt="Screenshot 2026-04-09 155509" src="https://github.com/user-attachments/assets/93557f8d-7e08-4a12-9730-29c60878fec0" />

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Architecture](#project-architecture)
5. [Use Cases](#use-cases)
6. [API Endpoints](#api-endpoints)
7. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [MongoDB Atlas Setup](#mongodb-atlas-setup)
   - [Running the Backend](#running-the-backend)
   - [Running the Frontend](#running-the-frontend)
8. [Project Structure](#project-structure)
9. [Database Schema](#database-schema)
10. [Security](#security)
11. [Team](#team)
12. [License](#license)

---

## About the Project

NexLearn is a full-stack Learning Management System (LMS) built as part of the **UE23CS352B - Object Oriented Analysis & Design** course at PES University. It provides a complete platform where instructors can create and publish courses with lessons, chapters, and quizzes, while students can browse, enroll, learn, and track their progress.

The system supports two distinct user roles:

- **Instructors** - Can create courses, manage lessons and quizzes, and monitor student progress
- **Students** - Can browse courses, enroll, complete lessons, and take quizzes

NexLearn demonstrates core OOAD principles including MVC architecture, RESTful API design, JWT-based authentication, and a responsive single-page application frontend.

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Register and login with JWT-based authentication supporting Student and Instructor roles |
| **Course Browsing** | Search and filter available courses by title or description |
| **Course Creation** | Multi-step course creation wizard for instructors with lessons, chapters, and quizzes |
| **Course Enrollment** | One-click enrollment for students into available courses |
| **Lesson Management** | Structured lessons with expandable chapters for organized content delivery |
| **Progress Tracking** | Real-time lesson completion tracking with visual progress indicators |
| **Quiz System** | Course-end quizzes with multiple-choice questions and scored results |
| **Student Monitoring** | Instructors can view enrolled students and their lesson progress |
| **Profile Management** | Users can update their profile information and password |
| **Contact Support** | Contact form for general inquiries and support requests |
| **Responsive Design** | Fully responsive UI with dark theme optimized for all screen sizes |
| **Data Seeding** | Automatic sample data generation on first startup |

### Security Features

- JWT (JSON Web Token) authentication for all protected routes
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS-enabled API
- Stateless session management

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ | Core programming language |
| Spring Boot | 3.4 | MVC framework and REST API |
| Spring Security | 6.x | Authentication and authorization |
| Spring Data MongoDB | 3.4 | NoSQL database integration |
| JWT (jjwt) | 0.11.5 | Token-based authentication |
| Maven | 3.x | Build tool and dependency management |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type-safe JavaScript |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Framer Motion | 12 | Animations and transitions |
| React Hook Form | 7 | Form handling and validation |
| Zod | 3.24 | Schema validation |
| Sonner | 2.0 | Toast notifications |
| Radix UI | - | Accessible UI primitives |
| Lucide React | - | Icon library |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database (free tier) |

---

## Project Architecture

```
NexLearn/
|
|-- NexLearn_backend/           # Spring Boot Backend
|   |-- backend/
|       |-- src/main/java/
|       |   |-- ooadproject/
|       |       |-- controllers/    # REST API Controllers
|       |       |-- models/          # MongoDB Document models
|       |       |-- repositories/    # Data access layer
|       |       |-- services/        # Business logic layer
|       |       |-- dto/             # Data transfer objects
|       |       |-- config/          # Security and app config
|       |-- src/main/resources/
|       |   |-- application.properties
|       |-- pom.xml
|
|-- NexLearn_frontend/          # Next.js Frontend
|   |-- frontend/
|       |-- app/                  # Next.js App Router pages
|       |   |-- login/
|       |   |-- signup/
|       |   |-- courses/
|       |   |-- enrolled/
|       |   |-- instructor/
|       |   |-- profile/
|       |   |-- contact/
|       |   |-- about/
|       |-- components/           # Reusable UI components
|       |-- types/                # TypeScript type definitions
|       |-- lib/                   # Utility functions
|       |-- package.json
|
|-- README.md
```

### Architecture Diagram

```
                    +------------------+
                    |   Client/Browser  |
                    +--------+---------+
                             |
                             v
+----------------+    +------+-------+    +-----------------+
|  Next.js 15    | -> | REST API      | -> |   MongoDB Atlas  |
|  (Port 3000)   |    | Spring Boot   |    |  (Cloud NoSQL)   |
|  Frontend      |    | (Port 8090)   |    |                 |
+----------------+    +--------------+    +-----------------+
                             ^
                             |
                    [ JWT Authentication ]
```

---

## Use Cases

NexLearn implements **10 use cases** as defined in the OOAD requirements:

| UC | Use Case | Description |
|----|----------|-------------|
| UC-01 | User Registration | Register as Student or Instructor at `/signup` |
| UC-02 | Login / Logout | Authenticate using JWT tokens at `/login` |
| UC-03 | Course Creation | Create courses with title, description, difficulty at `/instructor/create` |
| UC-04 | Course Enrollment | Enroll in courses from the course detail page |
| UC-05 | Content Management | Manage lessons and chapters within course creation flow |
| UC-06 | Learning Dashboard | Track lesson progress at `/enrolled/:id` |
| UC-07 | Student Monitoring | Instructors view enrolled students at `/instructor/courses/:id/students` |
| UC-08 | Search Courses | Search and filter courses by title/description at `/courses` |
| UC-09 | Profile Management | Update user profile and password at `/profile` |
| UC-10 | Contact Support | Submit contact messages at `/contact` |

---

## API Endpoints

**Base URL:** `http://localhost:8090`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user (Student or Instructor) |
| POST | `/api/auth/login` | Login and receive JWT token |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses (supports `?search=` query) |
| GET | `/courses/{id}` | Get course by ID |
| POST | `/courses/create` | Create a new course (Instructor only) |
| GET | `/courses/instructor/{id}` | Get courses by instructor |

### Lessons

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lessons/course/{courseId}` | Get all lessons for a course |
| POST | `/lessons/create` | Create a lesson with chapters |

### Enrollment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/enroll/user/{userId}` | Get enrolled courses for a user |
| POST | `/enroll/{userId}/{courseId}` | Enroll a student in a course |
| DELETE | `/enroll/{userId}/{courseId}` | De-enroll from a course |
| GET | `/enroll/students/{courseId}` | Get students enrolled in a course (Instructor) |

### Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lesson-progress/{userId}/{courseId}` | Get lesson progress for a user in a course |
| POST | `/lesson-progress/complete/{userId}/{courseId}/{lessonId}` | Mark a lesson as complete |

### Quiz

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quiz/{courseId}` | Get quiz for a course |
| POST | `/quiz/add` | Add quiz to a course |
| POST | `/quiz/submit` | Submit quiz answers and get score |
| GET | `/quiz/response/{courseId}/{userId}` | Get quiz response for a user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/{id}` | Get user profile |
| PUT | `/users/{id}` | Update user profile |

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contact` | Submit a contact/support message |

---

## Getting Started

### Prerequisites

| Tool | Minimum Version | Recommended |
|------|----------------|-------------|
| Java JDK | 17 | 21 |
| Maven | 3.6 | 3.9+ |
| Node.js | 18 | 20 LTS |
| npm | 9 | 10+ |
| MongoDB Atlas | - | Free tier cluster |

### MongoDB Atlas Setup

1. **Create an account** at [cloud.mongodb.com](https://cloud.mongodb.com)

2. **Create a cluster:**
   - Select "Free Tier (M0)"
   - Choose a region closest to you
   - Click "Create"

3. **Create a database user:**
   - Go to Security -> Database Access
   - Click "Add New Database User"
   - Set username and password (remember these!)
   - Grant "Read and Write to any database"

4. **Configure network access:**
   - Go to Security -> Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development

5. **Get your connection string:**
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database user's password

6. **Update application.properties:**
   ```
   spring.data.mongodb.uri=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.XXXXX.mongodb.net/?appName=Cluster0
   spring.data.mongodb.database=nexlearn
   ```

### Running the Backend

```bash
# Navigate to backend directory
cd NexLearn_backend/backend

# Run with Maven wrapper
./mvnw spring-boot:run

# OR with Maven installed globally
mvn spring-boot:run
```

The backend will start on **http://localhost:8090**.

On first startup, the application will:
- Connect to MongoDB Atlas
- Auto-create all required collections
- Seed sample courses, lessons, and quizzes (if `nexlearn.seed.enabled=true`)

### Running the Frontend

```bash
# Navigate to frontend directory
cd NexLearn_frontend/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:3000**.

---

## Project Structure

### Backend Structure (Spring Boot)

```
backend/
|-- src/main/java/ooadproject/ooadproject/
|   |-- OoadprojectApplication.java        # Main entry point
|   |-- controllers/                       # REST controllers
|   |   |-- AuthController.java           # Login/Register endpoints
|   |   |-- CoursesController.java         # Course CRUD operations
|   |   |-- LessonController.java          # Lesson management
|   |   |-- LessonProgressController.java  # Progress tracking
|   |   |-- QuizController.java            # Quiz operations
|   |   |-- EnrollController.java          # Enrollment management
|   |   |-- UserController.java           # User profile
|   |   |-- ContactController.java         # Contact form
|   |-- models/                            # MongoDB document classes
|   |   |-- Users.java
|   |   |-- Courses.java
|   |   |-- Lessons.java
|   |   |-- Quiz.java
|   |   |-- Question.java
|   |   |-- Answer.java
|   |   |-- Enroll.java
|   |   |-- LessonProgress.java
|   |   |-- QuizResponse.java
|   |   |-- ContactMessage.java
|   |-- repositories/                      # Spring Data repositories
|   |-- services/                          # Business logic layer
|   |-- dto/                               # Data transfer objects
|   |   |-- AuthRequest.java
|   |   |-- AuthResponse.java
|   |   |-- RegisterRequest.java
|   |   |-- UserDTO.java
|   |-- config/                            # Configuration classes
|       |-- SecurityConfig.java            # Spring Security config
|       |-- JwtAuthenticationFilter.java   # JWT filter
|       |-- DataSeeder.java                # Sample data seeder
|-- src/main/resources/
|   |-- application.properties             # App configuration
|-- pom.xml                               # Maven dependencies
```

### Frontend Structure (Next.js)

```
frontend/
|-- app/                                   # App Router pages
|   |-- layout.tsx                         # Root layout with providers
|   |-- page.tsx                           # Home page
|   |-- login/page.tsx                     # Login page
|   |-- signup/page.tsx                    # Registration page
|   |-- courses/
|   |   |-- page.tsx                       # Course listing
|   |   |-- [id]/page.tsx                  # Course detail
|   |-- enrolled/
|   |   |-- page.tsx                       # My Learning dashboard
|   |   |-- [id]/
|   |       |-- page.tsx                   # Lesson viewer
|   |       |-- quiz/page.tsx              # Quiz page
|   |-- instructor/
|   |   |-- page.tsx                       # Instructor dashboard
|   |   |-- create/page.tsx                # Course creation wizard
|   |   |-- courses/[id]/students/page.tsx  # Student monitoring
|   |-- profile/page.tsx                   # User profile
|   |-- contact/page.tsx                   # Contact page
|   |-- about/page.tsx                     # About page
|-- components/
|   |-- Navbar.tsx                         # Navigation bar
|   |-- ui/                                # Shadcn/ui components
|-- types/
|   |-- index.ts                           # TypeScript interfaces
|-- lib/
|   |-- utils.ts                           # Utility functions
|-- package.json
|-- next.config.ts
|-- tsconfig.json
|-- tailwind.config.ts
```

---

## Database Schema

### Collections

#### users
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (bcrypt hashed)",
  "firstName": "string",
  "lastName": "string",
  "role": "STUDENT | INSTRUCTOR"
}
```

#### courses
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "instructor_id": "ObjectId",
  "difficulty": "Beginner | Intermediate | Advanced",
  "hours": "integer",
  "lessons": "integer",
  "price": "Free",
  "rating": "integer (1-5)"
}
```

#### lessons
```json
{
  "_id": "ObjectId",
  "title": "string",
  "chapters": ["string"],
  "courseId": "ObjectId",
  "order": "integer"
}
```

#### quizzes
```json
{
  "_id": "ObjectId",
  "courseId": "ObjectId",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    }
  ]
}
```

#### enrollments
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "courseId": "ObjectId",
  "enrolledAt": "datetime"
}
```

#### lesson_progress
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "courseId": "ObjectId",
  "lessonId": "ObjectId",
  "completed": "boolean"
}
```

#### quiz_responses
```json
{
  "_id": "ObjectId",
  "courseId": "ObjectId",
  "userId": "ObjectId",
  "answers": [
    {
      "questionText": "string",
      "selectedAnswer": "string",
      "correct": "boolean"
    }
  ],
  "score": "integer",
  "submittedAt": "datetime"
}
```

#### contact_messages
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "sentAt": "datetime"
}
```

---

## Security

NexLearn implements several security measures:

### Authentication
- **JWT (JSON Web Tokens)** for stateless authentication
- Tokens are validated on every protected API request
- Token expiration set to 24 hours (configurable in `application.properties`)

### Password Security
- **BCrypt** password hashing with salt rounds
- Minimum 6-character password requirement

### API Security
- **Spring Security** with JWT filter chain
- Role-based access control restricting course creation to instructors only
- CORS enabled for cross-origin requests from the frontend

### Data Protection
- No sensitive data stored in plain text
- JWT tokens stored in client-side localStorage (production apps should use httpOnly cookies)
- MongoDB Atlas provides encryption at rest and in transit

---

## Security Configuration (SecurityConfig.java)

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/courses", "/courses/**", "/contact", "/quiz/**").permitAll()
            .requestMatchers("/courses/create", "/lessons/create", "/quiz/add").hasAuthority("INSTRUCTOR")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}
```

---

## How It Works

### User Flow

#### As an Instructor:
1. Register with the **Instructor** role at `/signup`
2. Login at `/login`
3. Navigate to **Your Courses** via the navbar
4. Click **+ Create New Course**
5. **Step 1:** Enter course details (title, description, difficulty, duration)
6. **Step 2:** Add lessons and chapters for the course
7. **Step 3:** Add quiz questions with correct answers
8. Publish the course and share it with students
9. Monitor enrolled students and their progress at `/instructor/courses/:id/students`

#### As a Student:
1. Register with the **Student** role at `/signup`
2. Login at `/login`
3. Browse available courses at `/courses`
4. Use the search bar to find courses by title or description
5. Click **Enroll Now** on any course
6. Access enrolled courses at **My Learning**
7. Work through lessons by checking chapter checkboxes
8. Complete all lessons to unlock the quiz
9. Take the quiz to earn your score
10. Track overall progress via the visual progress bar

---

## Team

| Name | Student ID | Role |
|------|-----------|------|
| Laharish S | PES2UG23CS298 | Full Stack Development |
| Kathit Joshi | PES2UG23CS264 | Backend & API Design |
| Kavyansh Jain | PES2UG23CS268 | Frontend Development |
| Kumarchandra Edupuganti | PES2UG23CS292 | Database & Documentation |

**Course:** UE23CS352B - Object Oriented Analysis & Design  
**Institution:** PES University, Electronic City Campus, Bengaluru  
**Year:** 2024

---

## License

This project is for educational purposes as part of the OOAD course requirement at PES University.

---

## Acknowledgments

- **PES University** - For the OOAD course curriculum and project guidelines
- **Spring Boot Community** - For the excellent backend framework
- **Vercel/Next.js Team** - For the React framework
- **MongoDB** - For the cloud database platform
- **Shadcn/ui** - For the beautiful UI component library
