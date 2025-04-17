import { HeroSection } from "../../components/HeroSection";
import { StatsSection } from "../../components/StatsSection";
import { PredictionFeatures } from "../../components/PredictionFeatures";
import { HowItWorks } from "../../components/HowItWorks";
import { CTASection } from "../../components/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PredictionFeatures />
      <HowItWorks />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default Home;
