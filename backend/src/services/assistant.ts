import axios from 'axios';
import { env } from 'process';

export class Assistant {
  private readonly ollamaUrl: string;
  private readonly ollamaModel: string;

  constructor() {
    this.ollamaUrl = env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    this.ollamaModel = env.OLLAMA_MODEL || 'llama3';
  }

  async chat(message: string, character: any = null): Promise<string> {
    let context = '';
    if (character) {
      context = `The user is asking about this NFT character: ${character.name}. Description: ${character.description}. Traits: ${character.traits.join(', ')}. Powers: ${character.powers.join(', ')}. Backstory: ${character.backstory}. `;
    }

    const response = await axios.post(this.ollamaUrl, {
      model: this.ollamaModel,
      prompt: `${context}You are an AI assistant for a Living NFT project. Answer the user's question in a friendly, imaginative, and concise way. Question: ${message}`,
      stream: false
    });

    return response.data.response.trim();
  }
}

export const assistant = new Assistant();