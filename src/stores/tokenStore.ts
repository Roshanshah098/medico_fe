import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  userProfile: {
    id: string | null;
    email: string | null;
    role: string | null;
    gender: string | null;
    name: string | null;
    userHandle: string | null;
    connectedTo: string | null;
    otpVerified: boolean | null;
    token: string | null;
    refreshToken: string | null;
  } | null;

  setUserProfile: (profile: UserStore["userProfile"]) => void;
  removeUserProfile: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      removeUserProfile: () => {
        set({ userProfile: null });
        localStorage.removeItem("disease-user");
      },
    }),
    {
      name: "disease-user", // Key for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface EmailState {
  email: string | null;
  setEmail: (email: string | null) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  email: null,
  setEmail: (email: string | null) => set({ email }),
}));
