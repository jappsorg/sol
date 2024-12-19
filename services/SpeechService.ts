import * as Speech from "expo-speech";

export class SpeechService {
  private static instance: SpeechService;
  private isSpeaking: boolean = false;

  private constructor() {}

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  /**
   * Speaks the given text using the device's text-to-speech engine
   * @param text - The text to be spoken
   * @param options - Speech options including rate, pitch, and language
   * @returns Promise that resolves when speech is completed
   */
  public async speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      language?: string;
    } = {}
  ): Promise<void> {
    try {
      // If already speaking, stop current speech
      if (this.isSpeaking) {
        await this.stop();
      }

      this.isSpeaking = true;

      // Default options for clear child-friendly speech
      const defaultOptions = {
        rate: 0.8, // Slightly slower than normal
        pitch: 1.0,
        language: "en-US",
        ...options,
      };

      await Speech.speak(text, {
        ...defaultOptions,
        onDone: () => {
          this.isSpeaking = false;
        },
        onError: (error) => {
          this.isSpeaking = false;
          console.error("Speech error:", error);
        },
      });
    } catch (error) {
      this.isSpeaking = false;
      console.error("Error in speech service:", error);
      throw error;
    }
  }

  /**
   * Stops any ongoing speech
   */
  public async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error("Error stopping speech:", error);
      throw error;
    }
  }

  /**
   * Checks if text-to-speech is available on the device
   * @returns Promise<boolean> indicating if speech is available
   */
  public async isSpeechAvailable(): Promise<boolean> {
    try {
      return (await Speech.getAvailableVoicesAsync()).length > 0;
    } catch (error) {
      console.error("Error checking speech availability:", error);
      return false;
    }
  }

  /**
   * Gets the speaking status
   * @returns boolean indicating if speech is currently active
   */
  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
}
