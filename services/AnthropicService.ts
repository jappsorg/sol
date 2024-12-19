import { Anthropic } from "@anthropic-ai/sdk";
import {
  Word,
  Grade,
  AnthropicResponse,
  WORDS_PER_GRADE,
} from "../models/Types";

class AnthropicService {
  private static instance: AnthropicService;
  private anthropic: Anthropic;
  private wordCache: Map<Grade, Word[]>;

  private constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
    });
    this.wordCache = new Map();
  }

  public static getInstance(): AnthropicService {
    if (!AnthropicService.instance) {
      AnthropicService.instance = new AnthropicService();
    }
    return AnthropicService.instance;
  }

  private getGradeLevelDescription(grade: Grade): string {
    const descriptions = {
      1: "simple three to four letter words, basic sight words, and common vocabulary",
      2: "four to five letter words, basic compound words, and common spelling patterns",
      3: "five to seven letter words, compound words, and basic prefixes and suffixes",
      4: "seven to nine letter words, advanced compound words, and common Latin and Greek roots",
      5: "multi-syllable words, advanced vocabulary, and complex spelling patterns",
    };
    return descriptions[grade];
  }

  private async generateWordsPrompt(grade: Grade): Promise<AnthropicResponse> {
    try {
      const description = this.getGradeLevelDescription(grade);
      const count = WORDS_PER_GRADE[grade];

      const message = await this.anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        temperature: 0.7,
        system:
          "You are an educational expert specializing in grade-appropriate spelling words for children.",
        messages: [
          {
            role: "user",
            content: `Generate ${count} age-appropriate spelling words for grade ${grade} students. 
                    Focus on ${description}. 
                    For each word, provide:
                    1. The word itself
                    2. A brief, kid-friendly definition
                    3. A simple example sentence
                    4. Difficulty level (easy/medium/hard)
                    
                    Return the response as a JSON array of objects with properties: 
                    word, definition, sentence, difficulty, grade.
                    Response must be just JSON with no additional text.
                    Ensure all words are appropriate for children in grade ${grade}.`,
          },
        ],
      });

      const content =
        message.content[0].type === "text" ? message.content[0].text : "";

      console.log("Generated words:", content);
      const words: Word[] = JSON.parse(content);

      return { words };
    } catch (error) {
      console.error("Error generating words:", error);
      return {
        words: [],
        error: "Failed to generate words. Please try again later.",
      };
    }
  }

  public async getWordsForGrade(grade: Grade): Promise<Word[]> {
    // Check cache first
    if (this.wordCache.has(grade)) {
      const cachedWords = this.wordCache.get(grade);
      if (cachedWords && cachedWords.length >= WORDS_PER_GRADE[grade]) {
        return cachedWords;
      }
    }

    // Generate new words
    const response = await this.generateWordsPrompt(grade);
    if (response.error || response.words.length === 0) {
      throw new Error(response.error || "Failed to generate words");
    }

    // Cache the words
    this.wordCache.set(grade, response.words);
    return response.words;
  }

  public async getRandomWordForGrade(grade: Grade): Promise<Word> {
    const words = await this.getWordsForGrade(grade);
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  public async refreshWordsForGrade(grade: Grade): Promise<Word[]> {
    // Clear cache for the grade
    this.wordCache.delete(grade);
    // Generate and cache new words
    return await this.getWordsForGrade(grade);
  }

  public clearCache(): void {
    this.wordCache.clear();
  }
}

export default AnthropicService.getInstance();
