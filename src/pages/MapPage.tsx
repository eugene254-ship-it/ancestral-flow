import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Wifi, TreePine, Car } from "lucide-react";

interface Region {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
  description: string | null;
}

const MapPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      const { data, error } = await supabase
        .from("regions")
        .select("*")
        .order("status", { ascending: false });

      if (data && !error) {
        setRegions(data);
      }
      setLoading(false);
    };

    fetchRegions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary";
      case "planned":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest mb-4 block">
            PILOT REGIONS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interactive <span className="text-gradient-earth">Map</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore ATLAS pilot regions across Africa. Active hubs, wildlife corridors, and smart road infrastructure.
          </p>
        </motion.div>

        {/* Map Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Africa Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative"
          >
            <div className="aspect-[4/3] rounded-2xl gradient-card border border-border/50 overflow-hidden relative">
              {/* Africa Outline SVG */}
              <svg
                viewBox="0 0 500 550"
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 0 20px rgba(198, 93, 59, 0.2))" }}
              >
                {/* Simplified Africa outline */}
                <path
                  d="M250 50 C280 60, 350 80, 380 120 C410 160, 430 200, 440 250 C450 300, 460 350, 450 400 C440 450, 400 480, 350 490 C300 500, 280 510, 260 520 C240 510, 200 500, 150 490 C100 480, 60 450, 50 400 C40 350, 50 300, 60 250 C70 200, 90 160, 120 120 C150 80, 220 60, 250 50 Z"
                  fill="none"
                  stroke="hsl(18 65% 50% / 0.3)"
                  strokeWidth="2"
                />
                
                {/* Grid pattern */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(18 65% 50% / 0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Region markers */}
                {regions.map((region, index) => {
                  // Map lat/long to SVG coordinates (simplified)
                  const x = ((region.longitude + 20) / 60) * 400 + 50;
                  const y = ((region.latitude * -1) + 35) / 70 * 450 + 50;
                  
                  return (
                    <g key={region.id}>
                      {/* Pulse ring */}
                      {region.status === "active" && (
                        <circle
                          cx={x}
                          cy={y}
                          r="25"
                          fill="none"
                          stroke="hsl(18 65% 50%)"
                          strokeWidth="1"
                          opacity="0.5"
                          className="animate-pulse-ring"
                        />
                      )}
                      {/* Marker */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={region.status === "active" ? "hsl(18 65% 50%)" : "hsl(38 85% 55%)"}
                        stroke="hsl(30 15% 8%)"
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                        onClick={() => setSelectedRegion(region)}
                      />
                      {/* Label */}
                      <text
                        x={x}
                        y={y + 28}
                        textAnchor="middle"
                        fill="hsl(40 30% 92%)"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {region.name}
                      </text>
                    </g>
                  );
                })}
                
                {/* Connection lines */}
                <path
                  d="M 270 180 Q 320 220 340 270 Q 330 320 280 350"
                  fill="none"
                  stroke="hsl(18 65% 50% / 0.4)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Planned</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Region Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Selected Region Info */}
            {selectedRegion ? (
              <div className="p-6 rounded-2xl gradient-card border border-primary/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedRegion.status)}`} />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {selectedRegion.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {selectedRegion.name}
                </h3>
                <p className="text-muted-foreground mb-4">{selectedRegion.country}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRegion.description || "Smart mobility hub with integrated ATLAS systems."}
                </p>
                
                <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="w-4 h-4 text-primary" />
                    <span>B-DOS Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wifi className="w-4 h-4 text-forest-light" />
                    <span>AG-RIL Online</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl gradient-card border border-border/50 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Click on a region marker to view details
                </p>
              </div>
            )}

            {/* Region List */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                All Regions
              </h4>
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedRegion?.id === region.id
                      ? "gradient-card border border-primary/50"
                      : "bg-muted/30 border border-border/30 hover:border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{region.name}</p>
                      <p className="text-sm text-muted-foreground">{region.country}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(region.status)}`} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
