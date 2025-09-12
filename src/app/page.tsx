import { ImageGenerator } from "@/components/ImageGenerator";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ImageGenerator />
      </div>
    </main>
  );
}