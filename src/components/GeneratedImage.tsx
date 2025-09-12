"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGenerationResponse } from "@/lib/types";

interface GeneratedImageProps {
  result: ImageGenerationResponse;
  onDownload?: () => void;
  onNewGeneration?: () => void;
}

export function GeneratedImage({ result, onDownload, onNewGeneration }: GeneratedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    if (!result.imageUrl) return;
    
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onDownload?.();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!result.success || !result.imageUrl) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Generation Failed
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
            {result.error || "Something went wrong while generating your image."}
          </p>
          <Button onClick={onNewGeneration} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Image</span>
          <div className="flex space-x-2">
            <Button onClick={handleDownload} size="sm">
              Download
            </Button>
            <Button onClick={onNewGeneration} variant="outline" size="sm">
              Generate New
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="aspect-square flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
          
          {imageError ? (
            <div className="aspect-square flex flex-col items-center justify-center text-slate-500">
              <span className="text-4xl mb-2">🖼️</span>
              <p>Failed to load image</p>
            </div>
          ) : (
            <img
              src={result.imageUrl}
              alt={result.metadata?.prompt || "Generated image"}
              className={`w-full h-auto transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          )}
        </div>

        {result.metadata && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              Generation Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-medium">Model:</span> {result.metadata.model}
              </div>
              <div>
                <span className="font-medium">Style:</span> {result.metadata.style}
              </div>
              <div>
                <span className="font-medium">Dimensions:</span> {result.metadata.dimensions}
              </div>
              <div>
                <span className="font-medium">Time:</span> {result.metadata.generationTime}s
              </div>
            </div>
            <div className="mt-3">
              <span className="font-medium text-sm text-slate-700 dark:text-slate-300">Prompt:</span>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 bg-white dark:bg-slate-900/50 p-2 rounded border">
                {result.metadata.prompt}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}