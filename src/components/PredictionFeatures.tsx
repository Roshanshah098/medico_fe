import { Container, Grid, Card, Text, Title, ThemeIcon } from "@mantine/core";
import { Icons } from "../assets/icons";


const features = [
  {
    icon: Icons.Brain,
    title: "AI-Powered Diagnosis",
    description:
      "Advanced machine learning algorithms analyze symptoms to provide accurate disease predictions",
  },
  {
    icon: Icons.Stethescope,
    title: "Symptom Analysis",
    description:
      "Comprehensive evaluation of symptoms using medical knowledge base and patient history",
  },
  {
    icon: Icons.Stethescope,
    title: "Detailed Reports",
    description:
      "Get detailed analysis reports with potential conditions and recommended next steps",
  },
  {
    icon: Icons.Heart,
    title: "Real-time Monitoring",
    description:
      "Track your health parameters and get instant predictions when needed",
  },
  {
    icon: Icons.Virus,
    title: "Disease Database",
    description:
      "Access information about various diseases, their symptoms, and preventive measures",
  },
  {
    icon: Icons.Stethescope,
    title: "Health Recommendations",
    description:
      "Receive personalized health recommendations based on your prediction results",
  },
];

export const PredictionFeatures = () => {
  return (
    <div className="py-16 bg-white">
      <Container size="xl">
        <Title order={2} className="text-3xl font-bold text-center mb-12">
          Advanced Disease Prediction Features
        </Title>

        <Grid>
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Card className="h-full hover:shadow-lg  hover:scale-105 duration-300 transition-all">
                <ThemeIcon size="xl" radius="md" className="mb-4 bg-blue-600">
                  <feature.icon size={28} />
                </ThemeIcon>

                <Text className="font-bold mb-2 text-xl">{feature.title}</Text>
                <Text size="sm" color="dimmed">
                  {feature.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
};
