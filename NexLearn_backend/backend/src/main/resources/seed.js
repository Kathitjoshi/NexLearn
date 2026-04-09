// NexLearn MongoDB Seed Script
// Run with: mongosh "YOUR_ATLAS_URI" --file seed.js
// Replace YOUR_ATLAS_URI with your connection string

const db = db.getSiblingDB("nexlearn");

// Clear existing
db.users.drop();
db.courses.drop();
db.lessons.drop();

// Sample instructor
db.users.insertOne({
  username: "instructor1",
  email: "instructor@nexlearn.com",
  password: "password123",
  first_name: "John",
  last_name: "Doe",
  role: "INSTRUCTOR"
});

// Sample student
db.users.insertOne({
  username: "student1",
  email: "student@nexlearn.com",
  password: "password123",
  first_name: "Jane",
  last_name: "Smith",
  role: "STUDENT"
});

print("Seed complete. Two users inserted.");
print("Instructor: username=instructor1 / password=password123");
print("Student:    username=student1    / password=password123");
