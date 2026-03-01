import Image from 'next/image'

const HeroImage = () => {
  return (
    <div className="relative w-full mx-auto mt-16">
      {/* Image wrapper */}
      <div
        className="relative z-[1] w-full rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <Image
          src="/Img1.png"
          alt="XCortz password manager preview"
          width={1200}
          height={750}
          className="w-full h-auto"
          priority
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #000000 100%)",
          }}
        />

        {/* Side fades */}
        <div
          className="absolute inset-y-0 left-0 w-12 pointer-events-none"
          style={{ background: "linear-gradient(to right, #000000, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-12 pointer-events-none"
          style={{ background: "linear-gradient(to left, #000000, transparent)" }}
        />
      </div>
    </div>
  )
}

export default HeroImage