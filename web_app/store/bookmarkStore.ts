import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkState {
  jobs: string[];
  internships: string[];
  scholarships: string[];
  articles: string[];
  
  toggleJobBookmark: (id: string) => void;
  toggleInternshipBookmark: (id: string) => void;
  toggleScholarshipBookmark: (id: string) => void;
  toggleArticleBookmark: (id: string) => void;
  
  isJobBookmarked: (id: string) => boolean;
  isInternshipBookmarked: (id: string) => boolean;
  isScholarshipBookmarked: (id: string) => boolean;
  isArticleBookmarked: (id: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()()
  persist(
    (set, get) => ({
      jobs: [],
      internships: [],
      scholarships: [],
      articles: [],

      toggleJobBookmark: (id: string) => {
        set((state) => ({
          jobs: state.jobs.includes(id)
            ? state.jobs.filter((jobId) => jobId !== id)
            : [...state.jobs, id],
        }));
      },

      toggleInternshipBookmark: (id: string) => {
        set((state) => ({
          internships: state.internships.includes(id)
            ? state.internships.filter((internshipId) => internshipId !== id)
            : [...state.internships, id],
        }));
      },

      toggleScholarshipBookmark: (id: string) => {
        set((state) => ({
          scholarships: state.scholarships.includes(id)
            ? state.scholarships.filter((scholarshipId) => scholarshipId !== id)
            : [...state.scholarships, id],
        }));
      },

      toggleArticleBookmark: (id: string) => {
        set((state) => ({
          articles: state.articles.includes(id)
            ? state.articles.filter((articleId) => articleId !== id)
            : [...state.articles, id],
        }));
      },

      isJobBookmarked: (id: string) => get().jobs.includes(id),
      isInternshipBookmarked: (id: string) => get().internships.includes(id),
      isScholarshipBookmarked: (id: string) => get().scholarships.includes(id),
      isArticleBookmarked: (id: string) => get().articles.includes(id),
    }),
    {
      name: 'bookmark-storage',
    }
  )
);
