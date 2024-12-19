import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default function LevelsScreen() {
  const router = useRouter();
  const { grade } = useLocalSearchParams();

  const handlePracticePress = () => {
    router.push(`/practice/${grade}`);
  };

  const handleQuizPress = () => {
    router.push(`/quiz/${grade}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text variant="headlineMedium" style={styles.title}>
        Grade {grade} - Choose Mode
      </Text>

      <View style={styles.cardsContainer}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Practice Mode
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Learn and practice spelling words at your own pace. Get instant
              feedback and unlimited attempts.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={handlePracticePress}
              style={styles.button}
            >
              Start Practice
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Quiz Mode
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Test your spelling skills with a timed quiz. Complete 10 words to
              get your score.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={handleQuizPress}
              style={styles.button}
            >
              Start Quiz
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  card: {
    marginHorizontal: 8,
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 10,
    textAlign: "center",
  },
  cardDescription: {
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
});
