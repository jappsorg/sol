import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isCorrect?: boolean | null;
  disabled?: boolean;
  showResult?: boolean;
  onNext?: () => void;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmit,
  isCorrect = null,
  disabled = false,
  showResult = false,
  onNext,
}) => {
  const [answer, setAnswer] = useState("");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    if (answer.trim()) {
      Keyboard.dismiss();
      onSubmit(answer.trim().toLowerCase());
    }
  };

  const handleNext = () => {
    setAnswer("");
    if (onNext) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          mode="outlined"
          label="Type your answer"
          value={answer}
          onChangeText={setAnswer}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          disabled={disabled}
          right={
            isCorrect !== null && showResult ? (
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={isCorrect ? "checkmark-circle" : "close-circle"}
                    size={24}
                    color={isCorrect ? "#4CAF50" : "#F44336"}
                  />
                )}
              />
            ) : undefined
          }
        />
        {!showResult ? (
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={disabled || !answer.trim()}
            style={styles.button}
          >
            Submit
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
          >
            Next Word
          </Button>
        )}
      </View>
      {showResult && (
        <Text
          style={[
            styles.resultText,
            { color: isCorrect ? "#4CAF50" : "#F44336" },
          ]}
        >
          {isCorrect ? "Correct!" : "Incorrect. Try the next word!"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    minWidth: 100,
    justifyContent: "center",
  },
  resultText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
