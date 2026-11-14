// Single source of truth for video lectures: backend/data/videos.json (shared by app and server).
import videosData from '../backend/data/videos.json';

export interface VideoComment {
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

export const VIDEO_LECTURES_DATA: VideoLecture[] = videosData as unknown as VideoLecture[];
