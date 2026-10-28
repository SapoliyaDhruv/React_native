const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Flashcard = require('../models/Flashcard');

const SEED_FLASHCARDS = [
  {
    id: 'hr-1',
    topic: 'HR Interview',
    question: 'Tell me about yourself and your career goals.',
    answer: 'Present: Summarize your degree and passion for software engineering.\nSkills & Projects: Highlight key projects (e.g. React Native Mobile App, Node.js Backend).\nFuture Alignment: Explain how your skills align with their engineering culture.',
    interviewerTips: 'Keep your response under 90 seconds. Speak with confidence and avoid reading off a resume.',
    difficulty: 'Beginner',
    tags: ['TCS', 'Infosys', 'HR'],
  },
  {
    id: 'hr-2',
    topic: 'HR Interview',
    question: 'What is your biggest weakness and how do you manage it?',
    answer: 'Pick a real, non-fatal professional weakness (e.g. over-focusing on perfectionism or difficulty delegating).\nDescribe active mitigation: Mention tools or habits you use (e.g. strict timeboxing and team communication).\nShow self-awareness: Emphasize continuous feedback and weekly growth.',
    interviewerTips: 'Never say "I have no weaknesses" or "I work too hard". Show real self-awareness and improvement.',
    difficulty: 'Intermediate',
    tags: ['Wipro', 'Accenture', 'HR'],
  },
  {
    id: 'hr-3',
    topic: 'HR Interview',
    question: 'Why do you want to join our company specifically?',
    answer: 'Company Innovation: Mention specific products, recent tech blogs, or open-source initiatives.\nCultural Match: Align your personal learning mindset with their core values.\nValue Add: State how your technical skills will contribute to upcoming engineering projects.',
    interviewerTips: 'Research the company background 10 minutes before your interview. Interviewers love specific details.',
    difficulty: 'Intermediate',
    tags: ['Amazon', 'Cognizant', 'HR'],
  },
  {
    id: 'js-1',
    topic: 'React & JS',
    question: 'What is the difference between Virtual DOM and Real DOM in React?',
    answer: 'Real DOM: Heavy browser tree representation where direct manipulation causes expensive reflows and repaints.\nVirtual DOM: Lightweight in-memory JS representation of the UI tree created by React.\nReconciliation: React diffs the old and new Virtual DOM and batch updates ONLY changed Real DOM nodes.',
    interviewerTips: 'Use keywords like "Reconciliation", "Diffing Algorithm", and "Batch DOM Updates".',
    difficulty: 'Intermediate',
    tags: ['React', 'JavaScript', 'Infosys'],
  },
  {
    id: 'js-2',
    topic: 'React & JS',
    question: 'What is a JavaScript Closure and give a practical use-case.',
    answer: 'Definition: A function bundled together with references to its surrounding lexical environment.\nLexical Scope: Outer variables remain accessible even after the outer function finishes execution.\nUse-Cases: Creating private variables/state, data encapsulation, function currying, and memoization handlers.',
    interviewerTips: 'Write a 3-line code example on paper if asked in a technical whiteboard round.',
    difficulty: 'Intermediate',
    tags: ['JavaScript', 'TCS NQT', 'Amazon'],
  },
  {
    id: 'js-3',
    topic: 'React & JS',
    question: 'Difference between useCallback and useMemo hooks?',
    answer: 'useCallback: Memoizes a function instance to prevent unnecessary re-creation on every component re-render.\nuseMemo: Memoizes the calculated result value of an expensive computation function.\nRule of Thumb: Pass callbacks to optimized child components with useCallback; compute heavy data with useMemo.',
    interviewerTips: 'Remember: useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).',
    difficulty: 'Advanced',
    tags: ['React', 'Cognizant', 'Wipro'],
  },
  {
    id: 'dsa-1',
    topic: 'Data Structures',
    question: 'When would you choose a Hash Table over a Balanced BST?',
    answer: 'Hash Table: O(1) average time complexity for insert, search, and delete operations when element order does not matter.\nBalanced BST: O(log n) time complexity for search, but maintains sorted element order.\nSelection: Use Hash Table for rapid lookup; use BST when range queries or min/max elements are required.',
    interviewerTips: 'Mention worst-case O(n) hash collision handling via Chaining or Open Addressing.',
    difficulty: 'Intermediate',
    tags: ['DSA', 'Amazon', 'TCS NQT'],
  },
  {
    id: 'dsa-2',
    topic: 'Data Structures',
    question: 'Explain Breadth-First Search (BFS) vs Depth-First Search (DFS).',
    answer: 'BFS: Explores graph level-by-level using a Queue (FIFO). Ideal for finding the shortest path in unweighted graphs.\nDFS: Explores graph deep into branches using a Stack/Recursion (LIFO). Ideal for backtracking and cycle detection.\nTime Complexity: Both run in O(V + E) time where V is vertices and E is edges.',
    interviewerTips: 'State queue data structure for BFS vs recursion stack for DFS clearly.',
    difficulty: 'Advanced',
    tags: ['DSA', 'Amazon', 'Infosys'],
  },
];

let flashcardsSeeded = false;
async function ensureFlashcardsSeeded() {
  if (flashcardsSeeded) return;
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Flashcard.countDocuments();
    if (count === 0) {
      await Flashcard.insertMany(SEED_FLASHCARDS);
    }
    flashcardsSeeded = true;
  } catch (e) {
    flashcardsSeeded = true;
  }
}

// GET /api/flashcards
router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;

    const filterSeed = () => {
      if (topic && topic !== 'All') {
        return SEED_FLASHCARDS.filter((c) => c.topic === topic);
      }
      return SEED_FLASHCARDS;
    };

    if (mongoose.connection.readyState !== 1) {
      return res.json(filterSeed());
    }

    await ensureFlashcardsSeeded();

    const filter = {};
    if (topic && topic !== 'All') {
      filter.topic = topic;
    }
    const cards = await Flashcard.find(filter).sort({ id: 1 });
    res.json(cards.length > 0 ? cards : filterSeed());
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.json(SEED_FLASHCARDS);
  }
});

module.exports = router;
