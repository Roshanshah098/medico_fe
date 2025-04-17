import { useEffect, useState } from "react";
import { useEmailStore } from "../../stores/tokenStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerApi } from "../../services/endpoints/authService";
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Box,
  Title,
  Text,
  Stack,
  Tabs,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Icons } from "../../assets/icons";

interface FormValues {
  email: string;
  username: string;
  name: string;
  dob: string;
  address: string;
  mobile_no: string;
  gender: string;
  password: string;
  confirm_password: string;
  registration_no?: string; // Optional for doctor
  year_of_registration?: string; // Optional for doctor
  qualification?: string; // Optional for doctor
  specialization?: string; // Optional for doctor
  state_medical_council?: string; // Optional for doctor
}

const Specialization = [
  "Infectious Disease Specialist",
  "Dermatologist",
  "Hepatologist",
  "Allergist",
  "Rheumatologist",
  "Pulmonologist",
  "Orthopedist",
  "General Physician",
  "Gastroenterologist",
  "Cardiologist",
  "Endocrinologist",
  "Neurologist",
  "Urologist",
];

const Register = () => {
  const { email, setEmail } = useEmailStore();
  const [loading, setLoading] = useState(false);
  const router = useNavigate();
  const [tabValue, setTabValue] = useState("Patient"); // State for tab value

  const handleTabChange = (value: any) => {
    setTabValue(value); // Update the tab value when tab changes
  };

  console.log(tabValue);

  const form = useForm<FormValues>({
    initialValues: {
      email: email || "",
      username: "",
      name: "",
      dob: "",
      address: "",
      mobile_no: "",
      gender: "Male",
      password: "",
      confirm_password: "",
    },

    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      username: (value: string) => (value ? null : "Username is required"),
      name: (value: string) => (value ? null : "Name is required"),
      dob: (value: string) => (value ? null : "Date of birth is required"),
      address: (value: string) => (value ? null : "Address is required"),
      mobile_no: (value: string) =>
        value ? null : "Mobile number is required",
      password: (value: string) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirm_password: (value: string) =>
        !value ? "Passwords did not match" : null,
    },
  });

  useEffect(() => {
    if (email) {
      form.setFieldValue("email", email);
    }
  }, [email]);

  const handleSubmit = async (values: FormValues) => {
    const payload: any = {
      user_type: tabValue,
      password: values.password,
      confirm_password: values.confirm_password,
      data: {
        email: values.email,
        username: values.username,
        name: values.name,
        dob: values.dob,
        address: values.address,
        mobile_no: values.mobile_no,
        gender: values.gender,
      },
    };

    // Check if the selected tab is for doctor and add additional fields
    if (tabValue === "Doctor") {
      payload.data.registration_no = values.registration_no;
      payload.data.year_of_registration = values.year_of_registration;
      payload.data.qualification = values.qualification;
      payload.data.specialization = values.specialization;
      payload.data.state_medical_council = values.state_medical_council;
    }

    try {
      setLoading(true);
      console.log(payload);
      const response = await registerApi(payload);
      setEmail(values.email);
      toast.success(response.message);
      router("/otp-verify");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className=" h-screen py-2 flex items-center justify-center">
      <Box className="w-5/12 p-4 gap-4 flex flex-col items-center justify-center h-fit  border-gray-300 border  rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap">
          <Title order={3}>Register</Title>
          <Text>Sign up has never been this easy</Text>
        </div>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="w-full space-y-4"
        >
          <Tabs.List className="">
            <Tabs.Tab value="Patient" leftSection={<Icons.Settings size={12} />}>
              Patient
            </Tabs.Tab>
            <Tabs.Tab value="Doctor" leftSection={<Icons.Settings size={12} />}>
              Doctor
            </Tabs.Tab>
            <Tabs.Tab value="Admin" leftSection={<Icons.Settings size={12} />}>
              Admin
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Patient">
            <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
              <Stack gap={"sm"} className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Full Name"
                  className="col-span-2"
                  placeholder="Enter your full name"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  {...form.getInputProps("email")}
                />

                <TextInput
                  label="Username"
                  placeholder="Choose a username"
                  {...form.getInputProps("username")}
                />

                <TextInput
                  type="date"
                  label="Date of Birth"
                  {...form.getInputProps("dob")}
                />

                <TextInput
                  label="Address"
                  placeholder="Enter your address"
                  {...form.getInputProps("address")}
                />

                <TextInput
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  {...form.getInputProps("mobile_no")}
                />

                <Select
                  label="Gender"
                  data={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                  {...form.getInputProps("gender")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  {...form.getInputProps("password")}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  {...form.getInputProps("confirm_password")}
                />

                <Button
                  type="submit"
                  className="bg-red-600 col-span-2 mt-2"
                  loading={loading}
                  fullWidth
                >
                  Register
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="Doctor">
            {" "}
            <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
              <Stack className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  {...form.getInputProps("email")}
                  defaultValue="email@email.com"
                />

                <TextInput
                  label="Username"
                  placeholder="Choose a username"
                  {...form.getInputProps("username")}
                  defaultValue="Dautar Saab"
                />

                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...form.getInputProps("name")}
                  defaultValue="John Doe"
                />

                <TextInput
                  type="date"
                  label="Date of Birth"
                  {...form.getInputProps("dob")}
                  defaultValue="1990-01-01"
                />

                <TextInput
                  label="Address"
                  placeholder="Enter your address"
                  {...form.getInputProps("address")}
                  defaultValue="123 Main Street, Springfield, IL"
                />

                <TextInput
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  {...form.getInputProps("mobile_no")}
                  defaultValue="1234567890"
                />

                <Select
                  label="Gender"
                  data={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                  {...form.getInputProps("gender")}
                  defaultValue="Male"
                />

                <TextInput
                  label="Registration Number"
                  placeholder="Enter your registration number"
                  {...form.getInputProps("registration_no")}
                  defaultValue="ABC123456"
                />

                <TextInput
                  label="Year of Registration"
                  placeholder="Enter your year of registration"
                  {...form.getInputProps("year_of_registration")}
                  defaultValue="2015"
                />

                <TextInput
                  label="Qualification"
                  placeholder="Enter your qualification"
                  {...form.getInputProps("qualification")}
                  defaultValue="MBBS"
                />

                <Select
                  label="Specialization"
                  placeholder="Enter your specialization"
                  {...form.getInputProps("specialization")}
                  defaultValue="Allergist"
                  data={Specialization}
                />

                <TextInput
                  label="State Medical Council"
                  placeholder="Enter your state medical council"
                  {...form.getInputProps("state_medical_council")}
                  defaultValue="Illinois State Medical Board"
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  {...form.getInputProps("password")}
                  defaultValue="testpassword123"
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  {...form.getInputProps("confirm_password")}
                  defaultValue="testpassword123"
                />

                <Button
                  type="submit"
                  className="bg-red-600 col-span-2 mt-2"
                  loading={loading}
                  fullWidth
                >
                  Register
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="Admin">
            {" "}
            <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
              <Stack gap={"sm"} className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Full Name"
                  className="col-span-2"
                  placeholder="Enter your full name"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  {...form.getInputProps("email")}
                />

                <TextInput
                  label="Username"
                  placeholder="Choose a username"
                  {...form.getInputProps("username")}
                />

                <TextInput
                  type="date"
                  label="Date of Birth"
                  {...form.getInputProps("dob")}
                />

                <TextInput
                  label="Address"
                  placeholder="Enter your address"
                  {...form.getInputProps("address")}
                />

                <TextInput
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  {...form.getInputProps("mobile_no")}
                />

                <Select
                  label="Gender"
                  data={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                  {...form.getInputProps("gender")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  {...form.getInputProps("password")}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  {...form.getInputProps("confirm_password")}
                />

                <Button
                  type="submit"
                  className="bg-red-600 col-span-2 mt-2"
                  loading={loading}
                  fullWidth
                >
                  Register
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>

        <Text size="sm" c="dimmed" mt="sm">
          Already have an account?{" "}
          <Text component="a" href="/login" fw={500} c="dark">
            Log in
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
