import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StorageKeys,
  StoredProgress,
  Grade,
  Progress,
  GameMode,
} from "../models/Types";

export class StorageUtil {
  /**
   * Initialize progress data for a new user
   */
  private static initializeProgress = (
    grade: Grade
  ): StoredProgress[string] => ({
    practice: {
      correctWords: [],
      incorrectWords: [],
      totalAttempts: 0,
      correctAttempts: 0,
    },
    quiz: {
      correctWords: [],
      incorrectWords: [],
      totalAttempts: 0,
      correctAttempts: 0,
    },
  });

  /**
   * Get all progress data
   */
  static getProgress = async (): Promise<StoredProgress> => {
    try {
      const progressData = await AsyncStorage.getItem(StorageKeys.PROGRESS);
      if (progressData) {
        return JSON.parse(progressData);
      }
      return {};
    } catch (error) {
      console.error("Error getting progress:", error);
      return {};
    }
  };

  /**
   * Get progress for specific grade
   */
  static getGradeProgress = async (
    grade: Grade
  ): Promise<StoredProgress[string]> => {
    try {
      const allProgress = await this.getProgress();
      return allProgress[grade] || this.initializeProgress(grade);
    } catch (error) {
      console.error("Error getting grade progress:", error);
      return this.initializeProgress(grade);
    }
  };

  /**
   * Update progress for a specific grade and mode
   */
  static updateProgress = async (
    grade: Grade,
    mode: GameMode,
    update: Partial<Progress>
  ): Promise<boolean> => {
    try {
      const allProgress = await this.getProgress();
      const gradeProgress =
        allProgress[grade] || this.initializeProgress(grade);

      // Update the specific mode's progress
      gradeProgress[mode] = {
        ...gradeProgress[mode],
        ...update,
        correctWords: [
          ...new Set([
            ...gradeProgress[mode].correctWords,
            ...(update.correctWords || []),
          ]),
        ],
        incorrectWords: [
          ...new Set([
            ...gradeProgress[mode].incorrectWords,
            ...(update.incorrectWords || []),
          ]),
        ],
      };

      allProgress[grade] = gradeProgress;

      await AsyncStorage.setItem(
        StorageKeys.PROGRESS,
        JSON.stringify(allProgress)
      );
      return true;
    } catch (error) {
      console.error("Error updating progress:", error);
      return false;
    }
  };

  /**
   * Get current grade
   */
  static getCurrentGrade = async (): Promise<Grade | null> => {
    try {
      const grade = await AsyncStorage.getItem(StorageKeys.CURRENT_GRADE);
      return grade ? (parseInt(grade) as Grade) : null;
    } catch (error) {
      console.error("Error getting current grade:", error);
      return null;
    }
  };

  /**
   * Set current grade
   */
  static setCurrentGrade = async (grade: Grade): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(StorageKeys.CURRENT_GRADE, grade.toString());
      return true;
    } catch (error) {
      console.error("Error setting current grade:", error);
      return false;
    }
  };

  /**
   * Update last played timestamp
   */
  static updateLastPlayed = async (): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.LAST_PLAYED,
        Date.now().toString()
      );
      return true;
    } catch (error) {
      console.error("Error updating last played:", error);
      return false;
    }
  };

  /**
   * Get last played timestamp
   */
  static getLastPlayed = async (): Promise<number | null> => {
    try {
      const timestamp = await AsyncStorage.getItem(StorageKeys.LAST_PLAYED);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error("Error getting last played:", error);
      return null;
    }
  };

  /**
   * Calculate accuracy for a specific grade and mode
   */
  static getAccuracy = async (
    grade: Grade,
    mode: GameMode
  ): Promise<number> => {
    try {
      const progress = await this.getGradeProgress(grade);
      const { totalAttempts, correctAttempts } = progress[mode];
      return totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    } catch (error) {
      console.error("Error calculating accuracy:", error);
      return 0;
    }
  };

  /**
   * Reset progress for a specific grade
   */
  static resetGradeProgress = async (grade: Grade): Promise<boolean> => {
    try {
      const allProgress = await this.getProgress();
      allProgress[grade] = this.initializeProgress(grade);
      await AsyncStorage.setItem(
        StorageKeys.PROGRESS,
        JSON.stringify(allProgress)
      );
      return true;
    } catch (error) {
      console.error("Error resetting grade progress:", error);
      return false;
    }
  };

  /**
   * Reset all progress data
   */
  static resetAllProgress = async (): Promise<boolean> => {
    try {
      await AsyncStorage.multiRemove([
        StorageKeys.PROGRESS,
        StorageKeys.CURRENT_GRADE,
        StorageKeys.LAST_PLAYED,
      ]);
      return true;
    } catch (error) {
      console.error("Error resetting all progress:", error);
      return false;
    }
  };

  /**
   * Get total words learned across all grades
   */
  static getTotalWordsLearned = async (): Promise<number> => {
    try {
      const allProgress = await this.getProgress();
      return Object.values(allProgress).reduce((total, gradeProgress) => {
        const practiceWords = gradeProgress.practice.correctWords.length;
        const quizWords = gradeProgress.quiz.correctWords.length;
        return total + practiceWords + quizWords;
      }, 0);
    } catch (error) {
      console.error("Error getting total words learned:", error);
      return 0;
    }
  };
}
