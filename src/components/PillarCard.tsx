import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PillarCardProps {
  icon: ReactNode;
  title: string;
  acronym: string;
  description: string;
  features: string[];
  index: number;
}

const PillarCard = ({ icon, title, acronym, description, features, index }: PillarCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative"
    >
      <div className="relative h-full p-8 rounded-2xl gradient-card border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-card hover:shadow-glow">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl gradient-earth flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          {/* Acronym */}
          <span className="text-xs font-bold tracking-widest text-primary/70 mb-2 block">
            {acronym}
          </span>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Features */}
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-2xl">
          <div className="absolute top-0 right-0 w-16 h-16 gradient-earth opacity-10 transform rotate-45 translate-x-8 -translate-y-8" />
        </div>
      </div>
    </motion.div>
  );
};

export default PillarCard;
