import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SpeechService } from "../services/SpeechService";
import type { Word } from "../models/Types";
import * as Haptics from "expo-haptics";

interface WordDisplayProps {
  word: Word | null;
  showWord?: boolean;
  onWordSpoken?: () => void;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  showWord = false,
  onWordSpoken,
}) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const speechService = SpeechService.getInstance();

  const playWord = useCallback(async () => {
    if (!word || isPlaying) return;

    try {
      setIsPlaying(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Speak the word
      await speechService.speak(word.word, {
        rate: 0.75, // Slower rate for better clarity
        pitch: 1.0,
        language: "en-US",
      });

      // Pause briefly
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Speak the sentence for context
      await speechService.speak(word.sentence, {
        rate: 0.8,
        pitch: 1.0,
        language: "en-US",
      });

      onWordSpoken?.();
    } catch (error) {
      console.error("Error playing word:", error);
    } finally {
      setIsPlaying(false);
    }
  }, [word, isPlaying, onWordSpoken]);

  useEffect(() => {
    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      speechService.stop();
    };
  }, []);

  if (!word) {
    return (
      <Card style={styles.container}>
        <Card.Content style={styles.content}>
          <Text variant="titleLarge" style={styles.placeholder}>
            Loading word...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <View style={styles.wordContainer}>
          {showWord ? (
            <Text variant="headlineMedium" style={styles.word}>
              {word.word}
            </Text>
          ) : (
            <Text variant="headlineMedium" style={styles.hiddenWord}>
              {word.word.replace(/./g, "•")}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={playWord}
            loading={isPlaying}
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name={isPlaying ? "volume-high" : "volume-medium"}
                size={size}
                color={color}
              />
            )}
            style={styles.playButton}
          >
            {isPlaying ? "Playing..." : "Hear Word"}
          </Button>
        </View>
        <Text variant="bodyLarge" style={styles.definition}>
          Definition: {word.definition}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
  },
  content: {
    alignItems: "center",
    padding: 16,
  },
  wordContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  word: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  hiddenWord: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 4,
  },
  definition: {
    textAlign: "center",
    marginTop: 8,
  },
  playButton: {
    marginTop: 8,
  },
  placeholder: {
    textAlign: "center",
    opacity: 0.5,
  },
});
