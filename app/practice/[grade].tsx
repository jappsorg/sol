import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { WordDisplay } from "../../components/WordDisplay";
import { AnswerInput } from "../../components/AnswerInput";
import ScoreBoard from "../../components/ScoreBoard";
import AnthropicService from "../../services/AnthropicService";
import { StorageUtil } from "../../utils/StorageUtil";
import { Word, Grade } from "../../models/Types";
import * as Haptics from "expo-haptics";

export default function PracticeScreen() {
  const { grade } = useLocalSearchParams<{ grade: string }>();
  const theme = useTheme();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({
    current: 0,
    total: 10,
    streak: 0,
  });

  const loadNewWord = useCallback(async () => {
    try {
      setIsLoading(true);
      const word = await AnthropicService.getRandomWordForGrade(
        Number(grade) as Grade
      );
      setCurrentWord(word);
    } catch (error) {
      console.error("Error loading word:", error);
    } finally {
      setIsLoading(false);
    }
  }, [grade]);

  useEffect(() => {
    loadNewWord();
  }, [loadNewWord]);

  const handleSubmit = async (answer: string) => {
    setIsChecking(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const isAnswerCorrect =
      answer.toLowerCase().trim() === currentWord?.word.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);

    // Update score and storage
    const newScore = {
      ...score,
      current: isAnswerCorrect ? score.current + 1 : score.current,
      streak: isAnswerCorrect ? score.streak + 1 : 0,
    };
    setScore(newScore);

    // Update progress in storage
    if (currentWord) {
      await StorageUtil.updateProgress(Number(grade) as Grade, "practice", {
        correctWords: isAnswerCorrect ? [currentWord.word] : [],
        incorrectWords: !isAnswerCorrect ? [currentWord.word] : [],
        totalAttempts: 1,
        correctAttempts: isAnswerCorrect ? 1 : 0,
      });
    }

    setIsChecking(false);
  };

  const handleNext = async () => {
    setIsCorrect(null);
    await loadNewWord();
  };

  const handleExit = () => {
    router.push("/home");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{
            title: `Grade ${grade} Practice`,
            headerLeft: () => <Button onPress={handleExit}>Exit</Button>,
          }}
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Grade ${grade} Practice`,
          headerLeft: () => <Button onPress={handleExit}>Exit</Button>,
        }}
      />

      <ScoreBoard score={score} showStreak={true} />

      <WordDisplay word={currentWord} showWord={isCorrect !== null} />

      <View style={styles.inputContainer}>
        <AnswerInput
          onSubmit={handleSubmit}
          isCorrect={isCorrect}
          disabled={isChecking || isCorrect !== null}
          showResult={isCorrect !== null}
          onNext={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
});
