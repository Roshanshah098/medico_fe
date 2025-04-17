import { Container, Timeline, Title, Text, Paper } from "@mantine/core";
import { Icons } from "../assets/icons";


const steps = [
  {
    icon: Icons.ClipboardList,
    title: "Input Symptoms",
    description:
      "Enter your symptoms and health information into our user-friendly interface",
  },
  {
    icon: Icons.Robot,
    title: "AI Analysis",
    description:
      "Our advanced AI system analyzes your symptoms using machine learning algorithms",
  },
  {
    icon: Icons.ReportAnalytics,
    title: "Get Prediction",
    description:
      "Receive a detailed prediction report with potential conditions and confidence levels",
  },
  {
    icon: Icons.UserCheck,
    title: "Expert Consultation",
    description:
      "Connect with healthcare professionals for verification and treatment plans",
  },
];

export const HowItWorks = () => {
  return (
    <div className="py-16 bg-gray-50">
      <Container size="xl">
        <Title order={2} className="text-3xl font-bold text-center mb-12">
          How Disease Prediction Works
        </Title>

        <Paper className="p-8 max-w-4xl mx-auto">
          <Timeline active={-1} bulletSize={40} lineWidth={2}>
            {steps.map((step, index) => (
              <Timeline.Item
                key={index}
                bullet={<step.icon size={20} />}
                title={
                  <Text className="font-bold text-xl mb-2">{step.title}</Text>
                }
              >
                <Text color="dimmed" size="sm">
                  {step.description}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Paper>
      </Container>
    </div>
  );
};
