import {
  Avatar,
  Box,
  Button,
  Card,
  Drawer,
  MultiSelect,
  Select,
  Skeleton,
  Stack,
  Stepper,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  APIGetDoctorsBySpecialization,
  APIPredictDisease,
} from "../../api/prediction";

import CardSkeleton from "../../components/common/skeleton/CardSkeleton";

import { useUserStore } from "../../stores/tokenStore";
import { APICreateconsultation } from "../../api/consultation";
import { toast } from "react-toastify";
import { Icons } from "../../assets/icons";

const diseaseOptions = [
  "itching",
  "skin_rash",
  "nodal_skin_eruptions",
  "continuous_sneezing",
  "shivering",
  "chills",
  "joint_pain",
  "stomach_pain",
  "acidity",
  "ulcers_on_tongue",
  "muscle_wasting",
  "vomiting",
  "burning_micturition",
  "spotting_ urination",
  "fatigue",
  "weight_gain",
  "anxiety",
  "cold_hands_and_feets",
  "mood_swings",
  "weight_loss",
  "restlessness",
  "lethargy",
  "patches_in_throat",
  "irregular_sugar_level",
  "cough",
  "high_fever",
  "sunken_eyes",
  "breathlessness",
  "sweating",
  "dehydration",
  "indigestion",
  "headache",
  "yellowish_skin",
  "dark_urine",
  "nausea",
  "loss_of_appetite",
  "pain_behind_the_eyes",
  "back_pain",
  "constipation",
  "abdominal_pain",
  "diarrhoea",
  "mild_fever",
  "yellow_urine",
  "yellowing_of_eyes",
  "acute_liver_failure",
  "fluid_overload",
  "swelling_of_stomach",
  "swelled_lymph_nodes",
  "malaise",
  "blurred_and_distorted_vision",
  "phlegm",
  "throat_irritation",
  "redness_of_eyes",
  "sinus_pressure",
  "runny_nose",
  "congestion",
  "chest_pain",
  "weakness_in_limbs",
  "fast_heart_rate",
  "pain_during_bowel_movements",
  "pain_in_anal_region",
  "bloody_stool",
  "irritation_in_anus",
  "neck_pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen_legs",
  "swollen_blood_vessels",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "excessive_hunger",
  "extra_marital_contacts",
  "drying_and_tingling_lips",
  "slurred_speech",
  "knee_pain",
  "hip_joint_pain",
  "muscle_weakness",
  "stiff_neck",
  "swelling_joints",
  "movement_stiffness",
  "spinning_movements",
  "loss_of_balance",
  "unsteadiness",
  "weakness_of_one_body_side",
  "loss_of_smell",
  "bladder_discomfort",
  "foul_smell_of urine",
  "continuous_feel_of_urine",
  "passage_of_gases",
  "internal_itching",
  "toxic_look_(typhos)",
  "depression",
  "irritability",
  "muscle_pain",
  "altered_sensorium",
  "red_spots_over_body",
  "belly_pain",
  "abnormal_menstruation",
  "dischromic _patches",
  "watering_from_eyes",
  "increased_appetite",
  "polyuria",
  "family_history",
  "mucoid_sputum",
  "rusty_sputum",
  "lack_of_concentration",
  "visual_disturbances",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "coma",
  "stomach_bleeding",
  "distention_of_abdomen",
  "history_of_alcohol_consumption",
  "fluid_overload.1",
  "blood_in_sputum",
  "prominent_veins_on_calf",
  "palpitations",
  "painful_walking",
  "pus_filled_pimples",
  "blackheads",
  "scurring",
  "skin_peeling",
  "silver_like_dusting",
  "small_dents_in_nails",
  "inflammatory_nails",
  "blister",
  "red_sore_around_nose",
  "yellow_crust_ooze",
];
const PredictionPage = () => {
  const { userProfile } = useUserStore();
  console.log(userProfile, "userProfile");
  //   const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  //   const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(
  //     null
  //   );

  const handleBookAppointment = async (
    doctorId: string,

    specialization: string
  ) => {
    const appointmentData = {
      doctor_id: doctorId,

      patient: userProfile?.id,

      specialist: specialization,
      patient_gender: "Female",
      message: "Hello",
      disease_name: " Disease very New",
      consultation_date: "2024-05-7",
    };

    try {
      const response = await APICreateconsultation(appointmentData);

      console.log(response);
      if (response) {
        toast.success("Appointment booked successfully");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await APIGetDoctorsBySpecialization(response?.prediction_id);
      setDoctors(data?.data?.results); // Assuming response is an array of doctors
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };

  const [response, setResponse] = useState<{
    disease: string;
    confidence: number;
    recommended_specialization: string;
    prediction_id: number;
  } | null>(null);
  const handlePredict = async () => {
    const payload = {
      symptoms: selectedDiseases,
    };

    console.log("Predicting for:", payload);
    try {
      setLoading(true);
      // Adding a 3-second delay before making the API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await APIPredictDisease(payload);
      setResponse(res.data);
      console.log("Prediction result:", res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error predicting disease:", error);
      setLoading(false);
    }
  };
  console.log(doctors, "doctors");

  return (
    <div className="p-8 space-y-2 ">
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step
          label="Prediction"
          icon={<Icons.Brain size={24} />}
          description="Predict disease"
        >
          <div className="flex w-full py-8">
            <div
              className={`transition-all duration-300 ${
                response ? "w-2/3 pr-4" : "w-full"
              }`}
            >
              <div className="bg-purple-50 p-6 rounded-lg flex items-center w-full justify-center space-x-4">
                <div className="bg-primary-100 rounded-full">
                  <Icons.Brain className="w-12 h-12 text-primary-600" />
                </div>

                <div className="text-center">
                  <Text
                    component="h2"
                    className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent"
                  >
                    AI-Powered Disease Prediction
                  </Text>
                  <Text className="text-gray-600">
                    Using advanced machine learning to analyze your symptoms
                  </Text>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="text-center max-w-2xl mx-auto">
                  <Text className="text-2xl font-bold text-gray-800 mb-3">
                    What symptoms are you experiencing?
                  </Text>
                  <Text className="text-gray-600 text-lg">
                    Select all symptoms that apply for the most accurate
                    prediction
                  </Text>
                </div>

                <div className="flex flex-col gap-6">
                  <MultiSelect
                    label={
                      <Text className="text-lg font-medium text-gray-700 mb-2">
                        Your Symptoms
                      </Text>
                    }
                    className="w-full"
                    placeholder="Type to search symptoms..."
                    data={diseaseOptions}
                    value={selectedDiseases}
                    onChange={setSelectedDiseases}
                    searchable
                    clearable
                    leftSection={
                      selectedDiseases.length > 0 ? (
                        <Icons.Brain className="text-primary-500 w-6 h-6" />
                      ) : null
                    }
                  />

                  <Button
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 
                               text-white font-medium rounded-xl shadow-xl hover:shadow-2xl 
                               transform hover:scale-102 transition-all duration-300"
                    onClick={handlePredict}
                    loading={loading}
                  >
                    Analyze Symptoms
                  </Button>
                </div>
              </div>
            </div>

            {response && (
              <div className="w-1/3 transition-all duration-300 transform translate-x-0">
                <Card
                  withBorder
                  className="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-center space-y-4">
                    {loading ? (
                      <Skeleton height={50} circle className="mx-auto" />
                    ) : (
                      <div className="inline-flex p-3 bg-primary-50 rounded-full">
                        <Icons.Brain className="w-8 h-8 text-primary-600" />
                      </div>
                    )}

                    <div className="space-y-1">
                      {loading ? (
                        <>
                          <Skeleton
                            height={24}
                            width="60%"
                            className="mx-auto mb-2"
                          />
                          <Skeleton
                            height={28}
                            width="80%"
                            className="mx-auto"
                          />
                        </>
                      ) : (
                        <>
                          <Text className="text-lg font-bold text-gray-800">
                            Analysis Results
                          </Text>
                          <Text className="text-xl font-bold text-primary-600">
                            {response?.disease}
                          </Text>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 py-4">
                      {loading ? (
                        <>
                          <Skeleton
                            height={20}
                            width="40%"
                            className="mx-auto mb-2"
                          />
                          <Skeleton
                            height={24}
                            width="70%"
                            className="mx-auto"
                          />
                        </>
                      ) : (
                        <>
                          <Text className="text-sm font-medium text-gray-600">
                            Recommended Specialist
                          </Text>
                          <Text className="text-base text-primary-600 font-medium">
                            {response?.recommended_specialization}
                          </Text>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-6">
                      {loading ? (
                        <>
                          <Skeleton height={36} className="w-full" />
                          <Skeleton height={36} className="w-full" />
                        </>
                      ) : (
                        <>
                          <Button
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                                     text-white py-2 text-sm font-medium rounded-lg shadow hover:shadow-md
                                     transition-all duration-200"
                            onClick={() => {
                              fetchDoctors();
                              nextStep();
                            }}
                          >
                            Get Recommended Doctors
                          </Button>

                          <Button
                            variant="outline"
                            className="border border-gray-200 hover:bg-gray-50 text-gray-700
                                     py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                            onClick={() => window.print()}
                          >
                            Save Report
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
          <Text className="text-sm text-gray-500 text-center italic mt-4">
            Note: This AI prediction tool is for reference only. Please consult
            with healthcare professionals for medical diagnosis.
          </Text>
        </Stepper.Step>
        <Stepper.Step
          label="Doctors"
          icon={<Icons.Stethescope size={24} />}
          description="Get recommended doctors"
        >
          <div className="bg-purple-50 p-6 rounded-lg flex items-center w-full justify-center space-x-4">
            <Icons.Heart className="w-12 h-12 text-purple-500" />
            <div className=" text-center">
              <Text
                component="h2"
                className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent"
              >
                Recommended Healthcare Specialists
              </Text>
              <Text className="text-gray-600 ">
                Expertly matched doctors based on your health profile
              </Text>
              {/* <div className="w-24 h-1 bg-primary-500 mx-auto mt-4 rounded-full"></div> */}
            </div>
          </div>
          <Box className="space-y-4 py-4">
            {loading && <CardSkeleton />}

            {!loading && doctors?.length > 0 && (
              <Box className="grid grid-cols-3 gap-4">
                {doctors?.map((doctor: any) => (
                  <Box
                    key={doctor?.id}
                    p="md"
                    className="border rounded-lg justify-between w-full space-y-6 items-end"
                  >
                    <div className="flex flex-col space-y-2 flex-1">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          src={doctor.image || "https://via.placeholder.com/60"}
                          alt={doctor.full_name}
                          size="lg"
                          radius="xl"
                        />
                        <div>
                          <Text className="text-lg font-semibold">
                            {doctor.full_name}
                          </Text>
                          <div className="flex items-center space-x-1">
                            <Text className="text-sm text-gray-600">
                              Rating: {doctor.rating || "5.0"}
                            </Text>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icons.StarFilled
                                  key={star}
                                  size={16}
                                  className="text-yellow-400"
                                />
                              ))}
                            </div>
                            <Text className="text-sm text-gray-500">
                              ({doctor.reviews || "70"})
                            </Text>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Icons.Stethescope
                            size={16}
                            className="text-gray-500"
                          />
                          <Text className="text-sm font-medium">
                            Specialization:
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {doctor.specialization}
                          </Text>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Icons.Office size={16} className="text-gray-500" />
                          <Text className="text-sm font-medium">Address:</Text>
                          <Text className="text-sm text-gray-600">
                            {doctor.address || "Unknown"}
                          </Text>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Icons.School size={16} className="text-gray-500" />
                          <Text className="text-sm font-medium">
                            Qualification:
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {doctor.qualification || "Unknown"}
                          </Text>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icons.Check
                            color="green"
                            size={16}
                            className="text-gray-500"
                          />
                          <Text className="text-sm font-medium">
                            Availability:
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {doctor.is_available
                              ? "Available"
                              : "Not Available"}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <Box className="flex justify-between">
                      <Button
                        onClick={() =>
                          handleBookAppointment(
                            doctor?.id,

                            doctor?.specialization
                          )
                        }
                        className="bg-primary-500 hover:bg-slate-600 transition-all   shadow-lg transform hover:scale-105"
                      >
                        Book Appointment
                      </Button>
                    
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* If no doctors are found */}
            {!loading && doctors.length === 0 && <Text>No doctors found.</Text>}
          </Box>
        </Stepper.Step>
        <Stepper.Step
          icon={<Icons.Brain size={24} />}
          label="Final step"
          description="Get full access"
        >
          <div className="bg-green-50 p-6 rounded-lg flex items-center space-x-4">
            <Icons.Virus className="w-12 h-12 text-green-500" />
            <div></div>
          </div>
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Box className="flex w-full justify-between">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button className="bg-primary-500" onClick={nextStep}>
          Next step
        </Button>
      </Box>
    </div>
  );
};

export default PredictionPage;
