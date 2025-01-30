const Hero = () => {
  return (
    <section className="section-padding min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
        <div className="space-y-2">
          <h4 className="text-sm font-medium tracking-wider text-black/60 uppercase">
            Next Generation
          </h4>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            Railway Safety System
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-black/60 max-w-2xl mx-auto">
          Advanced fall detection and emergency response system designed to enhance
          passenger safety in railway environments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-black text-white hover:bg-black/90 transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 rounded-full border border-black/10 hover:bg-black/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;