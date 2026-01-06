import { motion } from "framer-motion";
import { MapPin, Globe, BarChart3 } from "lucide-react";

const phases = [
  {
    year: "Year 1",
    title: "Urban Pilots",
    description: "Kampala, Nairobi, Accra: Smart road hubs + B-DOS equipped buses",
    icon: <MapPin className="w-6 h-6" />,
    locations: ["Kampala", "Nairobi", "Accra"],
    status: "Active",
  },
  {
    year: "Year 2",
    title: "Wildlife Corridors",
    description: "Wildlife-AI corridors across SADC and Great Lakes regions",
    icon: <Globe className="w-6 h-6" />,
    locations: ["SADC Region", "Great Lakes"],
    status: "Planned",
  },
  {
    year: "Year 3",
    title: "Continental Dashboard",
    description: "Pan-African mobility justice index shared publicly via AU",
    icon: <BarChart3 className="w-6 h-6" />,
    locations: ["African Union"],
    status: "Vision",
  },
];

const RoadmapSection = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 pattern-grid opacity-20" />
      
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
            LAUNCH VISION
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            3-Year <span className="text-gradient-earth">Journey</span>
          </h2>
        </motion.div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-forest/50 hidden md:block" />
          
          <div className="space-y-12">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative flex gap-8"
              >
                {/* Timeline node */}
                <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-2xl gradient-earth items-center justify-center shadow-glow z-10">
                  {phase.icon}
                </div>
                
                {/* Content card */}
                <div className="flex-1 p-8 rounded-2xl gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-2xl font-bold text-gradient-earth">{phase.year}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      phase.status === 'Active' 
                        ? 'bg-primary/20 text-primary' 
                        : phase.status === 'Planned'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-forest/20 text-forest-light'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-muted-foreground mb-4">{phase.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {phase.locations.map((location) => (
                      <span
                        key={location}
                        className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
