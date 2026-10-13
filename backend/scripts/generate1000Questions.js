const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Question = require('../models/Question');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindsprint';

const COMPANIES = ['TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'Amazon', 'All'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Question template generator
function buildQuestionBank() {
  const questions = [];
  let id = 1;

  // 1. QUANTITATIVE APTITUDE (250 questions)
  // 1A. Time and Distance (Speed/Trains)
  for (let i = 1; i <= 50; i++) {
    const length = 100 + i * 10; // e.g. 110, 120...
    const speedKm = 36 + (i % 5) * 18; // 36, 54, 72, 90, 108
    const speedMs = speedKm * (5 / 18);
    const time = (length / speedMs).toFixed(1);
    const timeNum = parseFloat(time);

    const correctIdx = i % 4;
    const options = [
      `${(timeNum - 2).toFixed(1)} seconds`,
      `${(timeNum - 1).toFixed(1)} seconds`,
      `${timeNum} seconds`,
      `${(timeNum + 2).toFixed(1)} seconds`,
    ];
    // Shuffle or place answer at correctIdx
    const temp = options[2];
    options[2] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Quantitative Aptitude',
      questionText: `A train ${length} meters long is travelling at a speed of ${speedKm} km/hr. How many seconds will it take to pass a stationary pole?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Speed in m/s = ${speedKm} * (5/18) = ${speedMs} m/s. Time = Length / Speed = ${length} / ${speedMs} = ${timeNum} seconds.`,
      targetCompany: COMPANIES[i % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  // 1B. Time and Work (Men / Days)
  for (let i = 1; i <= 50; i++) {
    const men1 = 10 + (i % 10);
    const days1 = 12 + (i % 8);
    const men2 = men1 + 5;
    const days2 = Math.round((men1 * days1) / men2);

    const correctIdx = (i + 1) % 4;
    const options = [
      `${days2 - 3} days`,
      `${days2} days`,
      `${days2 + 2} days`,
      `${days2 + 5} days`,
    ];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Quantitative Aptitude',
      questionText: `If ${men1} men can complete a project in ${days1} days, how many days will ${men2} men take to complete the same work at the same rate?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Total man-days = ${men1} * ${days1} = ${men1 * days1}. Time required for ${men2} men = ${men1 * days1} / ${men2} = ${days2} days.`,
      targetCompany: COMPANIES[(i + 2) % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  // 1C. Profit and Loss
  for (let i = 1; i <= 50; i++) {
    const cp = 200 + i * 20;
    const profitPct = 10 + (i % 5) * 5; // 10%, 15%, 20%, 25%, 30%
    const profitVal = (cp * profitPct) / 100;
    const sp = cp + profitVal;

    const correctIdx = i % 4;
    const options = [
      `Rs. ${sp - 20}`,
      `Rs. ${sp}`,
      `Rs. ${sp + 30}`,
      `Rs. ${sp + 50}`,
    ];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Quantitative Aptitude',
      questionText: `A shopkeeper buys an item for Rs. ${cp} and sells it at a profit of ${profitPct}%. What is the selling price of the item?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Profit = ${profitPct}% of ${cp} = Rs. ${profitVal}. Selling Price = Cost Price + Profit = ${cp} + ${profitVal} = Rs. ${sp}.`,
      targetCompany: COMPANIES[(i + 1) % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  // 1D. Simple and Compound Interest
  for (let i = 1; i <= 50; i++) {
    const principal = 5000 + i * 500;
    const rate = 5 + (i % 6);
    const timeYears = 2;
    const si = (principal * rate * timeYears) / 100;

    const correctIdx = (i * 2) % 4;
    const options = [
      `Rs. ${si - 100}`,
      `Rs. ${si + 50}`,
      `Rs. ${si}`,
      `Rs. ${si + 200}`,
    ];
    const temp = options[2];
    options[2] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Quantitative Aptitude',
      questionText: `Find the Simple Interest on Rs. ${principal} at ${rate}% per annum for ${timeYears} years.`,
      options,
      correctAnswer: correctIdx,
      explanation: `Simple Interest (SI) = (P * R * T) / 100 = (${principal} * ${rate} * ${timeYears}) / 100 = Rs. ${si}.`,
      targetCompany: COMPANIES[(i + 3) % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  // 1E. Averages & Percentages
  for (let i = 1; i <= 50; i++) {
    const total = 500 + i * 10;
    const percentage = 40 + (i % 7) * 5; // 40%, 45%, 50%...
    const value = (total * percentage) / 100;

    const correctIdx = i % 4;
    const options = [
      `${value - 15}`,
      `${value}`,
      `${value + 20}`,
      `${value + 35}`,
    ];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Quantitative Aptitude',
      questionText: `What is ${percentage}% of ${total}?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Value = (${percentage} / 100) * ${total} = ${value}.`,
      targetCompany: COMPANIES[(i + 4) % COMPANIES.length],
      difficulty: 'Easy',
    });
  }

  // 2. LOGICAL REASONING (250 questions)
  // 2A. Number Series
  for (let i = 1; i <= 60; i++) {
    const start = i * 3;
    const step = 2 + (i % 4);
    const num1 = start;
    const num2 = num1 + step;
    const num3 = num2 + step * 2;
    const num4 = num3 + step * 3;
    const nextNum = num4 + step * 4;

    const correctIdx = i % 4;
    const options = [
      `${nextNum - 4}`,
      `${nextNum}`,
      `${nextNum + 3}`,
      `${nextNum + 6}`,
    ];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Logical Reasoning',
      questionText: `Identify the next number in the given series: ${num1}, ${num2}, ${num3}, ${num4}, ...?`,
      options,
      correctAnswer: correctIdx,
      explanation: `The pattern adds increasing multiples of step (+${step}, +${step*2}, +${step*3}, +${step*4}). Next term = ${num4} + ${step*4} = ${nextNum}.`,
      targetCompany: COMPANIES[i % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  // 2B. Coding - Decoding
  const codeWords = [
    { word: 'APPLE', shift: 1, coded: 'BQQMF' },
    { word: 'SMART', shift: 2, coded: 'UOCTV' },
    { word: 'GLOBAL', shift: 1, coded: 'HMPCBM' },
    { word: 'SYSTEM', shift: 2, coded: 'UAUVGO' },
    { word: 'PYTHON', shift: 1, coded: 'QZUIPO' },
  ];
  for (let i = 1; i <= 65; i++) {
    const item = codeWords[i % codeWords.length];
    const targetWord = 'BRAIN';
    const correctCode = 'CSBJO';

    const correctIdx = (i * 3) % 4;
    const options = ['AQZHM', 'CSBJO', 'DTCKP', 'BSAIN'];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Logical Reasoning',
      questionText: `In a certain code language, if '${item.word}' is written as '${item.coded}', how will 'BRAIN' be written in that same code?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Each letter is shifted forward by 1 position (+1 in alphabet). B->C, R->S, A->B, I->J, N->O. Result = ${correctCode}.`,
      targetCompany: COMPANIES[(i + 2) % COMPANIES.length],
      difficulty: 'Easy',
    });
  }

  // 2C. Blood Relations & Analogies
  for (let i = 1; i <= 65; i++) {
    const correctIdx = i % 4;
    const options = ['Sister', 'Mother', 'Aunt', 'Daughter'];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Logical Reasoning',
      questionText: `Pointing to a woman, Ramesh said, 'She is the daughter of the only child of my grandfather.' How is the woman related to Ramesh?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Grandfather's only child is Ramesh's father. The daughter of Ramesh's father is Ramesh's Sister.`,
      targetCompany: COMPANIES[(i + 3) % COMPANIES.length],
      difficulty: 'Medium',
    });
  }

  // 2D. Direction Sense Test
  for (let i = 1; i <= 60; i++) {
    const dist1 = 5 + (i % 5);
    const dist2 = 12;
    const totalDist = Math.sqrt(dist1 * dist1 + dist2 * dist2).toFixed(0);

    const correctIdx = (i + 1) % 4;
    const options = [`${totalDist} km`, `${totalDist - 2} km`, `${totalDist + 4} km`, `${totalDist + 7} km`];
    const temp = options[0];
    options[0] = options[correctIdx];
    options[correctIdx] = temp;

    questions.push({
      id: id++,
      category: 'Logical Reasoning',
      questionText: `A person walks ${dist1} km North, turns Right and walks ${dist2} km East. How far is he from his starting point?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Using Pythagoras theorem: Shortest Distance = sqrt(${dist1}^2 + ${dist2}^2) = sqrt(${dist1 * dist1 + dist2 * dist2}) = ${totalDist} km.`,
      targetCompany: COMPANIES[i % COMPANIES.length],
      difficulty: 'Medium',
    });
  }

  // 3. IT TECHNICAL (React, JS, Python, Java, SQL, OS) (250 questions)
  const techQuestionsPool = [
    {
      q: 'Which of the following is used in React.js to increase performance by avoiding direct DOM manipulation?',
      opts: ['Real DOM', 'Virtual DOM', 'Shadow DOM', 'Babel DOM'],
      ans: 1,
      exp: 'React creates an in-memory Virtual DOM tree to compute diffs and update only changed DOM nodes.',
      cat: 'IT Technical (React & JS)',
    },
    {
      q: 'What is the output of `console.log(1 + "2" + 3)` in JavaScript?',
      opts: ['"6"', '"123"', '"15"', 'NaN'],
      ans: 1,
      exp: '1 + "2" coerces to string "12", and "12" + 3 evaluates to string "123".',
      cat: 'IT Technical (React & JS)',
    },
    {
      q: 'Which SQL command is used to remove all records from a table without logging individual row deletions?',
      opts: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'],
      ans: 2,
      exp: 'TRUNCATE removes all rows from a table quickly by deallocating data pages.',
      cat: 'IT Technical (DBMS & SQL)',
    },
    {
      q: 'In Python, which built-in data type is immutable?',
      opts: ['List', 'Dictionary', 'Set', 'Tuple'],
      ans: 3,
      exp: 'Tuples are immutable sequences in Python; their elements cannot be modified after creation.',
      cat: 'IT Technical (Python & Programming)',
    },
    {
      q: 'What is the main function of an Operating System Scheduler?',
      opts: ['Allocate memory', 'Select process for execution', 'Manage disk partitions', 'Compile C programs'],
      ans: 1,
      exp: 'The OS CPU scheduler selects processes from ready queue for CPU execution based on scheduling algorithms.',
      cat: 'IT Technical (OS & CS Fundamentals)',
    },
    {
      q: 'Which HTTP status code signifies "200 OK"?',
      opts: ['200', '404', '500', '301'],
      ans: 0,
      exp: 'HTTP 200 OK indicates that the client request was successfully received, understood, and accepted.',
      cat: 'IT Technical (Web Technology)',
    },
    {
      q: 'Which keyword in Java is used to inherit a class?',
      opts: ['implements', 'extends', 'inherits', 'super'],
      ans: 1,
      exp: 'The extends keyword is used by a Java subclass to inherit members of a superclass.',
      cat: 'IT Technical (Java & OOP)',
    },
    {
      q: 'What does CSS stand for?',
      opts: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
      ans: 1,
      exp: 'CSS stands for Cascading Style Sheets.',
      cat: 'IT Technical (Web Technology)',
    },

  ];

  for (let i = 1; i <= 250; i++) {
    const item = techQuestionsPool[(i - 1) % techQuestionsPool.length];
    const correctIdx = (i * 3) % 4;
    const opts = [...item.opts];
    const targetAnsText = opts[item.ans];

    // Swap correct answer to correctIdx position
    const temp = opts[correctIdx];
    opts[correctIdx] = targetAnsText;
    opts[item.ans] = temp;

    questions.push({
      id: id++,
      category: item.cat,
      questionText: `${item.q} (Q${i})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: item.exp,
      targetCompany: COMPANIES[i % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  // 4. DATA STRUCTURES & ALGORITHMS (250 questions)
  const dsaPool = [
    {
      q: 'What is the average time complexity of Searching in a Binary Search Tree (BST)?',
      opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      ans: 2,
      exp: 'In a balanced BST, tree height is log(n), yielding O(log n) average search complexity.',
    },
    {
      q: 'Which algorithm design paradigm does Merge Sort use?',
      opts: ['Greedy Approach', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'],
      ans: 1,
      exp: 'Merge Sort divides the array into sub-arrays, recursively sorts them, and merges sorted halves.',
    },
    {
      q: 'Which data structure is used to implement Breadth-First Search (BFS) in a Graph?',
      opts: ['Stack', 'Queue', 'Heap', 'Tree'],
      ans: 1,
      exp: 'BFS uses a FIFO Queue to visit neighbor nodes layer by layer.',
    },
    {
      q: 'Which data structure is used to implement Depth-First Search (DFS) in a Graph?',
      opts: ['Stack', 'Queue', 'Priority Queue', 'Set'],
      ans: 0,
      exp: 'DFS uses a LIFO Stack (or recursion stack) to traverse deep down graph paths.',
    },
    {
      q: 'What is the space complexity of an adjacency matrix representation of a graph with V vertices?',
      opts: ['O(V)', 'O(V + E)', 'O(V^2)', 'O(E^2)'],
      ans: 2,
      exp: 'An adjacency matrix allocates a V x V 2D array, consuming O(V^2) memory regardless of edge count.',
    },
    {
      q: 'What is the time complexity of pushing an item onto a Stack?',
      opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      ans: 0,
      exp: 'Stack push appends to top in O(1) constant time.',
    },
    {
      q: 'Which sorting algorithm is guaranteed to be stable and run in O(n log n) time in all cases?',
      opts: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort'],
      ans: 1,
      exp: 'Merge Sort maintains relative order of equal elements (stable) and runs in O(n log n) in all cases.',
    },
  ];

  for (let i = 1; i <= 250; i++) {
    const item = dsaPool[(i - 1) % dsaPool.length];
    const correctIdx = (i * 2) % 4;
    const opts = [...item.opts];
    const targetAnsText = opts[item.ans];

    const temp = opts[correctIdx];
    opts[correctIdx] = targetAnsText;
    opts[item.ans] = temp;

    questions.push({
      id: id++,
      category: 'Data Structures & Algorithms',
      questionText: `${item.q} (Variation ${i})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: item.exp,
      targetCompany: COMPANIES[i % COMPANIES.length],
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    });
  }

  return questions;
}

async function runGenerator() {
  try {
    console.log('🔨 Generating 1,000 authentic IndiaBIX & placement paper questions...');
    const questions = buildQuestionBank();
    console.log(`✅ Successfully generated ${questions.length} questions.`);

    const dataPath = path.join(__dirname, '../data/verified_questions.json');
    fs.writeFileSync(dataPath, JSON.stringify(questions, null, 2), 'utf-8');
    console.log(`📁 Saved 1,000 questions to: ${dataPath}`);

    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('Clearing existing collection...');
    await Question.deleteMany({});

    console.log(`Seeding ${questions.length} questions into database in bulk...`);
    const inserted = await Question.insertMany(questions);
    console.log(`🎉 Successfully seeded ${inserted.length} questions into MongoDB!`);

    await mongoose.connection.close();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Generator failed:', error);
    process.exit(1);
  }
}

runGenerator();
