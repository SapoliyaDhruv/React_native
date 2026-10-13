export type TrackType = 'placement' | 'it_skills' | 'school';

export interface Question {
  id: number;
  questionText: string;
  category: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  thumbnailUrl: string;
  tag: string;
  level: string;
}

export interface SchoolSubject {
  id: string;
  title: string;
  grade: string;
  chaptersCount: number;
  pdfUrl?: string;
  iconName: string;
}

export const APTITUDE_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Quantitative Aptitude',
    questionText: 'A train 150m long is running at a speed of 54 km/hr. In how much time will it pass a standing telegraph post?',
    options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
    correctAnswer: 1, // 10 seconds
    explanation: 'Speed = 54 * (5/18) = 15 m/sec. Time = Distance / Speed = 150 / 15 = 10 seconds.',
  },
  {
    id: 2,
    category: 'Logical Reasoning',
    questionText: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
    options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
    correctAnswer: 1, // (1/8)
    explanation: 'This is a simple division series. Each number is half of the previous number: 1/4 ÷ 2 = 1/8.',
  },
  {
    id: 3,
    category: 'IT Technical (React & JS)',
    questionText: 'In React, what hook is used to handle side-effects such as data fetching or subscriptions?',
    options: ['useState', 'useContext', 'useEffect', 'useReducer'],
    correctAnswer: 2, // useEffect
    explanation: 'useEffect is designed to perform side effects in functional React components.',
  },
  {
    id: 4,
    category: 'Quantitative Aptitude',
    questionText: 'If 12 men can complete a work in 20 days, how many days will 15 men take to complete the same work?',
    options: ['16 days', '14 days', '18 days', '15 days'],
    correctAnswer: 0, // 16 days
    explanation: 'Men x Days = Constant. 12 x 20 = 240 man-days. Days for 15 men = 240 / 15 = 16 days.',
  },
  {
    id: 5,
    category: 'Data Structures & Algorithms',
    questionText: 'What is the average time complexity of searching an element in a Balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2, // O(log n)
    explanation: 'In a balanced BST, the height is log(n), making search operations run in O(log n) time.',
  },
];

export const IT_SKILL_COURSES: SkillCourse[] = [
  {
    id: 'c1',
    title: 'React JS & React Native Masterclass 2026',
    category: 'Web & Mobile Dev',
    instructor: 'Dr. Anil Kumar',
    duration: '18.5 hrs',
    lessonsCount: 42,
    rating: 4.9,
    tag: 'Trending',
    level: 'Intermediate',
    thumbnailUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbjQHxaP7Hz0CXQ2qqlV1dG4EtQVhPqKQPzfNVY7VwPeREqzAxGF0ERF1HrkeIT9fvn9Ivmc4jENY9-_E38dSJ-1YH0uFMC3lC2hcagk5GdjdpdLAL3Fbph5WfhLkqwZF16a0Z8FsmDdKOe5RGlD8P_1tJRV1miywH7G-9Gv4Y94XBMpCXuPFrnZV6yHfUuHMewBILsLVQbOcc6YXgj7zQKavG38OFfXoPEd2wwssjB7eAjw7TQN4B',
  },
  {
    id: 'c2',
    title: 'Data Structures & Algorithms for IT Placements',
    category: 'Computer Science',
    instructor: 'Prof. S. Sharma',
    duration: '24.0 hrs',
    lessonsCount: 65,
    rating: 4.8,
    tag: 'Must Have',
    level: 'Beginner to Advanced',
    thumbnailUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCV0bMl9J8PXeXVLpLbpceS1Q2bnIudkkFJHm_PZKhhomBdaR5Z2jNBlJpM6M1SwbhQWXBdfj7Zi4y83rCx5c5LRUnF2Lx5WPpTE-oiNV83zxM9z89kJcLCgfrJM9KfY9a5UdWeBTliIOqBWbeXjvABmzuLXZUMez5rUUHDuQ5Vk46tCV04aKfw-FgfB16IAsvQd2GMAP4LuBzecmw4A1UzcFgs3zht2G9CQ6BXY1Ht0qxKkaVFOEKa',
  },
  {
    id: 'c3',
    title: 'Python for AI, Machine Learning & Backend API',
    category: 'Artificial Intelligence',
    instructor: 'Priya Mehta',
    duration: '16.0 hrs',
    lessonsCount: 38,
    rating: 4.9,
    tag: 'High Demand',
    level: 'All Levels',
    thumbnailUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfxMonRw0K_dFWQmJDfu1KWVfzD3K1oxGEjPs8quqbV4LXapeR8NeHwYm_J_aPYi7pnetLdjNULF9Ya_UOUdnvYZTCDCjjmduzHSWccw8DsFcfQMj39Ysf_NFppGQV6rxIU3X_a1Sk3_TdnBs35rTSsZo0nmgVBmQIdkYQKm2AbsAAZFFQB8BDLhoLvfMXOBOYEHO2r9cC6fKfagrLKxqOd8eLv3draERxb8s3CARSr0b5UlCak-An',
  },
];

export const SCHOOL_SUBJECTS: SchoolSubject[] = [
  { id: 's1', title: 'Mathematics (Calculus & Algebra)', grade: 'Class 12', chaptersCount: 16, iconName: 'functions' },
  { id: 's2', title: 'Physics (Electromagnetism & Quantum)', grade: 'Class 12', chaptersCount: 14, iconName: 'bolt' },
  { id: 's3', title: 'Biology (Cell Structure & Genetics)', grade: 'Class 11', chaptersCount: 18, iconName: 'biotech' },
  { id: 's4', title: 'Chemistry (Organic & Physical)', grade: 'Class 12', chaptersCount: 15, iconName: 'science' },
];
