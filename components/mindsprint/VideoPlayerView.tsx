import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { VideoLecture, VideoComment } from '@/constants/videoData';
import { ApiService, API_BASE_URL } from '@/services/api';

interface VideoPlayerViewProps {
  lecture: VideoLecture;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onCommentAdded?: (comment: VideoComment) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  lecture,
  isBookmarked = false,
  onToggleBookmark,
  onCommentAdded,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  const playerRef = useRef<any>(null);

  const isGujarati = user?.grade !== 'college' && user?.medium === 'Gujarati';

  const displayTitle = (isGujarati && lecture.titleGujarati) ? lecture.titleGujarati : lecture.title;
  const displayDescription = (isGujarati && lecture.descriptionGujarati) ? lecture.descriptionGujarati : lecture.description;
  const displayCategory = (isGujarati && lecture.categoryGujarati) ? lecture.categoryGujarati : lecture.category;
  const displayInstructor = (isGujarati && lecture.instructorGujarati) ? lecture.instructorGujarati : lecture.instructor;

  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'discussion'>('overview');
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localComments, setLocalComments] = useState<VideoComment[]>(lecture.comments || []);

  const notesStorageKey = `@mindsprint_video_notes_${lecture.id}_${user?.email || 'guest'}`;
  const commentsStorageKey = `@mindsprint_video_comments_${lecture.id}`;

  // Restore saved notes and discussion comments on lecture change
  useEffect(() => {
    async function loadStoredData() {
      try {
        const [storedNotes, storedComments] = await Promise.all([
          AsyncStorage.getItem(notesStorageKey),
          AsyncStorage.getItem(commentsStorageKey),
        ]);
        if (storedNotes) {
          setSavedNotes(JSON.parse(storedNotes));
        } else {
          setSavedNotes([]);
        }
        if (storedComments) {
          const parsed = JSON.parse(storedComments);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLocalComments(parsed);
          } else {
            setLocalComments(lecture.comments || []);
          }
        } else {
          setLocalComments(lecture.comments || []);
        }
      } catch (e) {
        console.warn('Error restoring video notes/comments:', e);
      }
    }
    loadStoredData();
  }, [lecture.id, user?.email]);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Lecture Completed! 🎉', `You finished "${displayTitle}"!`);
    } else if (state === 'playing') {
      setPlaying(true);
    } else if (state === 'paused') {
      setPlaying(false);
    }
  }, [displayTitle, isGujarati]);

  const handleLaunchVideo = async (startSec: number = 0) => {
    const timeParam = startSec > 0 ? `&t=${startSec}s` : '';
    const webUrl = `https://www.youtube.com/watch?v=${lecture.youtubeVideoId}${timeParam}`;
    const appUrl = `vnd.youtube://${lecture.youtubeVideoId}`;

    try {
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
        return;
      }
    } catch (_) {}

    try {
      await Linking.openURL(webUrl);
    } catch (_) {
      try {
        await WebBrowser.openBrowserAsync(webUrl);
      } catch (err) {
        Alert.alert('Open Video', `Please visit:\n${webUrl}`);
      }
    }
  };

  const handleOpenPdf = async (url?: string) => {
    if (!url) {
      Alert.alert('Study Material', 'Reference PDF will be available shortly.');
      return;
    }
    let fullUrl = url;
    if (!url.startsWith('http')) {
      const normalizedPath = url.startsWith('/') ? url : `/${url}`;
      const base = API_BASE_URL.replace(/\/api\/?$/, '');
      fullUrl = `${base}${normalizedPath}`;
    }
    try {
      await WebBrowser.openBrowserAsync(fullUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: colors.primary,
      });
    } catch (_) {
      try {
        await Linking.openURL(fullUrl);
      } catch (err) {
        Alert.alert('PDF Link', fullUrl);
      }
    }
  };

  const handleJumpToTimestamp = (timeStr: string) => {
    const parts = timeStr.split(':');
    const targetSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);

    if (playerRef.current) {
      playerRef.current.seekTo(targetSec, true);
      setPlaying(true);
    }
  };

  const handleSaveNote = async () => {
    if (!userNote.trim()) return;
    const noteText = userNote.trim();
    const updated = [...savedNotes, noteText];
    setSavedNotes(updated);
    setUserNote('');
    try {
      await AsyncStorage.setItem(notesStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save personal note:', e);
    }
    Alert.alert('Note Saved 📝', 'Your lesson note has been recorded and safely saved!');
  };

  const handleDeleteNote = async (indexToDelete: number) => {
    const updated = savedNotes.filter((_, idx) => idx !== indexToDelete);
    setSavedNotes(updated);
    try {
      await AsyncStorage.setItem(notesStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete note:', e);
    }
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    setSubmittingComment(true);

    const authorName = user?.name || 'MindSprint Scholar';
    const authorEmail = user?.email || 'scholar@mindsprint.app';

    try {
      const res = await ApiService.addVideoComment(lecture.id, {
        author: authorName,
        userEmail: authorEmail,
        role: user?.isGuest ? 'Guest Student' : 'Verified Learner',
        text: newCommentText.trim(),
      });

      setSubmittingComment(false);

      let commentToAdd: VideoComment;
      if (res.comment) {
        commentToAdd = res.comment;
      } else {
        commentToAdd = {
          id: 'c_' + Date.now(),
          author: authorName,
          role: 'Verified Learner',
          text: newCommentText.trim(),
          upvotes: 1,
          createdAt: 'Just now',
        };
      }

      const updatedComments = [commentToAdd, ...localComments];
      setLocalComments(updatedComments);
      onCommentAdded?.(commentToAdd);
      setNewCommentText('');

      try {
        await AsyncStorage.setItem(commentsStorageKey, JSON.stringify(updatedComments));
      } catch (e) {
        console.warn('Failed to persist comment locally:', e);
      }

      Alert.alert('Discussion Posted 💬', 'Your comment has been shared with fellow students!');
    } catch (err) {
      setSubmittingComment(false);
      const fallbackComment: VideoComment = {
        id: 'c_' + Date.now(),
        author: authorName,
        role: 'Verified Learner',
        text: newCommentText.trim(),
        upvotes: 1,
        createdAt: 'Just now',
      };
      const updatedComments = [fallbackComment, ...localComments];
      setLocalComments(updatedComments);
      onCommentAdded?.(fallbackComment);
      setNewCommentText('');

      try {
        await AsyncStorage.setItem(commentsStorageKey, JSON.stringify(updatedComments));
      } catch (_) {}

      Alert.alert('Note', 'Comment posted and saved locally.');
    }
  };

  const handleUpvote = async (commentId: string) => {
    try {
      await ApiService.upvoteVideoComment(lecture.id, commentId, user?.email);
      const updated = localComments.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c));
      setLocalComments(updated);
      await AsyncStorage.setItem(commentsStorageKey, JSON.stringify(updated));
    } catch (_) {}
  };

  const displayComments = localComments.length > 0 ? localComments : lecture.comments || [];

  const TABS = [
    { key: 'overview' as const, label: 'Overview', icon: 'info-outline' as const },
    { key: 'notes' as const, label: 'Notes', icon: 'sticky-note-2' as const, count: lecture.timeStampedNotes.length + savedNotes.length },
    { key: 'discussion' as const, label: 'Discussion', icon: 'chat-bubble-outline' as const, count: displayComments.length },
  ];

  return (
    <View style={styles.container}>
      {/* 16:9 YouTube Player */}
      <View style={[styles.videoBox, { height: PLAYER_HEIGHT }]}>
        <YoutubePlayer
          key={lecture.id}
          ref={playerRef}
          height={PLAYER_HEIGHT}
          play={playing}
          playbackRate={playbackRate}
          videoId={lecture.youtubeVideoId}
          onChangeState={onStateChange}
          initialPlayerParams={{
            preventFullScreen: false,
            controls: true,
            modestbranding: true,
            rel: false,
          }}
          webViewProps={{
            androidLayerType: 'hardware',
          }}
        />
      </View>

      {/* Playback Speed Controls */}
      <View
        style={[
          styles.speedBar,
          {
            backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc',
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.speedLabelRow}>
          <MaterialIcons name="speed" size={15} color={colors.primary} />
          <Text style={[styles.speedLabel, { color: colors.onSurfaceVariant }]}>Speed:</Text>
        </View>
        <View style={styles.speedChipsRow}>
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => {
            const isSelected = playbackRate === rate;
            return (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.speedChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLowest,
                    borderColor: isSelected ? colors.primary : colors.outlineVariant,
                  },
                ]}
                onPress={() => {
                  setPlaybackRate(rate);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                accessibilityLabel={`Set speed to ${rate}x`}
                accessibilityRole="button"
              >
                <Text style={[styles.speedChipText, { color: isSelected ? '#ffffff' : colors.onSurface }]}>
                  {rate}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Video Info Section */}
      <View style={[styles.infoSection, { backgroundColor: colors.background }]}>
        {/* Title & Actions Row */}
        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <Text style={[styles.videoTitle, { color: colors.onSurface }]} numberOfLines={2}>
              {displayTitle}
            </Text>
            <View style={styles.metaRow}>
              <View style={[styles.categoryChip, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff' }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {displayCategory}
                </Text>
              </View>
              <Text style={[styles.dotSeparator, { color: colors.outline }]}>•</Text>
              <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]}>
                {lecture.duration}
              </Text>
            </View>
            <View style={styles.channelRow}>
              <MaterialIcons name="person" size={14} color={colors.onSurfaceVariant} />
              <Text style={[styles.channelText, { color: colors.onSurfaceVariant }]}>
                {displayInstructor}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionColumn}>
            <TouchableOpacity
              onPress={() => handleLaunchVideo(0)}
              style={[styles.actionBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}
              accessibilityLabel="Open on YouTube"
            >
              <MaterialIcons name="open-in-new" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onToggleBookmark}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isBookmarked
                    ? isDarkMode ? 'rgba(129,140,248,0.2)' : '#eef2ff'
                    : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                  borderColor: isBookmarked ? colors.primary : colors.outlineVariant,
                },
              ]}
            >
              <MaterialIcons
                name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                size={18}
                color={isBookmarked ? colors.primary : colors.outline}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={[styles.tabBar, { borderBottomColor: isDarkMode ? colors.outlineVariant : '#e5e7eb' }]}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
                style={[
                  styles.tabItem,
                  isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 },
                ]}
              >
                <MaterialIcons
                  name={tab.icon}
                  size={16}
                  color={isActive ? colors.primary : colors.outline}
                />
                <Text style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : colors.outline },
                  isActive && { fontWeight: '700' },
                ]}>
                  {tab.label}
                </Text>
                {tab.count !== undefined && (
                  <View style={[styles.tabCountBadge, { backgroundColor: isActive ? colors.primary : isDarkMode ? colors.surfaceContainerHigh : '#e5e7eb' }]}>
                    <Text style={[styles.tabCountText, { color: isActive ? '#ffffff' : colors.onSurfaceVariant }]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' ? (
            <View style={styles.overviewContent}>
              <Text style={[styles.descriptionText, { color: colors.onSurface }]}>
                {displayDescription}
              </Text>

              {/* YouTube Launch Card */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.youtubeCard, {
                  backgroundColor: isDarkMode ? 'rgba(129,140,248,0.08)' : 'rgba(30,0,169,0.04)',
                  borderColor: isDarkMode ? 'rgba(129,140,248,0.2)' : 'rgba(30,0,169,0.12)',
                }]}
                onPress={() => handleLaunchVideo(0)}
              >
                <View style={[styles.ytIconCircle, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ytCardTitle, { color: colors.primary }]}>
                    Watch on YouTube
                  </Text>
                  <Text style={[styles.ytCardSub, { color: colors.onSurfaceVariant }]}>
                    {isGujarati ? 'Full HD stream • GSEB textbook support' : 'Full HD stream • Supports the creator'}
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={14} color={colors.primary} />
              </TouchableOpacity>

              {/* Reference Textbook & Study Material PDF Card */}
              {lecture.referencePdfUrl && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.youtubeCard, {
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2',
                    borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.25)' : '#fecaca',
                    marginTop: 10,
                  }]}
                  onPress={() => handleOpenPdf(lecture.referencePdfUrl)}
                >
                  <View style={[styles.ytIconCircle, { backgroundColor: '#ef4444' }]}>
                    <MaterialIcons name="picture-as-pdf" size={20} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ytCardTitle, { color: '#ef4444' }]}>
                      {isGujarati ? 'ઓફિશિયલ પાઠ્યપુસ્તક / નોટ્સ PDF' : 'Official NCERT / GSEB Textbook PDF'}
                    </Text>
                    <Text style={[styles.ytCardSub, { color: colors.onSurfaceVariant }]}>
                      {isGujarati ? 'પ્રકરણ આધારિત ડિજિટલ પુસ્તક • ઑફલાઇન સપોર્ટ' : 'Read official textbook chapter material & diagrams'}
                    </Text>
                  </View>
                  <MaterialIcons name="open-in-new" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ) : activeTab === 'notes' ? (
            <View style={styles.notesContent}>
              {/* Timestamped Notes */}
              <Text style={[styles.sectionLabel, { color: colors.onSurface }]}>
                📌 Key Timestamps
              </Text>
              <View style={styles.timestampGrid}>
                {lecture.timeStampedNotes.map((note, idx) => {
                  const noteText = (isGujarati && note.textGujarati) ? note.textGujarati : note.text;
                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      style={[styles.timestampCard, {
                        backgroundColor: isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                        borderColor: isDarkMode ? colors.outlineVariant : '#e5e7eb',
                      }]}
                      onPress={() => handleJumpToTimestamp(note.time)}
                    >
                      <View style={styles.timestampTop}>
                        <View style={[styles.timePill, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : '#eef2ff' }]}>
                          <MaterialIcons name="access-time" size={10} color={colors.primary} />
                          <Text style={[styles.timePillText, { color: colors.primary }]}>
                            {note.time}
                          </Text>
                        </View>
                        <MaterialIcons name="play-circle-outline" size={18} color={colors.primary} />
                      </View>
                      <Text style={[styles.timestampNote, { color: colors.onSurface }]} numberOfLines={2}>
                        {noteText}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Saved Personal Notes */}
              {savedNotes.length > 0 && (
                <View style={styles.personalNotes}>
                  <Text style={[styles.sectionLabel, { color: colors.onSurface }]}>
                    📝 Your Notes
                  </Text>
                  {savedNotes.map((sn, idx) => (
                    <View key={idx} style={[styles.personalNoteCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#fefce8', borderColor: isDarkMode ? colors.outlineVariant : '#fef08a' }]}>
                      <MaterialIcons name="note" size={14} color={isDarkMode ? colors.primary : '#ca8a04'} />
                      <Text style={[styles.personalNoteText, { color: colors.onSurface, flex: 1 }]}>{sn}</Text>
                      <TouchableOpacity onPress={() => handleDeleteNote(idx)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <MaterialIcons name="delete-outline" size={16} color={colors.outline} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Note Input */}
              <View style={[styles.addNoteRow, {
                backgroundColor: isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                borderColor: isDarkMode ? colors.outlineVariant : '#e5e7eb',
              }]}>
                <TextInput
                  style={[styles.noteInput, { color: colors.onSurface }]}
                  placeholder="Add a personal note..."
                  placeholderTextColor={colors.outline}
                  value={userNote}
                  onChangeText={setUserNote}
                  onSubmitEditing={handleSaveNote}
                />
                <TouchableOpacity
                  style={[styles.addNoteBtn, { backgroundColor: userNote.trim() ? colors.primary : isDarkMode ? colors.surfaceContainerHigh : '#e5e7eb' }]}
                  onPress={handleSaveNote}
                  disabled={!userNote.trim()}
                >
                  <MaterialIcons name="send" size={16} color={userNote.trim() ? '#ffffff' : colors.outline} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Live Interactive Discussion Tab */
            <View style={styles.discussionContent}>
              {/* Post New Comment Input */}
              <View style={[styles.addCommentCard, {
                backgroundColor: isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                borderColor: isDarkMode ? colors.outlineVariant : '#e5e7eb',
              }]}>
                <TextInput
                  style={[styles.commentInput, { color: colors.onSurface }]}
                  placeholder="Ask a question or share exam tips..."
                  placeholderTextColor={colors.outline}
                  multiline
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                />
                <View style={styles.commentActionRow}>
                  <Text style={[styles.postingAsText, { color: colors.outline }]}>
                    {`Posting as ${user?.name || 'Student'}`}
                  </Text>
                  <TouchableOpacity
                    style={[styles.postBtn, { backgroundColor: newCommentText.trim() ? colors.primary : isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0' }]}
                    onPress={handlePostComment}
                    disabled={!newCommentText.trim() || submittingComment}
                  >
                    {submittingComment ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <MaterialIcons name="send" size={14} color={newCommentText.trim() ? '#ffffff' : colors.outline} />
                        <Text style={[styles.postBtnText, { color: newCommentText.trim() ? '#ffffff' : colors.outline }]}>
                          Post
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Comments Stream */}
              {displayComments.map((cmt) => {
                const initials = cmt.author
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'MS';

                return (
                  <View
                    key={cmt.id}
                    style={[styles.discussionCard, {
                      backgroundColor: isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                      borderColor: isDarkMode ? colors.outlineVariant : '#e5e7eb',
                    }]}
                  >
                    <View style={styles.commentTopRow}>
                      <View style={[styles.avatarCircle, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : '#eef2ff' }]}>
                        <Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.commentName, { color: colors.onSurface }]}>
                          {cmt.author}
                        </Text>
                        <Text style={[styles.commentMeta, { color: colors.outline }]}>
                          {cmt.role || 'Student'} • {typeof cmt.createdAt === 'string' ? cmt.createdAt : 'Recent'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.upvoteBox}
                        activeOpacity={0.7}
                        onPress={() => handleUpvote(cmt.id)}
                      >
                        <MaterialIcons name="thumb-up-off-alt" size={14} color={colors.primary} />
                        <Text style={[styles.upvoteText, { color: colors.primary }]}>{cmt.upvotes}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.commentBody, { color: colors.onSurface }]}>
                      &ldquo;{cmt.text}&rdquo;
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoBox: {
    width: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  titleContent: {
    flex: 1,
    marginRight: 12,
    gap: 6,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dotSeparator: {
    fontSize: 10,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionColumn: {
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabCountBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabCountText: {
    fontSize: 9,
    fontWeight: '800',
  },
  tabContent: {
    minHeight: 120,
  },
  // Overview Tab
  overviewContent: {
    gap: 14,
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 21,
    fontWeight: '400',
  },
  youtubeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  ytIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytCardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  ytCardSub: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  // Notes Tab
  notesContent: {
    gap: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  timestampGrid: {
    gap: 8,
  },
  timestampCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  timestampTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  timestampNote: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  personalNotes: {
    gap: 6,
  },
  personalNoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  personalNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  addNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  noteInput: {
    flex: 1,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  addNoteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Discussion Tab
  discussionContent: {
    gap: 12,
  },
  addCommentCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  commentInput: {
    minHeight: 50,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  commentActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postingAsText: {
    fontSize: 11,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  postBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  discussionCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  commentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  commentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentMeta: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  upvoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upvoteText: {
    fontSize: 12,
    fontWeight: '700',
  },
  commentBody: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  speedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  speedLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  speedLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  speedChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speedChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  speedChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
