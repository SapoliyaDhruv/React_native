import type { Question } from './mindsprintData';
import streamQuestions from '../backend/data/stream_questions.json';

// Practice questions for the Class 11/12 Commerce and Arts subjects (GSEB, Gujarati medium).
// Shared with the server (backend/routes/examRoutes.js) so both serve the same set.
export const STREAM_QUESTIONS = streamQuestions as Question[];
