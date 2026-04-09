export type Course = {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  difficulty: string;
  hours: number;
  lessons: number;
  rating: number;
};

export interface Users {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginSuccessResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface LoginErrorResponse {
  message: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapters: string[];
  courseId: string;
  order: number;
}

export interface EnrolledCourse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  hasProgress?: boolean;
}
