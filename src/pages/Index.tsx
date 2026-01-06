import HeroSection from "@/components/HeroSection";
import TechnologyPillars from "@/components/TechnologyPillars";
import LiveMetrics from "@/components/LiveMetrics";
import RoadmapSection from "@/components/RoadmapSection";
import ComparisonTable from "@/components/ComparisonTable";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroSection />
      <TechnologyPillars />
      <LiveMetrics />
      <ComparisonTable />
      <RoadmapSection />
      <Footer />
    </div>
  );
};

export default Index;
