import {
  Text,
  Grid,
  Paper,
  Group,
  Stack,
  Avatar,
  Button,
  Tabs,
  Box,
  Card,
  Badge,
  TextInput,
} from "@mantine/core";
import { Icons } from "../../assets/icons";
import { useEffect, useState } from "react";
import { APIGetProfileDetails, APIProfileUpdate } from "../../api/profile";
import { useUserStore } from "../../stores/tokenStore";
import {
  APIGetAllConsultations,
  APIGetAllConsultationsByPatient,
} from "../../api/consultation";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { isValidDOB } from "../../utils/validation";

const Profile = () => {
  const [data, setData] = useState<any>([]);
  const [consultations, setConsultations] = useState<any>([]);
  const [editMode, setEditMode] = useState(false);
  const { userProfile } = useUserStore();
  const form = useForm({
    initialValues: {
      name: data?.name || "",
      dob: data?.dob || "",
      user_type: data?.user_type || "",
      email: data?.email || "",
      address: data?.address || "",

      mobile_no: data?.mobile_no || "",
    },

    validate: {
      name: (value) => (value ? null : "Name is required"),
      dob: (value) => (isValidDOB(value) ? null : "Your age must be above 14"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      mobile_no: (value) =>
        value.length === 10 ? null : "Mobile number must be 10 digits",
    },
  });

  const fetchProfile = async () => {
    const res = await APIGetProfileDetails();
    setData(res?.data);
    form.setValues({
      name: res?.data?.name || "",
      dob: res?.data?.dob || "",
      user_type: res?.data?.user_type || "",
      email: res?.data?.email || "",
      address: res?.data?.address || "",
      mobile_no: res?.data?.mobile_no || "",
    });
  };

  const fetchConsultations = async () => {
    try {
      if (userProfile?.role === "Doctor") {
        const response = await APIGetAllConsultations();
        setConsultations(response.data.results);
      } else {
        const response = await APIGetAllConsultationsByPatient();
        setConsultations(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const handleUpdate = async (values: typeof form.values) => {
    try {
      const response = await APIProfileUpdate(values);
      toast.success("Profile updated!");
      setData(response?.data);
      toggleEditMode();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchConsultations();
  }, []);

  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  return (
    <div className="p-8">
      {editMode ? (
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <Paper
            radius="md"
            withBorder
            p="xl"
            mb="xl"
            className="flex justify-between "
          >
            <Group wrap="nowrap" gap="xl">
              <Avatar
                src={data?.gender === "Male" ? "/male.jpg" : "/female.jpg" }
                size={120}
                radius={120}
              />
              
              <Stack gap="xs" className="">
                <TextInput
                  label="Name"
                  {...form.getInputProps("name")}
                  className="w-72"
                />
                <TextInput
                  type="date"
                  label="Date of Birth"
                  {...form.getInputProps("dob")}
                />
                <TextInput label="Email" {...form.getInputProps("email")} />
                <TextInput label="Address" {...form.getInputProps("address")} />
                <TextInput
                  label="Mobile No"
                  {...form.getInputProps("mobile_no")}
                />
              </Stack>
            </Group>
            <Stack>
              <Button
                type="submit"
                variant="filled"
                size="sm"
                className="w-32 bg-primary-400"
              >
                Save
              </Button>
              <Button
                onClick={toggleEditMode}
                variant="outline"
                size="sm"
                className="w-32"
              >
                Cancel
              </Button>
            </Stack>
          </Paper>
        </form>
      ) : (
        <Paper
          radius="md"
          withBorder
          p="xl"
          mb="xl"
          className="flex justify-between"
        >
          <Group wrap="nowrap" gap="xl">
          <Avatar
                src={data?.gender === "Male" ? "/male.jpg" : "/female.jpg" }
                size={120}
                radius={120}
              />
            <Stack gap="xs">
              <Text size="xl" fw={700}>
                {data?.name}
              </Text>
              <Text size="sm" c="dimmed">
                {data?.user_type}
              </Text>
              <Group gap="xs">
                <Icons.Mail size="1rem" />
                <Text size="sm">{data?.email}</Text>
              </Group>
              <Group gap="xs">
                <Icons.Phone size="1rem" />
                <Text size="sm">{data?.mobile_no}</Text>
              </Group>
            </Stack>
          </Group>
          <Button
            onClick={toggleEditMode}
            variant="outline"
            size="sm"
            className="w-fit"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </Paper>
      )}

      <Tabs defaultValue="overview">
        <Tabs.List mb="xl">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="appointments">Appointments</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Grid>
            <Grid.Col span={12}>
              <Paper withBorder radius="md" p="md" mb="md">
                <Text fw={600} mb="md">
                  Personal Information
                </Text>
                <Stack gap="xs">
                  <Group>
                    <Text fw={500}>Username:</Text>
                    <Text>{data?.username}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Age:</Text>
                    <Text>{data?.age}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Date of Birth:</Text>
                    <Text>{data?.dob}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Gender:</Text>
                    <Text>{data?.gender}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Address:</Text>
                    <Text> {data?.address}</Text>
                  </Group>
                  <Group>
                    {/* <Text fw={500}>Member Since:</Text>
                    <Text>
                        
                        {formatDate(data?.date_joined)}</Text> */}
                  </Group>
                </Stack>
              </Paper>

              <Paper withBorder radius="md" p="md">
                <Text fw={600} mb="md">
                  Account Details
                </Text>
                <Stack gap="xs">
                  <Group>
                    <Text fw={500}>Account Type:</Text>
                    <Text>{data?.user_type}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>User ID:</Text>
                    <Text>{data?.id}</Text>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="appointments">
          <Paper withBorder radius="md" p="md">
            <Text fw={600} mb="md">
              Appointment History
            </Text>
            {consultations.length > 0 && (
              <div className="">
                <Stack gap="md">
                  {consultations
                    .filter(
                      (consultation: any) => consultation.status === "active"
                    )
                    .map((consultation: any) => (
                      <Card
                        key={consultation.id}
                        withBorder
                        p="md"
                        radius={"lg"}
                        className="hover:scale-105 transition-all duration-300 "
                      >
                        <Group justify="space-between">
                          <div>
                            <Text fw={500}>{consultation.disease_name}</Text>
                            <Text size="sm" c="dimmed">
                              {consultation.specialist}
                            </Text>
                          </div>
                          {/* <Box className="flex gap-4">
                            <Badge
                              color="blue"
                              variant="light"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedConsultation(consultation);
                                open();
                              }}
                            >
                              View Details
                            </Badge>
                            {userProfile?.role === "Patient" && (
                              <Badge
                                color="red"
                                variant="light"
                                className="cursor-pointer"
                                onClick={() => endConsultation(consultation.id)}
                              >
                                End Consultation
                              </Badge>
                            )}
                          </Box> */}
                        </Group>
                      </Card>
                    ))}
                </Stack>
              </div>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Profile;
