import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, ProgressBar, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { Grade, Progress } from "../models/Types";

interface GradeCardProps {
  grade: Grade;
  progress?: {
    practice: Progress;
    quiz: Progress;
  };
}

export const GradeCard: React.FC<GradeCardProps> = ({ grade, progress }) => {
  const theme = useTheme();

  const calculateProgress = () => {
    if (!progress) return 0;

    const practiceAccuracy =
      progress.practice.totalAttempts > 0
        ? progress.practice.correctAttempts / progress.practice.totalAttempts
        : 0;

    const quizAccuracy =
      progress.quiz.totalAttempts > 0
        ? progress.quiz.correctAttempts / progress.quiz.totalAttempts
        : 0;

    // Average of practice and quiz progress
    return (practiceAccuracy + quizAccuracy) / 2;
  };

  const getGradeEmoji = (grade: Grade): string => {
    const emojis: Record<Grade, string> = {
      1: "🌟",
      2: "🌈",
      3: "🚀",
      4: "🎯",
      5: "👑",
    };
    return emojis[grade];
  };

  const getGradeDescription = (grade: Grade): string => {
    const descriptions: Record<Grade, string> = {
      1: "Basic sight words and simple phonics",
      2: "Common word patterns and blends",
      3: "Compound words and prefixes",
      4: "Advanced vocabulary and suffixes",
      5: "Complex words and root words",
    };
    return descriptions[grade];
  };

  const handlePress = () => {
    router.push(`/levels?grade=${grade}`);
  };

  return (
    <Card style={styles.card} onPress={handlePress} mode="elevated">
      <Card.Content>
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium" style={styles.gradeText}>
            {getGradeEmoji(grade)} Grade {grade}
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.description}>
          {getGradeDescription(grade)}
        </Text>

        <View style={styles.progressContainer}>
          <Text variant="bodySmall" style={styles.progressText}>
            Progress: {Math.round(calculateProgress() * 100)}%
          </Text>
          <ProgressBar
            progress={calculateProgress()}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>

        {progress && (
          <View style={styles.statsContainer}>
            <Text variant="bodySmall" style={styles.statsText}>
              Practice: {progress.practice.correctAttempts}/
              {progress.practice.totalAttempts} words
            </Text>
            <Text variant="bodySmall" style={styles.statsText}>
              Quiz: {progress.quiz.correctAttempts}/
              {progress.quiz.totalAttempts} words
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  gradeText: {
    fontWeight: "bold",
  },
  description: {
    marginBottom: 16,
    opacity: 0.8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statsText: {
    opacity: 0.6,
  },
});

export default GradeCard;
