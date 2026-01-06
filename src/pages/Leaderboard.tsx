import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Shield, Heart, Leaf, Medal, Star } from "lucide-react";

interface DriverScore {
  id: string;
  user_id: string;
  safety_score: number;
  empathy_score: number;
  harmony_score: number;
  total_trips: number;
  rank: number | null;
  achievements: string[];
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    region: string | null;
  } | null;
}

// Demo data for illustration when no real drivers exist
const demoDrivers = [
  { name: "Kwame Asante", region: "Accra", safety: 96.5, empathy: 94.2, harmony: 92.8, trips: 1247, achievements: ["safety_master", "community_leader"] },
  { name: "Fatima Wanjiku", region: "Nairobi", safety: 95.2, empathy: 97.1, harmony: 91.5, trips: 1089, achievements: ["empathy_champion"] },
  { name: "David Okello", region: "Kampala", safety: 94.8, empathy: 93.6, harmony: 95.4, trips: 956, achievements: ["harmony_seeker"] },
  { name: "Amara Diallo", region: "Accra", safety: 93.2, empathy: 91.8, harmony: 94.1, trips: 887, achievements: ["rising_star"] },
  { name: "Moses Kiptoo", region: "Nairobi", safety: 92.7, empathy: 90.5, harmony: 93.8, trips: 765, achievements: [] },
  { name: "Grace Mutesi", region: "Kigali", safety: 91.5, empathy: 92.3, harmony: 90.1, trips: 654, achievements: [] },
  { name: "Emmanuel Okafor", region: "Accra", safety: 90.8, empathy: 89.7, harmony: 91.2, trips: 543, achievements: [] },
  { name: "Sarah Mbeki", region: "Cape Town", safety: 89.3, empathy: 91.0, harmony: 88.5, trips: 432, achievements: [] },
];

const achievementIcons: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  safety_master: { icon: <Shield className="w-4 h-4" />, label: "Safety Master", color: "text-primary" },
  empathy_champion: { icon: <Heart className="w-4 h-4" />, label: "Empathy Champion", color: "text-forest-light" },
  harmony_seeker: { icon: <Leaf className="w-4 h-4" />, label: "Harmony Seeker", color: "text-accent" },
  community_leader: { icon: <Star className="w-4 h-4" />, label: "Community Leader", color: "text-gold" },
  rising_star: { icon: <Medal className="w-4 h-4" />, label: "Rising Star", color: "text-sand" },
};

