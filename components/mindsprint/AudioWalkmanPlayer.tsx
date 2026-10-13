import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';

export interface AudioTrackItem {
  id: string;
  title: string;
  titleGujarati?: string;
  chapterNumber: number;
  subject: string;
  duration: string;
  contentToSpeak: string;
}

interface AudioWalkmanPlayerProps {
  visible: boolean;
  tracks: AudioTrackItem[];
  initialTrackIndex?: number;
  onClose: () => void;
}

export const AudioWalkmanPlayer: React.FC<AudioWalkmanPlayerProps> = ({
  visible,
  tracks,
  initialTrackIndex = 0,
  onClose,
}) => {
  const { colors, isDarkMode } = useTheme();

  const [currentIndex, setCurrentIndex] = useState<number>(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    setCurrentIndex(initialTrackIndex);
  }, [initialTrackIndex]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const currentTrack = tracks[currentIndex] || tracks[0];

  const stopSpeech = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const speakCurrentTrack = () => {
    if (!currentTrack) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = currentTrack.contentToSpeak.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = speedMultiplier;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsPlaying(true);
        setProgressPercent(15);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setProgressPercent(100);
        // Auto-advance to next track if available
        if (currentIndex < tracks.length - 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 1000);
        }
      };

      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(true);
      setProgressPercent(30);
      setTimeout(() => {
        setProgressPercent(100);
        setIsPlaying(false);
      }, 5000);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      speakCurrentTrack();
    }
  };

  const handleNext = () => {
    stopSpeech();
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speedMultiplier === 1.0 ? 1.25 : speedMultiplier === 1.25 ? 1.5 : 1.0;
    setSpeedMultiplier(nextSpeed);
    if (isPlaying) {
      stopSpeech();
      setTimeout(speakCurrentTrack, 200);
    }
  };

  if (!visible || !currentTrack) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.playerCard, { backgroundColor: '#0f172a' }, MindSprintShadows.glow]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.tagBadge}>
              <MaterialIcons name="headphones" size={14} color="#38bdf8" />
              <Text style={styles.tagBadgeText}>AUDIO REVISION WALKMAN</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="keyboard-arrow-down" size={28} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Album Vinyl / Waveform Graphic */}
          <View style={styles.albumArtContainer}>
            <View style={[styles.vinylCircle, isPlaying && styles.vinylSpin]}>
              <View style={styles.vinylCenter}>
                <MaterialIcons name="school" size={32} color="#38bdf8" />
              </View>
            </View>
            {isPlaying && (
              <View style={styles.waveformRow}>
                {[12, 28, 44, 20, 36, 16, 32, 48, 24, 16].map((h, i) => (
                  <View key={i} style={[styles.waveBar, { height: h }]} />
                ))}
              </View>
            )}
          </View>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={styles.subjectText}>{currentTrack.subject} • Chapter {currentTrack.chapterNumber}</Text>
            <Text style={styles.trackTitle} numberOfLines={2}>
              {currentTrack.titleGujarati || currentTrack.title}
            </Text>
            <Text style={styles.counterText}>
              Track {currentIndex + 1} of {tracks.length} • Duration: {currentTrack.duration}
            </Text>
          </View>

          {/* Scrubber Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${isPlaying ? progressPercent : 0}%` }]} />
            </View>
          </View>

          {/* Media Controls */}
          <View style={styles.controlsRow}>
            {/* Speed Multiplier Pill */}
            <TouchableOpacity style={styles.speedBtn} onPress={cycleSpeed}>
              <Text style={styles.speedBtnText}>{speedMultiplier}x</Text>
            </TouchableOpacity>

            {/* Prev Track */}
            <TouchableOpacity style={styles.navBtn} onPress={handlePrev} disabled={currentIndex === 0}>
              <MaterialIcons name="skip-previous" size={32} color={currentIndex === 0 ? '#475569' : '#ffffff'} />
            </TouchableOpacity>

            {/* Play / Pause Primary Button */}
            <TouchableOpacity style={styles.playBtn} onPress={handleTogglePlay}>
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={38} color="#0f172a" />
            </TouchableOpacity>

            {/* Next Track */}
            <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
              <MaterialIcons name="skip-next" size={32} color="#ffffff" />
            </TouchableOpacity>

            {/* Loop / Auto Advance Indicator */}
            <View style={styles.loopPill}>
              <MaterialIcons name="repeat" size={18} color="#38bdf8" />
            </View>
          </View>

          {/* Listening Tip */}
          <Text style={styles.tipText}>
            💡 Put on headphones and listen while traveling or before sleep to cement formulas in long-term memory.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  playerCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    gap: 16,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  albumArtContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  vinylCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1e293b',
    borderWidth: 6,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylSpin: {
    borderColor: '#38bdf8',
  },
  vinylCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 14,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#38bdf8',
  },
  trackInfo: {
    alignItems: 'center',
    gap: 4,
  },
  subjectText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  counterText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    paddingVertical: 6,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  speedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  speedBtnText: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 12,
  },
  navBtn: {
    padding: 8,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loopPill: {
    padding: 8,
  },
  tipText: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
