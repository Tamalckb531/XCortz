import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
  <div className="min-h-screen w-full relative bg-black">
    <div
      className="absolute inset-0 z-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16, 185, 129, 0.25), transparent 70%), #000000",
      }}
    />
  
    <div className="relative z-10 p-5">
      <HeroSection />
    </div>
  </div>
  );
}
