export interface ImageModel {
  id: string;
  name: string;
  description: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
}

export interface ImageSize {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface QualitySetting {
  id: string;
  name: string;
  description: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  model: string;
  style: string;
  size: string;
  quality: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    style: string;
    dimensions: string;
    generationTime: number;
  };
}

export interface GenerationState {
  isGenerating: boolean;
  generatedImage: string | null;
  error: string | null;
  metadata: ImageGenerationResponse['metadata'] | null;
}