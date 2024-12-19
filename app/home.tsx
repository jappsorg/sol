import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Text, Button, useTheme, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import GradeCard from "../components/GradeCard";
import { StorageUtil } from "../utils/StorageUtil";
import { Grade, StoredProgress } from "../models/Types";

export default function HomeScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<StoredProgress>({});
  const [totalWords, setTotalWords] = useState(0);
  const grades: Grade[] = [1, 2, 3, 4, 5];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [progressData, wordsLearned] = await Promise.all([
        StorageUtil.getProgress(),
        StorageUtil.getTotalWordsLearned(),
      ]);
      setProgress(progressData);
      setTotalWords(wordsLearned);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="headlineMedium" style={styles.title}>
            Kids Spelling Bee
          </Text>
          {totalWords > 0 && (
            <Text variant="bodyMedium" style={styles.stats}>
              Total Words Learned: {totalWords}
            </Text>
          )}
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Select Your Grade Level
        </Text>

        {grades.map((grade) => (
          <GradeCard key={grade} grade={grade} progress={progress[grade]} />
        ))}

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            Refresh Progress
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  stats: {
    opacity: 0.7,
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  refreshButton: {
    marginTop: 16,
  },
});
