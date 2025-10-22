import type { UserProgress, IkigaiResults } from '../types';

const PROGRESS_KEY = 'hatarakigai_progress';
const RESULTS_KEY = 'hatarakigai_results';

export const storage = {
  // Save user progress
  saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  // Load user progress
  loadProgress(): UserProgress | null {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (!data) return null;

      const progress = JSON.parse(data);
      // Convert date strings back to Date objects
      progress.startedAt = new Date(progress.startedAt);
      progress.lastUpdated = new Date(progress.lastUpdated);
      progress.responses = progress.responses.map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp),
      }));
      progress.reflections = progress.reflections.map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp),
      }));

      return progress;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  },

  // Clear progress (for starting over)
  clearProgress(): void {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  },

  // Save results
  saveResults(results: IkigaiResults): void {
    try {
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  },

  // Load results
  loadResults(): IkigaiResults | null {
    try {
      const data = localStorage.getItem(RESULTS_KEY);
      if (!data) return null;

      const results = JSON.parse(data);
      results.completedAt = new Date(results.completedAt);

      return results;
    } catch (error) {
      console.error('Failed to load results:', error);
      return null;
    }
  },

  // Clear results
  clearResults(): void {
    try {
      localStorage.removeItem(RESULTS_KEY);
    } catch (error) {
      console.error('Failed to clear results:', error);
    }
  },

  // Clear all data
  clearAll(): void {
    this.clearProgress();
    this.clearResults();
  },
};
