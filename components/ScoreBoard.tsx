import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, Card, ProgressBar, useTheme } from "react-native-paper";
import { Score } from "../models/Types";

interface ScoreBoardProps {
  score: Score;
  showStreak?: boolean;
  animated?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  showStreak = true,
  animated = true,
}) => {
  const theme = useTheme();
  const progressValue = score.total > 0 ? score.current / score.total : 0;

  // Animation for score changes
  const scoreAnim = React.useRef(new Animated.Value(0)).current;
  const streakAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animated) {
      // Animate score number counting up
      Animated.spring(scoreAnim, {
        toValue: score.current,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      // Pulse animation for streak
      if (score.streak > 0) {
        Animated.sequence([
          Animated.timing(streakAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(streakAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [score.current, score.streak, animated]);

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreSection}>
            <Text variant="titleMedium" style={styles.label}>
              Score
            </Text>
            <Animated.Text
              style={[
                styles.scoreText,
                {
                  transform: [
                    {
                      scale: animated
                        ? scoreAnim.interpolate({
                            inputRange: [0, score.current],
                            outputRange: [0.5, 1],
                          })
                        : 1,
                    },
                  ],
                },
              ]}
            >
              {score.current}
            </Animated.Text>
          </View>

          {showStreak && score.streak > 0 && (
            <Animated.View
              style={[
                styles.streakSection,
                { transform: [{ scale: streakAnim }] },
              ]}
            >
              <Text variant="titleMedium" style={styles.label}>
                Streak
              </Text>
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>{score.streak} 🔥</Text>
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.progressSection}>
          <Text variant="bodyMedium" style={styles.progressText}>
            Progress: {score.current}/{score.total}
          </Text>
          <ProgressBar
            progress={progressValue}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreSection: {
    flex: 1,
    alignItems: "center",
  },
  streakSection: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressSection: {
    marginTop: 8,
  },
  progressText: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default ScoreBoard;
