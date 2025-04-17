import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Card,
  Image,
} from "@mantine/core";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  {
    value: 5000,
    label: "Hospital Details",
    description: "Registered hospitals",
    suffix: "+",
  },
  {
    value: 15000,
    label: "Diagnostic Center",
    description: "Active centers",
    suffix: "+",
  },
  {
    value: 20000,
    label: "Doctor Chamber",
    description: "Available doctors",
    suffix: "+",
  },
];

const AnimatedNumber = ({
  value,
  suffix,
}: {
  value: number;
  suffix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);
  const displayNumber = useTransform(roundedCount, (latest) => `${latest}`);

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, value, count]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.span>{displayNumber}</motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
};

const featuredContent = [
  {
    title: "Best Diagnostic Centers",
    image: "/bg.jpg",
    description: "Find top-rated diagnostic centers in your area",
  },
  {
    title: "Emergency Services",
    image: "/emergency.jpg",
    description: "24/7 emergency medical services",
  },
  {
    title: "Advanced Equipment",
    image: "/equip.jpg",
    description: "State-of-the-art medical equipment",
  },
];

export const StatsSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <Container size="xl">
        <div className="mb-16">
          <Title order={2} className="text-3xl font-bold text-center mb-12">
            Find the Right Diagnostic center,
            <br />
            Hospital & Doctors Chamber
          </Title>

          <Grid>
            {stats.map((stat) => (
              <Grid.Col key={stat.label} span={{ base: 12, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper className="p-6 text-center hover:shadow-md transition-shadow">
                    <Text className="text-3xl font-bold text-blue-600 mb-2">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </Text>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Text className="font-semibold mb-1">{stat.label}</Text>
                      <Text size="sm" color="dimmed">
                        {stat.description}
                      </Text>
                    </motion.div>
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        <div>
          <Title order={2} className="text-3xl font-bold text-center mb-8">
            Featured Services
          </Title>

          <Grid>
            {featuredContent.map((item, index) => (
              <Grid.Col key={item.title} span={{ base: 12, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="hover:shadow-lg ease-in-out hover:scale-105 duration-300 transition-all">
                    <Card.Section className="h-[400px] ">
                      <Image
                        className="h-full w-full object-cover"
                        src={item.image}
                        height={200}
                        alt={item.title}
                      />
                    </Card.Section>

                    <Text className="font-semibold mt-4 mb-2">
                      {item.title}
                    </Text>
                    <Text size="sm" color="dimmed">
                      {item.description}
                    </Text>
                  </Card>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </Container>
    </div>
  );
};
