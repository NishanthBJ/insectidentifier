
export interface InsectData {
  name: string;
  scientificName: string;
  description: string;
  status: string;
  imageUrl: string;
}

export interface GeminiTextResponse {
  isInsect: boolean;
  name?: string;
  scientificName?: string;
  description?: string;
  status?: string;
  imagePrompt?: string;
  reason?: string;
}
