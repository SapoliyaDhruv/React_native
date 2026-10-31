const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'resolved_grade_videos.json');
const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));

// Load backend/routes/academicDataSeed.js
const seed = require('../backend/routes/academicDataSeed.js');
const curriculum = seed.ACADEMIC_CURRICULUM;

let updatedCount = 0;

for (const [grade, gradeData] of Object.entries(curriculum)) {
  if (grade === 'college') continue;

  for (const subject of gradeData.subjects || []) {
    for (const chap of subject.chapters || []) {
      const cacheKey = `${grade}_${subject.name}_${chap.chapterNumber}`;
      const resolved = cache[cacheKey];

      if (resolved && resolved.youtubeVideoId) {
        const teacherName = resolved.author || `${subject.nameGujarati || subject.name} તજજ્ઞ`;
        const primaryTitle = chap.titleGujarati 
          ? `પ્રકરણ ${chap.chapterNumber}: ${chap.titleGujarati} - સંપૂર્ણ પ્રકરણ સમજૂતી`
          : `${chap.title} - Full Chapter Detailed Explanation`;

        const swadhyayTitle = chap.titleGujarati 
          ? `પ્રકરણ ${chap.chapterNumber}: ${chap.titleGujarati} - સ્વાધ્યાય સોલ્યુશન અને દાખલા`
          : `${chap.title} - Swadhyay Solutions & Practice`;

        chap.videos = [
          {
            id: `vid-g${grade}-${subject.id}-ch${chap.chapterNumber}-1`,
            title: `${chap.title} - Full Chapter Detailed Explanation`,
            titleGujarati: primaryTitle,
            teacher: teacherName,
            duration: resolved.duration || "24m",
            youtubeVideoId: resolved.youtubeVideoId,
            tag: "સંપૂર્ણ પ્રકરણ (GSEB)"
          },
          {
            id: `vid-g${grade}-${subject.id}-ch${chap.chapterNumber}-2`,
            title: `${chap.title} - Fast Revision & Important Questions`,
            titleGujarati: swadhyayTitle,
            teacher: "GSEB ડિજિટલ શિક્ષણ",
            duration: "18m",
            youtubeVideoId: resolved.youtubeVideoId,
            tag: "સ્વાધ્યાય અને પુનરાવર્તન"
          }
        ];
        updatedCount++;
      }
    }
  }
}

console.log(`Updated ${updatedCount} chapters in curriculum with verified grade-specific videos!`);

// Save updated academicDataSeed.js
const seedPath = path.join(__dirname, '../backend/routes/academicDataSeed.js');
const seedJsContent = `const ACADEMIC_CURRICULUM = ${JSON.stringify(curriculum, null, 2)};\n\nmodule.exports = { ACADEMIC_CURRICULUM };\n`;
fs.writeFileSync(seedPath, seedJsContent, 'utf-8');
console.log('Saved updated backend/routes/academicDataSeed.js!');

// Save to constants/academicData.ts
const academicDataTsPath = path.join(__dirname, '../constants/academicData.ts');
let tsContent = fs.readFileSync(academicDataTsPath, 'utf-8');

const tsStartMarker = 'export const ACADEMIC_CURRICULUM: Record<AcademicGrade, GradeCurriculum> = ';
const tsStartIdx = tsContent.indexOf(tsStartMarker) + tsStartMarker.length;
const tsEndMarker = 'export const SAMPLE_PAPERS_DATA:';
let tsEndIdx = tsContent.indexOf(tsEndMarker);
if (tsEndIdx !== -1) {
  // Back up to the semicolon before SAMPLE_PAPERS_DATA
  const semiIdx = tsContent.lastIndexOf(';', tsEndIdx);
  if (semiIdx !== -1) {
    const updatedJson = JSON.stringify(curriculum, null, 2);
    const newTsContent = tsContent.substring(0, tsStartIdx) + updatedJson + tsContent.substring(semiIdx);
    fs.writeFileSync(academicDataTsPath, newTsContent, 'utf-8');
    console.log('Saved updated constants/academicData.ts!');
  }
}
