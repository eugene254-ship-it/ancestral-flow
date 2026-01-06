import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Heart, TreePine, Users, Vote, Trophy, Map } from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  full_name: string | null;
  region: string | null;
}

interface Stats {
  proposalsCount: number;
  votesCount: number;
  regionsCount: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ proposalsCount: 0, votesCount: 0, regionsCount: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, region")
          .eq("user_id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch stats
        const [proposalsRes, votesRes, regionsRes] = await Promise.all([
          supabase.from("proposals").select("id", { count: "exact" }),
          supabase.from("votes").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("regions").select("id", { count: "exact" }).eq("status", "active"),
        ]);

        setStats({
          proposalsCount: proposalsRes.count || 0,
          votesCount: votesRes.count || 0,
          regionsCount: regionsRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Community Voting",
      description: "Vote on traffic rule proposals",
      icon: <Vote className="w-6 h-6" />,
      path: "/vote",
      color: "from-primary to-accent",
    },
    {
      title: "Pilot Map",
      description: "Explore active regions",
      icon: <Map className="w-6 h-6" />,
      path: "/map",
      color: "from-forest to-forest-light",
    },
    {
      title: "Leaderboard",
      description: "View driver rankings",
      icon: <Trophy className="w-6 h-6" />,
      path: "/leaderboard",
      color: "from-accent to-gold",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back,{" "}
            <span className="text-gradient-earth">
              {profile?.full_name || user?.email?.split("@")[0] || "Traveler"}
            </span>
          </h1>
          <p className="text-muted-foreground">
            Your mobility governance dashboard
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="p-6 rounded-xl gradient-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.regionsCount}</p>
                <p className="text-sm text-muted-foreground">Active Regions</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl gradient-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Vote className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.proposalsCount}</p>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl gradient-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-forest/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-forest-light" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.votesCount}</p>
                <p className="text-sm text-muted-foreground">Your Votes</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl gradient-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12.4K</p>
                <p className="text-sm text-muted-foreground">Community Members</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.path}
                to={action.path}
                className="group p-6 rounded-xl gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary-foreground`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Platform Highlights</h2>
          <div className="p-6 rounded-xl gradient-card border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-primary mt-2 animate-pulse" />
              <div>
                <p className="text-foreground font-medium">
                  Year 1 pilots are live in Kampala, Nairobi, and Accra
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Join the community governance initiatives and help shape the future of African mobility.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
