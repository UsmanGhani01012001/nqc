const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(43 72% 52% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(43 72% 52% / 0.2) 0%, transparent 50%)'
      }} />
      
      <div className="relative container mx-auto px-4 text-center">
        <p className="text-primary tracking-[0.4em] uppercase text-xs mb-4 font-medium">
          Premium Collection
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-gradient-gold">
          Discover Luxury
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Curated collection of premium products — from elegant home décor to beauty essentials. 
          Cash on Delivery available across Pakistan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#products"
            className="inline-flex items-center justify-center bg-gradient-gold text-accent-foreground px-8 py-3.5 rounded-lg font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Shop Now
          </a>
          <a
            href="https://wa.me/923453282241"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gold text-primary px-8 py-3.5 rounded-lg font-semibold text-sm tracking-wide hover:bg-primary/10 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
