const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Resolve path to backend .env variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Question = require('../models/Question');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindsprint';

async function importData() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const dataPath = path.join(__dirname, '../data/verified_questions.json');
    if (!fs.existsSync(dataPath)) {
      console.error(`❌ Data file not found at: ${dataPath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const questions = JSON.parse(fileContent);

    if (!Array.isArray(questions)) {
      console.error('❌ Data file must contain a JSON array of questions');
      process.exit(1);
    }

    console.log('Deleting existing questions from database...');
    await Question.deleteMany({});
    console.log('🧹 Collection cleared.');

    console.log(`Inserting ${questions.length} questions in bulk...`);
    const result = await Question.insertMany(questions);
    console.log(`🎉 Successfully imported ${result.length} questions into the database!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importData();
