import {
  Text,
  Grid,
  Paper,
  Group,
  Stack,
  RingProgress,
  Center,
} from "@mantine/core";
import { BarChart, LineChart, PieChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { Icons } from "../../assets/icons";



// Sample data for various charts
const patientStats = [
  { date: "Mar 22", patients: 45 },
  { date: "Mar 23", patients: 52 },
  { date: "Mar 24", patients: 48 },
  { date: "Mar 25", patients: 60 },
  { date: "Mar 26", patients: 55 },
  { date: "Mar 27", patients: 65 },
  { date: "Mar 28", patients: 70 },
  { date: "Mar 29", patients: 75 },
];

const doctorPerformance = [
  { doctor: "Dr. Smith", appointments: 120, satisfaction: 95 },
  { doctor: "Dr. Johnson", appointments: 95, satisfaction: 92 },
  { doctor: "Dr. Williams", appointments: 110, satisfaction: 94 },
  { doctor: "Dr. Brown", appointments: 85, satisfaction: 90 },
];

const appointmentTypes = [
  { type: "General Checkup", value: 40 },
  { type: "Specialist Visit", value: 30 },
  { type: "Emergency", value: 20 },
  { type: "Follow-up", value: 10 },
];

const Dashboard = () => {
  return (
    <div className="p-8">
      <Text size="xl" fw={700} mb="md">
        Healthcare Dashboard
      </Text>

      {/* Stats Overview */}
      <Grid mb="xl">
        <Grid.Col span={3}>
          <Paper
            p="md"
            radius="md"
            withBorder
            shadow="md"
            className="hover:scale-105 ease-in-out cursor-pointer transition-all duration-300"
          >
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 75, color: "blue" }]}
                label={
                  <Center>
                    <Icons.User size="1.4rem"  />
                  </Center>
                }
              />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Total Patients
                </Text>
                <Text size="xl" fw={700}>
                  1,234
                </Text>
                <Text size="xs" c="green">
                  +12% this month
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Paper
            p="md"
            radius="md"
            withBorder
            shadow="md"
            className="hover:scale-105 ease-in-out cursor-pointer transition-all duration-300"
          >
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 85, color: "green" }]}
                label={
                  <Center>
                    <Icons.Stethescope size="1.4rem" />
                  </Center>
                }
              />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Active Doctors
                </Text>
                <Text size="xl" fw={700}>
                  24
                </Text>
                <Text size="xs" c="green">
                  +2 this month
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Paper
            p="md"
            radius="md"
            withBorder
            shadow="md"
            className="hover:scale-105 ease-in-out cursor-pointer transition-all duration-300"
          >
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 90, color: "orange" }]}
                label={
                  <Center>
                    <Icons.Calender size="1.4rem"  />
                  </Center>
                }
              />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Appointments
                </Text>
                <Text size="xl" fw={700}>
                  156
                </Text>
                <Text size="xs" c="green">
                  +15% this week
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Paper
            p="md"
            radius="md"
            withBorder
            shadow="md"
            className="hover:scale-105 ease-in-out cursor-pointer transition-all duration-300"
          >
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 95, color: "violet" }]}
                label={
                  <Center>
                    <Icons.Chartbar size="1.4rem"  />
                  </Center>
                }
              />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Predictions
                </Text>
                <Text size="xl" fw={700}>
                  94%
                </Text>
                <Text size="xs" c="green">
                  +2% this month
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Charts Section */}
      <Grid>
        <Grid.Col span={8}>
          <Paper p="md" radius="md" withBorder mb="md">
            <Text size="lg" fw={500} mb="md">
              Patient Visits Trend
            </Text>

            <LineChart
              className=""
              h={300}
              data={patientStats}
              dataKey="date"
              series={[{ name: "patients", color: "indigo.6" }]}
              curveType="linear"
              tickLine="y"
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" radius="md" withBorder mb="md">
            <Text size="lg" fw={500} mb="md">
              Appointment Types
            </Text>
            <PieChart
              h={300}
              data={appointmentTypes.map((item) => ({
                name: item.type,
                value: item.value,
                color:
                  item.type === "Emergency"
                    ? "red.6"
                    : item.type === "Specialist Visit"
                    ? "blue.6"
                    : item.type === "General Checkup"
                    ? "green.6"
                    : "yellow.6",
              }))}
              withLabels
              labelsPosition="outside"
              labelsType="percent"
              withTooltip
              tooltipDataSource="segment"
              paddingAngle={2}
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Paper p="md" radius="md" withBorder>
            <Text size="lg" fw={500} mb="md">
              Doctor Performance
            </Text>
            <BarChart
              h={300}
              data={doctorPerformance}
              dataKey="doctor"
              series={[
                { name: "appointments", color: "blue.6" },
                { name: "satisfaction", color: "green.6" },
              ]}
              tickLine="xy"
              gridAxis="xy"
              withLegend
              withTooltip
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Dashboard;
