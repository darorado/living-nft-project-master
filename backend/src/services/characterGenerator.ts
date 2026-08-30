import axios from 'axios';
import { env } from 'process';

interface Character {
  name: string;
  description: string;
  traits: string[];
  appearance: string;
  backstory: string;
  powers: string[];
}

export class CharacterGenerator {
  private readonly ollamaUrl: string;
  private readonly ollamaModel: string;

  constructor() {
    this.ollamaUrl = env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    this.ollamaModel = env.OLLAMA_MODEL || 'llama3';
  }

  async generateCharacter(prompt: string): Promise<Character> {
    const response = await axios.post(this.ollamaUrl, {
      model: this.ollamaModel,
      prompt: `Generate a detailed NFT character profile based on this description: ${prompt}. 
      Format as JSON with these fields: name, description, traits (array of strings), appearance (string), backstory (string), powers (array of strings). 
      Do not include any other text or formatting. Just raw JSON.`,
      stream: false
    });

    const content = response.data.response;
    
    // Extract JSON from response (Llama may add extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Llama response');
    }

    const characterData = JSON.parse(jsonMatch[0]);
    
    return {
      name: characterData.name || 'Unknown Character',
      description: characterData.description || 'A mysterious NFT character.',
      traits: characterData.traits || ['mysterious', 'unique'],
      appearance: characterData.appearance || 'A glowing figure with unknown origins.',
      backstory: characterData.backstory || 'Born from the digital void.',
      powers: characterData.powers || ['immortality', 'self-evolution']
    };
  }
}

export const characterGenerator = new CharacterGenerator();