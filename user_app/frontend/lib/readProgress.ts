import AsyncStorage from '@react-native-async-storage/async-storage';

const READ_PROGRESS_KEY = '@careerguide_read_progress';

export interface ReadProgress {
  articleId: string;
  progress: number; // 0-100
  lastReadAt: string;
  completed: boolean;
}

export interface ArticleProgress {
  articleId: string;
  articleTitle: string;
  articleAuthor?: string;
  scrollProgress?: number; // 0-1
  lastReadAt: number;
  completedAt?: number;
}

// Get all read progress
export const getAllReadProgress = async (): Promise<ReadProgress[]> => {
  try {
    const progressJson = await AsyncStorage.getItem(READ_PROGRESS_KEY);
    return progressJson ? JSON.parse(progressJson) : [];
  } catch (error) {
    console.error('Error getting read progress:', error);
    return [];
  }
};

// Get progress for specific article
export const getArticleProgress = async (articleId: string): Promise<ReadProgress | null> => {
  const allProgress = await getAllReadProgress();
  return allProgress.find((p) => p.articleId === articleId) || null;
};

// Update read progress
export const updateReadProgress = async (
  articleId: string,
  progress: number
): Promise<boolean> => {
  try {
    const allProgress = await getAllReadProgress();
    const existingIndex = allProgress.findIndex((p) => p.articleId === articleId);

    const progressItem: ReadProgress = {
      articleId,
      progress,
      lastReadAt: new Date().toISOString(),
      completed: progress >= 90, // Consider 90% as completed
    };

    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressItem;
    } else {
      allProgress.push(progressItem);
    }

    await AsyncStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('Error updating read progress:', error);
    return false;
  }
};

// Mark article as read
export const markAsRead = async (articleId: string): Promise<boolean> => {
  return await updateReadProgress(articleId, 100);
};

// Get in-progress articles (not completed)
export const getInProgressArticles = async (): Promise<ReadProgress[]> => {
  const allProgress = await getAllReadProgress();
  return allProgress
    .filter((p) => !p.completed && p.progress > 0)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime());
};

// Get completed articles
export const getCompletedArticles = async (): Promise<ReadProgress[]> => {
  const allProgress = await getAllReadProgress();
  return allProgress
    .filter((p) => p.completed)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime());
};
