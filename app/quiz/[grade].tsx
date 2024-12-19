import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { WordDisplay } from "../../components/WordDisplay";
import { AnswerInput } from "../../components/AnswerInput";
import ScoreBoard from "../../components/ScoreBoard";
import AnthropicService from "../../services/AnthropicService";
import { StorageUtil } from "../../utils/StorageUtil";
import { Word, Grade, GameMode } from "../../models/Types";
import * as Haptics from "expo-haptics";

const QUIZ_LENGTH = 10; // Number of words per quiz

export default function QuizScreen() {
  const { grade } = useLocalSearchParams<{ grade: string }>();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({
    current: 0,
    total: QUIZ_LENGTH,
    streak: 0,
  });
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadWords = useCallback(async () => {
    try {
      setIsLoading(true);
      const gradeNum = parseInt(grade as string) as Grade;
      const wordList = await AnthropicService.getWordsForGrade(gradeNum);
      // Shuffle and take QUIZ_LENGTH words
      const shuffled = [...wordList]
        .sort(() => Math.random() - 0.5)
        .slice(0, QUIZ_LENGTH);
      setWords(shuffled);
      setCurrentWord(shuffled[0]);
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setIsLoading(false);
    }
  }, [grade]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const handleAnswer = async (answer: string) => {
    setIsChecking(true);
    const isAnswerCorrect =
      answer.toLowerCase().trim() === currentWord?.word.toLowerCase().trim();

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore((prev) => ({
        ...prev,
        current: prev.current + 1,
        streak: prev.streak + 1,
      }));
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setScore((prev) => ({
        ...prev,
        streak: 0,
      }));
    }

    // Update progress in storage
    if (currentWord) {
      await StorageUtil.updateProgress(
        parseInt(grade as string) as Grade,
        "quiz" as GameMode,
        {
          correctWords: isAnswerCorrect ? [currentWord.word] : [],
          incorrectWords: !isAnswerCorrect ? [currentWord.word] : [],
          totalAttempts: 1,
          correctAttempts: isAnswerCorrect ? 1 : 0,
        }
      );
    }
  };

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    setIsChecking(false);
    setIsCorrect(null);

    if (nextIndex < words.length) {
      setCurrentIndex(nextIndex);
      setCurrentWord(words[nextIndex]);
    } else {
      // Quiz completed
      router.push({
        pathname: "/results",
        params: {
          grade,
          score: score.current,
          total: QUIZ_LENGTH,
        },
      });
    }
  }, [currentIndex, words, grade, score]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading quiz words...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Grade ${grade} Quiz`,
          headerBackTitle: "Exit Quiz",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScoreBoard score={score} />

        <WordDisplay word={currentWord} showWord={isChecking} />

        <AnswerInput
          onSubmit={handleAnswer}
          isCorrect={isCorrect}
          disabled={isChecking}
          showResult={isChecking}
          onNext={handleNext}
        />

        {isChecking && (
          <View style={styles.progressIndicator}>
            <Text variant="bodyMedium">
              {currentIndex + 1} of {QUIZ_LENGTH} words
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  progressIndicator: {
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
