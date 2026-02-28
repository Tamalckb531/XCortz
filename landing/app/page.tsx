import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
  <main className="min-h-screen w-full relative bg-black">
    <div
      className="absolute inset-0 z-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16, 185, 129, 0.25), transparent 70%), #000000",
      }}
    />
  
    <div className="relative z-10 container mx-auto py-5 px-6 md:px-12 lg:px-20 xl:px-30">
      <HeroSection />
    </div>
  </main>
  );
}
