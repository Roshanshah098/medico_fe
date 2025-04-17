import { Container, Title, Text, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { Icons } from "../assets/icons";

export const CTASection = () => {
  return (
    <div className="relative py-20 text-white">
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-black/50 absolute top-0 left-0"></div>
        <img
          src="/footer.avif"
          alt="Medical Background"
          className="w-full h-full object-cover "
        />
      </div>

      <Container size="xl" className="text-center relative z-10">
        <Title className="text-4xl md:text-5xl font-bold mb-6">
          Get Your Health Prediction Today
        </Title>

        <Text className="text-xl mb-8 max-w-2xl mx-auto text-gray-100">
          Take the first step towards better health management. Our AI-powered
          system is ready to analyze your symptoms and provide accurate
          predictions.
        </Text>

        <Group justify="center" gap="md">
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-600 "
              rightSection={<Icons.ArrowRight size={20} />}
            >
              Explore Now
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </Group>
      </Container>
    </div>
  );
};
