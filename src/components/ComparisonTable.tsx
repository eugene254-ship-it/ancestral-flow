import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisons = [
  {
    feature: "Purpose",
    standard: "Reduce traffic jams",
    atlas: "Increase social harmony and ecological safety",
  },
  {
    feature: "Data Source",
    standard: "Vehicles and cameras",
    atlas: "People, nature, history, AI",
  },
  {
    feature: "Safety Method",
    standard: "Speed enforcement",
    atlas: "Driver self-regulation + community alignment",
  },
  {
    feature: "Tech Ethos",
    standard: "Control system",
    atlas: "Living system",
  },
  {
    feature: "Outcome",
    standard: "Fewer deaths",
    atlas: "Better life movement for all beings",
  },
];

const ComparisonTable = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest mb-4 block">
            WHY ATLAS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-gradient-earth">Transformative</span> Difference
          </h2>
        </motion.div>
        
        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl gradient-card border border-border/50 overflow-hidden shadow-card"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-muted/30 p-6 border-b border-border/50">
            <div className="text-sm font-semibold text-muted-foreground">Feature</div>
            <div className="text-sm font-semibold text-muted-foreground text-center">Standard ITS</div>
            <div className="text-sm font-semibold text-primary text-center">ATLAS</div>
          </div>
          
          {/* Rows */}
          {comparisons.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid grid-cols-3 p-6 border-b border-border/30 last:border-b-0 hover:bg-muted/10 transition-colors"
            >
              <div className="font-medium text-foreground">{row.feature}</div>
              <div className="text-muted-foreground text-center flex items-center justify-center gap-2">
                <X className="w-4 h-4 text-destructive/50 flex-shrink-0" />
                <span className="text-sm">{row.standard}</span>
              </div>
              <div className="text-foreground text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-forest-light flex-shrink-0" />
                <span className="text-sm">{row.atlas}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
