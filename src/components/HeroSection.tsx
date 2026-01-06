import { motion } from "framer-motion";
import PlanetaryGrid from "./PlanetaryGrid";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <PlanetaryGrid />
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider">
            AUTONOMOUS TRAFFIC & LIFE-AWARE SYSTEM
          </span>
        </motion.div>
        
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-9xl font-bold tracking-tighter mb-6"
        >
          <span className="text-gradient-earth">ATLAS</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          A planetary-inspired African mobility intelligence platform for a{" "}
          <span className="text-primary">safe</span>,{" "}
          <span className="text-accent">just</span>, and{" "}
          <span className="text-secondary-foreground">nature-synchronized</span>{" "}
          transportation future.
        </motion.p>
        
        {/* Ancestral Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg text-muted-foreground/70 italic border-l-2 border-primary/40 pl-4 max-w-xl mx-auto mb-12"
        >
          "He who walks with the ancestors knows how to travel without causing harm."
        </motion.blockquote>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 rounded-lg gradient-earth text-primary-foreground font-semibold text-lg hover:shadow-glow transition-all duration-300 hover:scale-105">
            Explore the Vision
          </button>
          <button className="px-8 py-4 rounded-lg border border-primary/30 bg-primary/5 text-foreground font-semibold text-lg hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
            View Roadmap
          </button>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-3 rounded-full bg-primary/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
