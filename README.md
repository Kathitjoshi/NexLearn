# NexLearn – Learning Management System
**Course:** UE23CS352B – Object Oriented Analysis & Design  
**Team:** Laharish S · Kathit Joshi · Kavyansh Jain · Kumarchandra Edupuganti

---

## Tech Stack
- **Backend:** Spring Boot 3.4 + MongoDB + JWT (MVC pattern)
- **Frontend:** Next.js 15 + Tailwind CSS + Framer Motion
- **Database:** MongoDB Atlas (free tier)

---

## Step-by-Step Setup

### Prerequisites
| Tool | Version |
|---|---|
| Java | 17+ |
| Maven | bundled (mvnw) |
| Node.js | 18+ |
| npm | 9+ |

---

### 1 – Configure MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **Connect** on your Cluster0 → **Drivers** → copy the connection string
3. Open `backend/src/main/resources/application.properties`
4. Replace this line:
```
spring.data.mongodb.uri=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.XXXXX.mongodb.net/...
```
with your actual connection string.

---

### 2 – Run the Backend

```bash
cd backend
mvn spring-boot:run
```

- Starts on **http://localhost:8090**
- First run auto-creates all MongoDB collections

---

### 3 – Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

- Opens on **http://localhost:3000**

---

### 4 – Using the App

| Role | What to do |
|---|---|
| **Instructor** | Sign up → Create Course (title, lessons, quiz) → View students |
| **Student** | Sign up → Browse/enroll → Complete lessons → Take quiz |

**All 10 Use Cases:**
- UC-01: Register at `/signup`
- UC-02: Login/Logout at `/login`
- UC-03: Create course at `/instructor/create`
- UC-04: Enroll at `/courses/:id`
- UC-05: Manage lessons in create-course flow
- UC-06: Track progress at `/enrolled/:id`
- UC-07: View students at `/instructor/courses/:id/students`
- UC-08: Search at `/courses` (search bar)
- UC-09: Edit profile at `/profile`
- UC-10: Submit message at `/contact`

---

### API Base URL
All backend endpoints: `http://localhost:8090`

| Method | Path | Use Case |
|---|---|---|
| POST | /api/auth/register | UC-01 |
| POST | /api/auth/login | UC-02 |
| GET/POST | /courses | UC-03/UC-08 |
| POST/DELETE | /enroll/:userId/:courseId | UC-04 |
| POST/PUT | /lessons/create | UC-05 |
| GET/POST | /lesson-progress | UC-06 |
| GET | /enroll/students/:courseId | UC-07 |
| GET | /courses?search= | UC-08 |
| PUT | /users/:id | UC-09 |
| POST | /contact | UC-10 |
