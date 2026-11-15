import type { Question } from './mindsprintData';
import streamQuestions from '../backend/data/stream_questions.json';

// Class 11/12 practice questions: Commerce and Arts subjects plus extra Science (GSEB, Gujarati medium).
// Shared with the server (backend/routes/examRoutes.js) so both serve the same set.
export const STREAM_QUESTIONS = streamQuestions as Question[];