const Leaderboard = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<"overall" | "safety" | "empathy" | "harmony">("overall");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from("driver_scores")
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url,
              region
            )
          `)
          .order("safety_score", { ascending: false })
          .limit(20);

        if (data && data.length > 0) {
          setDrivers(data);
        } else {
          // Use demo data if no real drivers
          setDrivers(demoDrivers.map((d, i) => ({
            id: `demo-${i}`,
            user_id: `demo-user-${i}`,
            safety_score: d.safety,
            empathy_score: d.empathy,
            harmony_score: d.harmony,
            total_trips: d.trips,
            rank: i + 1,
            achievements: d.achievements,
            profiles: { full_name: d.name, avatar_url: null, region: d.region },
          })));
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Fall back to demo data
        setDrivers(demoDrivers.map((d, i) => ({
          id: `demo-${i}`,
          user_id: `demo-user-${i}`,
          safety_score: d.safety,
          empathy_score: d.empathy,
          harmony_score: d.harmony,
          total_trips: d.trips,
          rank: i + 1,
          achievements: d.achievements,
          profiles: { full_name: d.name, avatar_url: null, region: d.region },
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const getOverallScore = (driver: any) => {
    return ((driver.safety_score + driver.empathy_score + driver.harmony_score) / 3).toFixed(1);
  };

  const getSortedDrivers = () => {
    const sorted = [...drivers].sort((a, b) => {
      switch (selectedMetric) {
        case "safety":
          return b.safety_score - a.safety_score;
        case "empathy":
          return b.empathy_score - a.empathy_score;
        case "harmony":
          return b.harmony_score - a.harmony_score;
        default:
          return parseFloat(getOverallScore(b)) - parseFloat(getOverallScore(a));
      }
    });
    return sorted;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-gold to-accent";
      case 2:
        return "from-sand to-sand-dark";
      case 3:
        return "from-primary to-terracotta-dark";
      default:
        return "from-muted to-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading leaderboard...</div>
      </div>
    );
  }

  const sortedDrivers = getSortedDrivers();

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest mb-4 block">
            B-DOS RANKINGS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Driver <span className="text-gradient-earth">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Celebrating drivers who embody the spirit of safe, just, and harmonious mobility.
          </p>
        </motion.div>

        {/* Metric Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { key: "overall", label: "Overall", icon: <Trophy className="w-4 h-4" /> },
            { key: "safety", label: "Safety", icon: <Shield className="w-4 h-4" /> },
            { key: "empathy", label: "Empathy", icon: <Heart className="w-4 h-4" /> },
            { key: "harmony", label: "Harmony", icon: <Leaf className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedMetric(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedMetric === tab.key
                  ? "gradient-earth text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {[sortedDrivers[1], sortedDrivers[0], sortedDrivers[2]].map((driver, i) => {
            if (!driver) return null;
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const isFirst = actualRank === 1;
            
            return (
              <div
                key={driver.id}
                className={`relative ${isFirst ? "pt-0" : "pt-8"}`}
              >
                <div
                  className={`p-6 rounded-2xl gradient-card border ${
                    isFirst ? "border-gold/50" : "border-border/50"
                  } text-center`}
                >
                  {/* Rank Badge */}
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(actualRank)} flex items-center justify-center text-primary-foreground font-bold shadow-soft`}
                  >
                    {actualRank}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRankColor(actualRank)} flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4 ${isFirst ? "mt-4" : ""}`}
                  >
                    {driver.profiles?.full_name?.charAt(0) || "D"}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-foreground mb-1">
                    {driver.profiles?.full_name || "Driver"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {driver.profiles?.region || "Unknown"}
                  </p>

                  {/* Score */}
                  <div className="text-2xl font-bold text-gradient-earth">
                    {selectedMetric === "overall"
                      ? getOverallScore(driver)
                      : driver[`${selectedMetric}_score`]?.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {driver.total_trips} trips
                  </p>

                  {/* Achievements */}
                  {driver.achievements && driver.achievements.length > 0 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {driver.achievements.slice(0, 2).map((a: string) => {
                        const achievement = achievementIcons[a];
                        if (!achievement) return null;
                        return (
                          <div
                            key={a}
                            className={`p-1.5 rounded-full bg-muted ${achievement.color}`}
                            title={achievement.label}
                          >
                            {achievement.icon}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Rest of Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl gradient-card border border-border/50 overflow-hidden"
        >
          <div className="p-4 border-b border-border/50 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Driver</div>
            <div className="col-span-2 text-center">Safety</div>
            <div className="col-span-2 text-center">Empathy</div>
            <div className="col-span-2 text-center">Harmony</div>
            <div className="col-span-1 text-center">Trips</div>
          </div>

          {sortedDrivers.slice(3).map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.03 }}
              className="p-4 border-b border-border/30 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-muted/10 transition-colors"
            >
              <div className="col-span-1 text-muted-foreground font-medium">
                {index + 4}
              </div>
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                  {driver.profiles?.full_name?.charAt(0) || "D"}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {driver.profiles?.full_name || "Driver"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {driver.profiles?.region || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-center text-foreground">
                {driver.safety_score?.toFixed(1)}
              </div>
              <div className="col-span-2 text-center text-foreground">
                {driver.empathy_score?.toFixed(1)}
              </div>
              <div className="col-span-2 text-center text-foreground">
                {driver.harmony_score?.toFixed(1)}
              </div>
              <div className="col-span-1 text-center text-muted-foreground">
                {driver.total_trips}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
