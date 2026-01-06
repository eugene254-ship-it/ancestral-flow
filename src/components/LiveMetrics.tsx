import { motion } from "framer-motion";
import MetricCard from "./MetricCard";
import { Shield, Heart, TreePine, Users } from "lucide-react";

const metrics = [
  {
    icon: <Shield className="w-5 h-5 text-primary" />,
    value: "94.7%",
    label: "Driver Safety Score",
    trend: "+2.3%",
    trendUp: true,
  },
  {
    icon: <Heart className="w-5 h-5 text-primary" />,
    value: "0.12",
    label: "Crash Risk Index",
    trend: "-15%",
    trendUp: true,
  },
  {
    icon: <TreePine className="w-5 h-5 text-primary" />,
    value: "847",
    label: "Wildlife Crossings Detected",
    trend: "+127",
    trendUp: true,
  },
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    value: "12.4K",
    label: "Community Votes Cast",
    trend: "+1.2K",
    trendUp: true,
  },
];

const LiveMetrics = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest mb-4 block">
            IMPACT ENGINE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real-Time <span className="text-gradient-earth">Intelligence</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transparent, publicly owned data audited by local citizen data boards.
          </p>
        </motion.div>
        
        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
        
        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Live data from pilot regions
        </motion.div>
      </div>
    </section>
  );
};

export default LiveMetrics;
