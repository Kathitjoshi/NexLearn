# NexLearn – Database Setup

## Atlas Cluster
- Cluster name: cluster0
- Database name: nexlearn
- Collections are auto-created by Spring Boot on first run

## Connection String Format
```
mongodb+srv://<username>:<password>@cluster0.XXXXX.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
Copy this from: Atlas Dashboard → Connect → Drivers → Node.js

## Paste it into:
`backend/src/main/resources/application.properties`

## Optional: Seed sample users
```bash
mongosh "YOUR_CONNECTION_STRING" --file seed.js
```

## Collections created automatically
| Collection | Purpose |
|---|---|
| users | Students and Instructors |
| courses | Course records |
| lessons | Lessons per course |
| lesson_progress | Per-user lesson completion |
| enroll | Enrollment records |
| quiz | Quiz per course |
| quiz_responses | Student quiz answers |
| contact_messages | UC-10 contact form submissions |
