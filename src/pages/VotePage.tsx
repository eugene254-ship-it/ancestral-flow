import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, ThumbsDown, Plus, Clock, Users } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes_for: number;
  votes_against: number;
  created_at: string;
  closes_at: string | null;
  author_id: string;
}

interface UserVote {
  proposal_id: string;
  vote_type: string;
}

const VotePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: "", description: "", category: "traffic" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch proposals
        const { data: proposalsData } = await supabase
          .from("proposals")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (proposalsData) {
          setProposals(proposalsData);
        }

        // Fetch user's votes
        const { data: votesData } = await supabase
          .from("votes")
          .select("proposal_id, vote_type")
          .eq("user_id", user.id);

        if (votesData) {
          const votesMap: Record<string, string> = {};
          votesData.forEach((v: UserVote) => {
            votesMap[v.proposal_id] = v.vote_type;
          });
          setUserVotes(votesMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleVote = async (proposalId: string, voteType: "for" | "against") => {
    if (!user) return;

    const existingVote = userVotes[proposalId];

    try {
      if (existingVote === voteType) {
        // Remove vote
        await supabase
          .from("votes")
          .delete()
          .eq("proposal_id", proposalId)
          .eq("user_id", user.id);

        setUserVotes((prev) => {
          const updated = { ...prev };
          delete updated[proposalId];
          return updated;
        });

        // Update local count
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  votes_for: voteType === "for" ? p.votes_for - 1 : p.votes_for,
                  votes_against: voteType === "against" ? p.votes_against - 1 : p.votes_against,
                }
              : p
          )
        );

        toast({ title: "Vote removed" });
      } else if (existingVote) {
        // Change vote
        await supabase
          .from("votes")
          .update({ vote_type: voteType })
          .eq("proposal_id", proposalId)
          .eq("user_id", user.id);

        setUserVotes((prev) => ({ ...prev, [proposalId]: voteType }));

        // Update local counts
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  votes_for: voteType === "for" ? p.votes_for + 1 : p.votes_for - 1,
                  votes_against: voteType === "against" ? p.votes_against + 1 : p.votes_against - 1,
                }
              : p
          )
        );

        toast({ title: "Vote changed" });
      } else {
        // New vote
        await supabase.from("votes").insert({
          proposal_id: proposalId,
          user_id: user.id,
          vote_type: voteType,
        });

        setUserVotes((prev) => ({ ...prev, [proposalId]: voteType }));

        // Update local count
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  votes_for: voteType === "for" ? p.votes_for + 1 : p.votes_for,
                  votes_against: voteType === "against" ? p.votes_against + 1 : p.votes_against,
                }
              : p
          )
        );

        toast({ title: "Vote recorded!" });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({ title: "Error voting", variant: "destructive" });
    }
  };

  const handleCreateProposal = async () => {
    if (!user || !newProposal.title || !newProposal.description) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("proposals")
        .insert({
          title: newProposal.title,
          description: newProposal.description,
          category: newProposal.category,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProposals((prev) => [data, ...prev]);
        setShowCreateModal(false);
        setNewProposal({ title: "", description: "", category: "traffic" });
        toast({ title: "Proposal created successfully!" });
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({ title: "Error creating proposal", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest mb-4 block">
            PAN-AI GOVERNANCE
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Community <span className="text-gradient-earth">Voting</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shape the future of African mobility. Vote on traffic rule proposals and community initiatives.
          </p>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end mb-8"
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg gradient-earth text-primary-foreground font-medium hover:shadow-glow transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Proposal
          </button>
        </motion.div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active proposals yet. Be the first to create one!</p>
            </div>
          ) : (
            proposals.map((proposal, index) => {
              const totalVotes = proposal.votes_for + proposal.votes_against;
              const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 50;
              const userVote = userVotes[proposal.id];

              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="p-6 rounded-2xl gradient-card border border-border/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-primary mb-2 block">
                        {proposal.category}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">{proposal.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{proposal.description}</p>

                  {/* Vote Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-forest-light">{proposal.votes_for} For</span>
                      <span className="text-destructive">{proposal.votes_against} Against</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-forest to-forest-light transition-all duration-300"
                        style={{ width: `${forPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVote(proposal.id, "for")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                        userVote === "for"
                          ? "bg-forest/20 border-forest text-forest-light"
                          : "border-border/50 text-muted-foreground hover:border-forest hover:text-forest-light"
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Support
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, "against")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                        userVote === "against"
                          ? "bg-destructive/20 border-destructive text-destructive"
                          : "border-border/50 text-muted-foreground hover:border-destructive hover:text-destructive"
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      Oppose
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg p-8 rounded-2xl gradient-card border border-border/50 shadow-card"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Create Proposal</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    placeholder="Enter proposal title"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={newProposal.category}
                    onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="traffic">Traffic Rules</option>
                    <option value="speed">Speed Limits</option>
                    <option value="wildlife">Wildlife Protection</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    placeholder="Describe your proposal"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProposal}
                  disabled={submitting || !newProposal.title || !newProposal.description}
                  className="flex-1 py-3 rounded-lg gradient-earth text-primary-foreground font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
