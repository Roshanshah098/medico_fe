import { Avatar, Box, Button, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Icons } from "../../assets/icons";
import { APIGetDoctors } from "../../api/doctor";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await APIGetDoctors();
      setDoctors(data?.data?.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };

  useEffect(()=>{
fetchDoctors();
  },[])

  return (
    <div className="py-8 px-10 w-full space-y-10 ">
        <div className="w-full flex items-center justify-center" >
            <h3 className="font-bold text-3xl w-fit border-b">Availabe Doctors</h3>
        </div>
      {!loading && doctors?.length > 0 && (
        <Box className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {doctors?.map((doctor: any) => (
            <Box
              key={doctor?.id}
              p="md"
              className="border rounded-lg justify-between w-full space-y-6 items-end"
            >
              <div className="flex flex-col space-y-2 flex-1">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={doctor.image || "/doctorProfile.jpg"}
                    alt={doctor.full_name}
                    size="xl"
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
                        ({doctor.reviews || "3"})
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icons.Stethescope size={16} className="text-gray-500" />
                    <Text className="text-sm font-medium">Specialization:</Text>
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
                    <Text className="text-sm font-medium">Qualification:</Text>
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
                    <Text className="text-sm font-medium">Availability:</Text>
                    <Text className="text-sm text-gray-600">
                      {doctor.is_available ? "Available" : "Not Available"}
                    </Text>
                  </div>
                </div>
              </div>
              {/* <Box className="flex justify-between">
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
                              <Button
                                variant="outline"
                                className=" transition-all   shadow-lg transform hover:scale-105"
                              >
                                Write a review
                              </Button>
                            </Box> */}
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default Doctors;
