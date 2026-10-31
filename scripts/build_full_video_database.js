const fs = require('fs');
const path = require('path');
const seed = require('../backend/routes/academicDataSeed.js');

const ACADEMIC_CURRICULUM = seed.ACADEMIC_CURRICULUM;

// Helper to calculate seconds from duration like "24:15" or "20m"
function parseDurationSeconds(dur) {
  if (!dur) return 1200;
  if (dur.includes(':')) {
    const parts = dur.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const m = dur.match(/(\d+)\s*m/);
  if (m) return parseInt(m[1], 10) * 60;
  return 1200;
}

// College legacy masterclasses
const COLLEGE_VIDEOS = [
  {
    id: "vid-col-1",
    chapterNumber: 1,
    subjectId: "col-quant",
    grades: ["college"],
    boards: ["CBSE", "GSEB", "ICSE"],
    category: "Quantitative Aptitude",
    categoryGujarati: "ક્વોન્ટિટિટીવ એપ્ટિટ્યુડ",
    title: "Mastering Speed Math & Vedic Math for TCS/Infosys",
    titleGujarati: "ઝડપી ગણિત અને વૈદિક ગણિત શોર્ટકટ્સ - કેમ્પસ પ્લેસમેન્ટ",
    instructor: "MindSprint Placement Cell",
    instructorGujarati: "માઇન્ડસ્પ્રિન્ટ કેમ્પસ ફેકલ્ટી",
    duration: "28:40",
    durationSeconds: 1720,
    youtubeVideoId: "D6xkbGLQesk",
    thumbnailUrl: "https://img.youtube.com/vi/D6xkbGLQesk/hqdefault.jpg",
    playbackMode: "embed",
    description: "Core mental arithmetic shortcuts, square roots, cube roots, and fast multiplication.",
    descriptionGujarati: "કેમ્પસ પ્લેસમેન્ટ ટેસ્ટ માટે ઝડપી ગણતરીની શ્રેષ્ઠ શોર્ટકટ ટ્રીક્સ.",
    timeStampedNotes: [
      { time: "01:15", text: "Vedic Math Multiplication", textGujarati: "વૈદિક ગણિત ગુણાકાર પદ્ધતિ" },
      { time: "09:40", text: "Square Root Tricks", textGujarati: "વર્ગમૂળ શોધવાની શોર્ટકટ્સ" },
      { time: "18:20", text: "Campus Aptitude Solved Questions", textGujarati: "કેમ્પસ પ્રશ્નો સોલ્યુશન" }
    ],
    comments: [
      { id: "col_c1", author: "Rohan Dave", role: "Engineering Final Year", text: "Cut my calculation time in half!", upvotes: 14, createdAt: "3 days ago" }
    ],
    referencePdfUrl: "/api/curriculum/chapter-pdf?grade=college&subject=col-quant&chapter=1"
  },
  {
    id: "vid-col-2",
    chapterNumber: 2,
    subjectId: "col-dsa",
    grades: ["college"],
    boards: ["CBSE", "GSEB", "ICSE"],
    category: "Data Structures & Algorithms",
    categoryGujarati: "ડેટા સ્ટ્રક્ચર્સ & અલ્ગોરિધમ્સ",
    title: "Binary Trees & BST Traversals Masterclass",
    titleGujarati: "બાઈનરી ટ્રી & BST ટ્રાવર્સલ વિગતવાર સમજૂતી",
    instructor: "Google SDE Guest Speaker",
    instructorGujarati: "માઇન્ડસ્પ્રિન્ટ ટેક લીડ",
    duration: "34:10",
    durationSeconds: 2050,
    youtubeVideoId: "D6xkbGLQesk",
    thumbnailUrl: "https://img.youtube.com/vi/D6xkbGLQesk/hqdefault.jpg",
    playbackMode: "embed",
    description: "In-depth understanding of DFS, BFS, level-order traversal, and tree balancing.",
    descriptionGujarati: "બાઈનરી સર્ચ ટ્રી અને લેવલ ઓર્ડર ટ્રાવર્સલની ઊંડાણપૂર્વક સમજૂતી.",
    timeStampedNotes: [
      { time: "02:00", text: "Binary Tree Fundamentals", textGujarati: "બાઈનરી ટ્રી બેઝિક્સ" },
      { time: "12:30", text: "In-Order, Pre-Order, Post-Order", textGujarati: "ટ્રાવર્સલ રીતો" },
      { time: "24:00", text: "LeetCode Medium Problems", textGujarati: "લીટકોડ દાખલાઓ" }
    ],
    comments: [
      { id: "col_c2", author: "Kavita Shah", role: "SDE Aspirant", text: "Best tree explanation for placements.", upvotes: 19, createdAt: "1 day ago" }
    ],
    referencePdfUrl: "/api/curriculum/chapter-pdf?grade=college&subject=col-dsa&chapter=1"
  },
  {
    id: "vid-col-3",
    chapterNumber: 3,
    subjectId: "col-tech",
    grades: ["college"],
    boards: ["CBSE", "GSEB", "ICSE"],
    category: "React & Full Stack",
    categoryGujarati: "રિએક્ટ & ફુલ સ્ટેક ડેવલપમેન્ટ",
    title: "React 19 Deep Dive: Hooks, Virtual DOM, Fiber Architecture",
    titleGujarati: "રિએક્ટ ૧૯ હુક્સ, વર્ચ્યુઅલ DOM અને ફાઇબર આર્કિટેક્ચર",
    instructor: "Senior Frontend Architect",
    instructorGujarati: "સીનિયર ફ્રન્ટએન્ડ એન્જિનિયર",
    duration: "29:50",
    durationSeconds: 1790,
    youtubeVideoId: "TNhaISOUy6Q",
    thumbnailUrl: "https://img.youtube.com/vi/TNhaISOUy6Q/hqdefault.jpg",
    playbackMode: "embed",
    description: "Deep technical interview preparation on React Fiber reconciliation and state batching.",
    descriptionGujarati: "રિએક્ટ હુક્સ અને સ્ટેટ મેનેજમેન્ટ પર ટેકનિકલ ઇન્ટરવ્યુ તૈયારી.",
    timeStampedNotes: [
      { time: "01:30", text: "Event Loop & Call Stack", textGujarati: "કોલ સ્ટેક અને ઇવેન્ટ લૂપ" },
      { time: "11:00", text: "Virtual DOM & Reconciliation", textGujarati: "વર્ચ્યુઅલ DOM સમજૂતી" },
      { time: "21:15", text: "Custom Hooks Best Practices", textGujarati: "કસ્ટમ હુક્સ" }
    ],
    comments: [
      { id: "col_c3", author: "Priya Nair", role: "Frontend Dev", text: "Clear explanation of React hooks!", upvotes: 22, createdAt: "4 days ago" }
    ],
    referencePdfUrl: "/api/curriculum/chapter-pdf?grade=college&subject=col-tech&chapter=1"
  }
];

const allVideos = [];

// Loop through each grade and each chapter
for (const [grade, curr] of Object.entries(ACADEMIC_CURRICULUM)) {
  if (grade === 'college') continue; // College handled separately with specialized placement tracks

  for (const subject of curr.subjects) {
    const chapters = subject.chapters || [];
    
    for (const chap of chapters) {
      const primaryVideo = (chap.videos && chap.videos.length > 0) ? chap.videos[0] : {
        teacher: "GSEB Digital Shikshan",
        duration: "22:00",
        youtubeVideoId: "lF4Fu7Nf1_g",
        tag: "GSEB Official"
      };

      const durationStr = primaryVideo.duration && primaryVideo.duration.includes(':')
        ? primaryVideo.duration
        : `${primaryVideo.duration || '20m'}`.replace('m', ':00');

      const videoId = primaryVideo.youtubeVideoId === '0Zhy9b3v8cQ' ? 'lF4Fu7Nf1_g' : primaryVideo.youtubeVideoId;

      const videoItem = {
        id: `vid-ch-${chap.id}`,
        chapterNumber: chap.chapterNumber,
        subjectId: subject.id,
        grades: [grade],
        boards: ["GSEB", "CBSE"],
        category: subject.name,
        categoryGujarati: subject.nameGujarati || subject.name,
        title: `Class ${grade} ${subject.name} – Chapter ${chap.chapterNumber}: ${chap.title}`,
        titleGujarati: `ધોરણ ${grade} ${subject.nameGujarati} – પ્રકરણ ${chap.chapterNumber}: ${chap.titleGujarati || chap.title} (GSEB)`,
        instructor: primaryVideo.teacher || "GSEB Gujarat Board Faculty",
        instructorGujarati: `${primaryVideo.teacher || 'GSEB શિક્ષણ'} (GSEB)`,
        duration: durationStr,
        durationSeconds: parseDurationSeconds(durationStr),
        youtubeVideoId: videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        playbackMode: "embed",
        description: chap.summary || `Comprehensive video lesson covering ${chap.title} for Class ${grade} GSEB.`,
        descriptionGujarati: chap.summaryGujarati || `ધોરણ ${grade} ${subject.nameGujarati} પ્રકરણ ${chap.chapterNumber} ${chap.titleGujarati || chap.title} ની સંપૂર્ણ સમજૂતી અને સ્વાધ્યાય.`,
        timeStampedNotes: (chap.concepts || []).map((c, idx) => ({
          time: `0${idx * 5 + 1}:00`,
          text: c.heading || `Concept ${idx + 1}`,
          textGujarati: c.headingGujarati || `મુદ્દો ${idx + 1}`
        })),
        comments: [
          {
            id: `c_${chap.id}_1`,
            author: "MindSprint Learner",
            role: `Class ${grade} Student`,
            text: `પ્રકરણ ${chap.chapterNumber} ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!`,
            upvotes: 7 + (chap.chapterNumber % 5),
            createdAt: "3 days ago"
          }
        ],
        referencePdfUrl: chap.chapterPdfUrl || `/api/curriculum/chapter-pdf?grade=${grade}&subject=${subject.id}&chapter=${chap.chapterNumber}`
      };

      allVideos.push(videoItem);
    }
  }
}

// Add college masterclasses
allVideos.push(...COLLEGE_VIDEOS);

console.log('Total Generated Video Lectures:', allVideos.length);

// Write to constants/videoData.ts
const tsContent = `export interface VideoComment {
  id: string;
  author: string;
  userEmail?: string;
  role: string;
  text: string;
  upvotes: number;
  upvotedBy?: string[];
  createdAt: string;
}

export interface VideoLecture {
  id: string;
  chapterNumber?: number;
  subjectId?: string;
  grades?: string[];
  boards?: string[];
  category: string;
  categoryGujarati?: string;
  title: string;
  titleGujarati?: string;
  instructor: string;
  instructorGujarati?: string;
  duration: string;
  durationSeconds: number;
  youtubeVideoId: string;
  thumbnailUrl: string;
  playbackMode: 'embed' | 'direct';
  description: string;
  descriptionGujarati?: string;
  timeStampedNotes: { time: string; text: string; textGujarati?: string }[];
  discussionCount?: number;
  comments?: VideoComment[];
  referencePdfUrl?: string;
}

export const VIDEO_LECTURES_DATA: VideoLecture[] = ${JSON.stringify(allVideos, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../constants/videoData.ts'), tsContent, 'utf-8');
console.log('Successfully wrote constants/videoData.ts!');

// Update backend/routes/videoRoutes.js
const videoRoutesJsPath = path.join(__dirname, '../backend/routes/videoRoutes.js');
let videoRoutesContent = fs.readFileSync(videoRoutesJsPath, 'utf-8');

// Replace SEED_VIDEOS in videoRoutes.js
const seedStart = videoRoutesContent.indexOf('const SEED_VIDEOS = [');
const seedEnd = videoRoutesContent.indexOf('// Seed videos on startup or on demand');

if (seedStart !== -1 && seedEnd !== -1) {
  const newSeedCode = `const SEED_VIDEOS = ${JSON.stringify(allVideos, null, 2)};\n\n`;
  videoRoutesContent = videoRoutesContent.substring(0, seedStart) + newSeedCode + videoRoutesContent.substring(seedEnd);
  fs.writeFileSync(videoRoutesJsPath, videoRoutesContent, 'utf-8');
  console.log('Successfully updated SEED_VIDEOS in backend/routes/videoRoutes.js!');
} else {
  console.error('Could not locate SEED_VIDEOS delimiters in videoRoutes.js');
}

