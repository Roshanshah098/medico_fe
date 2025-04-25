import {
  Button,
  Box,
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Modal,
  Tabs,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
  APIAcceptConsultation,
  APIEndConsultation,
  APIGetAllConsultations,
  APIGetAllConsultationsByPatient,
  APIGetAllDoctors,
} from "../../api/consultation";
import { useUserStore } from "../../stores/tokenStore";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ApiRateDoctor, ApiSendFeedback, ApiSendMessage } from "../../api/chat";

const ConsultationPage = () => {
  interface Doctor {
    id: string;
    full_name: string;
    specialization: string;
  }

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userProfile } = useUserStore();

  const isPatient = userProfile?.role === "Patient";
  const navigate = useNavigate();

  const [rating, setRating] = useState<any>("");
  const [feedback, setFeedback] = useState<any>("");

  const handleRateDoctor = async () => {
    if (!selectedConsultation?.id) return;
    try {
      const payload = {
        doctor: selectedConsultation?.doctor,
        feedback: feedback,
      };
      // Execute both API calls in parallel using Promise.all
      const [ratingResponse, feedbackResponse] = await Promise.all([
        ApiRateDoctor(selectedConsultation?.id, rating),
        ApiSendFeedback(payload),
      ]);
      console.log(ratingResponse, feedbackResponse, "responses");
      toast.success("Doctor rated successfully");
      toast.success("Feedback sent successfully");
      closeRate();
    } catch (error) {
      console.error("Error rating doctor:", error);
      toast.error("Failed to rate doctor");
    }
  };

  const form = useForm({
    initialValues: {
      doctor_id: "51df7608-b3ba-4be1-a080-a721af043748",
      patient: "52878ab7-4502-4bce-9b72-1c2167493326",
      specialist: "Cardiologist",
      patient_gender: "Male",
      message: "Hello",
      disease_name: "Test Disease",
      consultation_date: "2024-05-16",
    },
    validate: {
      specialist: (value) => (!value ? "Please enter specialist type" : null),
      patient_gender: (value) => (!value ? "Please select gender" : null),
      disease_name: (value) => (!value ? "Please enter disease name" : null),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [openedRate, { open: openRate, close: closeRate }] =
    useDisclosure(false);
  const fetchDoctors = async () => {
    try {
      const response = await APIGetAllDoctors();
      if (response?.data?.results) {
        setDoctors(response?.data?.results);
      } else {
        console.warn("No doctors data found in response");
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
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

  useEffect(() => {
    fetchConsultations();
    fetchDoctors();
  }, []);

  const postInitialMessage = async (id: number) => {
    try {
      const payload = {
        consultation: id,
        message:
          "Hello Sir/Madam! I am available Now, Are you ready to start the conversation?",
      };
      const res = await ApiSendMessage(payload);
      navigate("/chats");
    } catch (error) {}
  };

  const handleAccept = async (id: any) => {
    try {
      const res: any = await APIAcceptConsultation(id);
      toast.success("Request Accepted ");

      if (userProfile?.role === "Doctor") {
        postInitialMessage(res.data.consultation.id);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const endConsultation = async (id: any) => {
    try {
      const res: any = await APIEndConsultation(id);
      toast.success("Consultation Ended ");
      fetchConsultations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const [activeTab, setActiveTab] = useState<string | null>("active");

  return (
    <Box className="p-8 ">
      <Stack gap="xl">
        <Title order={2} className="text-2xl font-bold text-gray-800">
          Schedule a Consultation
        </Title>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="active">Active</Tabs.Tab>
            <Tabs.Tab value="requested">Requested</Tabs.Tab>
            <Tabs.Tab value="completed">Completed</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active">
            {consultations.length > 0 && (
              <div className="p-9">
                <Stack gap="md">
                  {consultations
                    .filter((consultation) => consultation.status === "active")
                    .map((consultation) => (
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
                          <Box className="flex gap-4">
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
                          </Box>
                        </Group>
                      </Card>
                    ))}
                </Stack>
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="requested">
            {consultations.length > 0 && (
              <div className="p-9">
                <Stack gap="md">
                  {consultations
                    .filter(
                      (consultation) => consultation.status === "requested"
                    )
                    .map((consultation) => (
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
                          <Box className="flex gap-4">
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
                          </Box>
                        </Group>
                      </Card>
                    ))}
                </Stack>
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="completed">
            {consultations.length > 0 && (
              <div className="p-9">
                <Stack gap="md">
                  {consultations
                    .filter(
                      (consultation) => consultation.status === "completed"
                    )
                    .map((consultation) => (
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
                          <Box className="flex gap-4">
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
                            <Badge
                              color="blue"
                              variant="light"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedConsultation(consultation);
                                openRate();
                              }}
                            >
                              Rate Doctor
                            </Badge>
                          </Box>
                        </Group>
                      </Card>
                    ))}
                </Stack>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
        {/* {consultations.length > 0 && (
          <Card withBorder shadow="sm" radius="md" p="xl">
            <Title order={3} className="text-xl font-semibold mb-4">
              Recent Consultations
            </Title>
            <Stack gap="md">
              {consultations.map((consultation) => (
                <Card key={consultation.id} withBorder p="md" radius="lg">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{consultation.disease_name}</Text>
                      <Text size="sm" c="dimmed">
                        {consultation.specialist}
                      </Text>
                    </div>
                    <div className="flex gap-6">
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

                      <Badge color="red" variant="light" className="">
                        {consultation?.status === "active"
                          ? "Active"
                          : "Pending"}
                      </Badge>
                    </div>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        )} */}
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="40%"
        title={
          <Text className="font-semibold text-2xl">Consultation Details</Text>
        }
      >
        {selectedConsultation && (
          <Stack className="p-6">
            <Box className="border-b pb-4">
              <Text className="text-lg font-medium mb-2">
                Patient Information
              </Text>
              <Group>
                <Box>
                  <Text size="sm" c="dimmed">
                    Patient Name
                  </Text>
                  <Text>{selectedConsultation.patient_name}</Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Gender
                  </Text>
                  <Group>
                    <Text>{selectedConsultation.patient_gender}</Text>
                  </Group>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Age
                  </Text>
                  <Group>
                    <Text>{selectedConsultation.patient_age}</Text>
                  </Group>
                </Box>
              </Group>
            </Box>

            <Box className="border-b pb-4">
              <Text className="text-lg font-medium mb-2">Medical Details</Text>
              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    Disease
                  </Text>
                  <Text>{selectedConsultation.disease_name}</Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Specialist
                  </Text>
                  <Text>{selectedConsultation.specialist}</Text>
                </Box>
              </Group>
            </Box>

            <Box>
              <Text className="text-lg font-medium mb-2">
                Consultation Information
              </Text>
              <Stack>
                <Box>
                  <Text size="sm" c="dimmed">
                    Date
                  </Text>
                  <Text>{selectedConsultation.consultation_date}</Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Message
                  </Text>
                  <Text className="bg-gray-50 p-3 rounded">
                    {selectedConsultation.message}
                  </Text>
                </Box>
              </Stack>
           {userProfile?.role != "Patient" && (
               
               <Box className="flex justify-between pt-4">
               <Button className="bg-red-500 hover:bg-red-700 transition-colors duration-200">
                 Reject
               </Button>
               <Button
                 onClick={() => handleAccept(selectedConsultation?.id)}
                 className="bg-green-400 hover:bg-primary-700 transition-colors duration-200 text-white"
                 disabled={selectedConsultation?.status === "active"}
               >
                 {selectedConsultation?.status === "active"
                   ? "Accepted"
                   : "Accept"}
               </Button>
             </Box>
           )}
            </Box>
          </Stack>
        )}
      </Modal>
      <Modal
        opened={openedRate}
        onClose={closeRate}
        centered
        size="70%"
        title={<Text className="font-semibold text-2xl">Rate Doctor</Text>}
      >
        <Stack gap="md">
          <Box>
            <Text size="sm" mb={4}>
              Rating (1-5)
            </Text>
            <Select
              value={rating?.toString()}
              onChange={(value) => setRating(Number(value))}
              placeholder="Select rating from 1 to 5"
              data={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5" },
              ]}
            />
          </Box>

          <Box>
            <Text size="sm" mb={4}>
              Feedback
            </Text>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide your feedback about the doctor"
              minRows={4}
              className="w-full"
            />
          </Box>

          <Button
            className="bg-primary-500 hover:bg-primary-600 text-white w-full mt-4"
            onClick={handleRateDoctor}
          >
            Submit Rating
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ConsultationPage;
