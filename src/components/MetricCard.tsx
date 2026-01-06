import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
  index: number;
}

const MetricCard = ({ icon, value, label, trend, trendUp, index }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 rounded-xl gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trendUp 
              ? 'bg-forest/20 text-forest-light' 
              : 'bg-destructive/20 text-destructive'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
      >
        <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-gradient-earth transition-all duration-300">
          {value}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </motion.div>
      
      {/* Subtle pulse animation */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
    </motion.div>
  );
};

export default MetricCard;
