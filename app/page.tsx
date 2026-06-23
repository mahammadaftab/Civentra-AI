import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrustSection from "./components/TrustSection";
import HowItWorksSection from "./components/HowItWorksSection";
import AgentsSection from "./components/AgentsSection";
import CommandCenterSection from "./components/CommandCenterSection";
import FeaturesSection from "./components/FeaturesSection";
import PanelsSection from "./components/PanelsSection";
import PredictiveIntelligenceSection from "./components/PredictiveIntelligenceSection";
import ArchitectureSection from "./components/ArchitectureSection";
import IntegrationSection from "./components/IntegrationSection";
import FooterSection from "./components/FooterSection";

export default function Home() {
  return (
    <main className="bg-brand-black min-h-screen text-foreground selection:bg-brand-blue/30 selection:text-white">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <AgentsSection />
      <CommandCenterSection />
      <FeaturesSection />
      <PanelsSection />
      <PredictiveIntelligenceSection />
      <ArchitectureSection />
      <IntegrationSection />
      <FooterSection />
    </main>
  );
}
