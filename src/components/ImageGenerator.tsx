"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "./LoadingSpinner";
import { GeneratedImage } from "./GeneratedImage";
import { 
  ImageModel, 
  StylePreset, 
  ImageSize, 
  QualitySetting,
  ImageGenerationRequest,
  ImageGenerationResponse,
  GenerationState
} from "@/lib/types";

// Configuration data for select components
const AI_MODELS: ImageModel[] = [
  {
    id: "replicate/black-forest-labs/flux-1.1-pro",
    name: "FLUX 1.1 Pro",
    description: "High-quality, fast generation with excellent detail"
  },
  {
    id: "replicate/black-forest-labs/flux-schnell", 
    name: "FLUX Schnell",
    description: "Ultra-fast generation with good quality"
  },
  {
    id: "image-gen",
    name: "Standard Generator",
    description: "Reliable general-purpose image generation"
  }
];

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Highly detailed, camera-like images"
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative and expressive style"
  },
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Animated, colorful cartoon style"
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Classic oil painting aesthetic"
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft, flowing watercolor effect"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple design approach"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic neon-lit aesthetic"
  }
];

const IMAGE_SIZES: ImageSize[] = [
  {
    id: "square-512",
    name: "Square (512×512)",
    width: 512,
    height: 512,
    aspectRatio: "1:1"
  },
  {
    id: "square-1024",
    name: "Square HD (1024×1024)", 
    width: 1024,
    height: 1024,
    aspectRatio: "1:1"
  },
  {
    id: "portrait",
    name: "Portrait (768×1024)",
    width: 768,
    height: 1024,
    aspectRatio: "3:4"
  },
  {
    id: "landscape",
    name: "Landscape (1024×768)",
    width: 1024,
    height: 768,
    aspectRatio: "4:3"
  },
  {
    id: "widescreen",
    name: "Widescreen (1920×1080)",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9"
  }
];

const QUALITY_SETTINGS: QualitySetting[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Good quality, faster generation"
  },
  {
    id: "high",
    name: "High Quality",
    description: "Enhanced detail and clarity"
  },
  {
    id: "ultra",
    name: "Ultra HD",
    description: "Maximum quality and detail"
  }
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].id);
  const [selectedSize, setSelectedSize] = useState(IMAGE_SIZES[1].id);
  const [selectedQuality, setSelectedQuality] = useState(QUALITY_SETTINGS[1].id);
  
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    generatedImage: null,
    error: null,
    metadata: null
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setGenerationState(prev => ({
        ...prev,
        error: "Please enter a prompt to generate an image"
      }));
      return;
    }

    setGenerationState({
      isGenerating: true,
      generatedImage: null,
      error: null,
      metadata: null
    });

    try {
      const request: ImageGenerationRequest = {
        prompt: prompt.trim(),
        model: selectedModel,
        style: selectedStyle,
        size: selectedSize,
        quality: selectedQuality
      };

      const startTime = Date.now();
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: ImageGenerationResponse = await response.json();
      const generationTime = Math.round((Date.now() - startTime) / 1000);

      if (result.success && result.imageUrl) {
        setGenerationState({
          isGenerating: false,
          generatedImage: result.imageUrl,
          error: null,
          metadata: {
            ...result.metadata!,
            generationTime
          }
        });
      } else {
        setGenerationState({
          isGenerating: false,
          generatedImage: null,
          error: result.error || "Failed to generate image",
          metadata: null
        });
      }
    } catch (error) {
      setGenerationState({
        isGenerating: false,
        generatedImage: null,
        error: "Network error: Please check your connection and try again",
        metadata: null
      });
    }
  };

  const handleNewGeneration = () => {
    setGenerationState({
      isGenerating: false,
      generatedImage: null,
      error: null,
      metadata: null
    });
  };

  const isFormValid = prompt.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          AI Image Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Create stunning images using advanced AI models with intuitive controls
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Your Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Image Description *
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... (e.g., 'A serene mountain landscape at sunset with golden light')"
              className="w-full h-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={generationState.isGenerating}
            />
          </div>

          {/* Select Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Model Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                AI Model
              </label>
              <Select 
                value={selectedModel} 
                onValueChange={setSelectedModel}
                disabled={generationState.isGenerating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-slate-500">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Style Preset
              </label>
              <Select 
                value={selectedStyle} 
                onValueChange={setSelectedStyle}
                disabled={generationState.isGenerating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_PRESETS.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{style.name}</span>
                        <span className="text-xs text-slate-500">{style.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Image Size
              </label>
              <Select 
                value={selectedSize} 
                onValueChange={setSelectedSize}
                disabled={generationState.isGenerating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_SIZES.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{size.name}</span>
                        <span className="text-xs text-slate-500">
                          {size.width}×{size.height} ({size.aspectRatio})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Quality Setting
              </label>
              <Select 
                value={selectedQuality} 
                onValueChange={setSelectedQuality}
                disabled={generationState.isGenerating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {QUALITY_SETTINGS.map((quality) => (
                    <SelectItem key={quality.id} value={quality.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{quality.name}</span>
                        <span className="text-xs text-slate-500">{quality.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGenerate}
              disabled={!isFormValid || generationState.isGenerating}
              size="lg"
              className="w-full md:w-auto min-w-[200px]"
            >
              {generationState.isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          </div>

          {/* Error Message */}
          {generationState.error && !generationState.isGenerating && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                {generationState.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {generationState.isGenerating && (
        <div className="flex justify-center">
          <LoadingSpinner size="lg" text="Creating your masterpiece..." />
        </div>
      )}

      {/* Generated Image Display */}
      {generationState.generatedImage && generationState.metadata && (
        <div className="flex justify-center">
          <GeneratedImage 
            result={{
              success: true,
              imageUrl: generationState.generatedImage,
              metadata: generationState.metadata
            }}
            onNewGeneration={handleNewGeneration}
          />
        </div>
      )}
    </div>
  );
}