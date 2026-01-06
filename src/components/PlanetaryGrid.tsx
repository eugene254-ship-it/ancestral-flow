import { motion } from "framer-motion";

const PlanetaryGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow animate-pulse-organic" />
      
      {/* Orbiting rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-forest/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Floating nodes */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 200 + Math.random() * 200;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const delay = i * 0.3;
        const size = 4 + Math.random() * 8;
        
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full bg-primary/60"
            style={{
              width: size,
              height: size,
              x: x - size / 2,
              y: y - size / 2,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(18 65% 50%)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(38 85% 55%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(150 35% 35%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 50% 20% Q 70% 30% 80% 50% Q 70% 70% 50% 80% Q 30% 70% 20% 50% Q 30% 30% 50% 20%"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pattern-grid opacity-30" />
      
      {/* Adinkra pattern subtle overlay */}
      <div className="absolute inset-0 pattern-adinkra opacity-40" />
    </div>
  );
};

export default PlanetaryGrid;
