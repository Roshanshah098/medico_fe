import { Button, Container, Title, Text, Group } from "@mantine/core";

import { Link } from "react-router-dom";
import { Icons } from "../assets/icons";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[600px] bg-gradient-to-r from-blue-600/90 to-blue-800/90 flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-black/50 absolute top-0 left-0"></div>

        <img
          src="back.jpg"
          alt="Medical Background"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Title className="text-white text-4xl md:text-5xl font-bold mb-4">
            AI-Powered Disease Prediction
            <br />
            and Consultation
          </Title>

          <Text className="text-gray-200 mb-4 text-lg">
            Get instant disease predictions using advanced machine learning
            algorithms. Early detection leads to better treatment outcomes.
          </Text>

          <div className="p-6 rounded-lg shadow-lg ">
            <Group className="gap-6 justify-center">
              <Link to="/dashboard">
                <Button
                  size="xl"
                  variant="outline"
                  className="border- border-white text-white hover:bg-white/10 px-8"
                  rightSection={<Icons.Stethescope size={20} />}
                >
                  Get Started
                </Button>
              </Link>
            </Group>

            {/* <Group className="mt-6 gap-3 justify-center">
              {[
                "98% Accuracy Rate",
                "Instant Results",
                "Expert Verified",
                "100+ Diseases",
              ].map((tag) => (
                <Badge
                  key={tag}
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  className="cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </Group> */}
          </div>
        </div>
      </Container>
    </div>
  );
};
