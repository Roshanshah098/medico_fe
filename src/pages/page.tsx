import React, { useState, useEffect } from "react";
import { Button, Text, Title, Loader, Card } from "@mantine/core";
import axios from "axios";
import { getMyProfile } from "../api/profile";
import { useUserStore } from "../stores/tokenStore";

// Type for profile data
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

const Profile = () => {
  // States to hold profile data, loading state, and error state

  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useUserStore();
  const [profile, setProfile] = useState<any | null>(userProfile);

  // Display loading spinner, error message, or the profile data

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Text size="lg" color="red">
          {error}
        </Text>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Title order={2} className="text-center text-indigo-600 mb-6">
          My Profile
        </Title>

        {/* Profile Details */}
        <div className="flex justify-center mb-6">
          <img
            src={profile?.avatar}
            alt="Profile Avatar"
            className="rounded-full w-32 h-32 border-4 border-indigo-600"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Text size="lg" className="font-semibold text-gray-800">
              Name:
            </Text>
            <Text size="sm" className="text-gray-600">
              {profile?.name}
            </Text>
          </div>
          <div>
            <Text size="lg" className="font-semibold text-gray-800">
              Email:
            </Text>
            <Text size="sm" className="text-gray-600">
              {profile?.email}
            </Text>
          </div>
          <div>
            <Text size="lg" className="font-semibold text-gray-800">
              Phone:
            </Text>
            <Text size="sm" className="text-gray-600">
              {profile?.phone}
            </Text>
          </div>
          <div>
            <Text size="lg" className="font-semibold text-gray-800">
              Address:
            </Text>
            <Text size="sm" className="text-gray-600">
              {profile?.address}
            </Text>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <Button variant="filled" color="indigo" size="md">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
