const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

const DEFAULT_COURSES = [
  {
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
];

// GET /api/courses
router.get('/courses', async (req, res) => {
  try {
    let courses = await Course.find();
    if (courses.length === 0) {
      courses = await Course.insertMany(DEFAULT_COURSES);
    }
    res.json(courses);
  } catch (error) {
    res.json(DEFAULT_COURSES);
  }
});

module.exports = router;
