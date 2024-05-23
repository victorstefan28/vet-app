import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  ReactElement,
  useEffect,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";

export interface ProfileEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pin: string;
}

type ProfileContextType = {
  selectedProfile: ProfileEntity | null;
  setSelectedProfile: (profile: ProfileEntity | null) => void;
  logout: () => void;
};

const ProfileContext = createContext<ProfileContextType>({
  selectedProfile: null,
  setSelectedProfile: () => {},
  logout: () => {},
});

type ProfileProviderProps = {
  children: ReactNode;
};

export const useProfile = () => useContext(ProfileContext); // Convenient hook for context access

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}): ReactElement => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileEntity | null>(
    // Load from localStorage on initial render
    () => {
      const storedProfile = localStorage.getItem("profile");
      return storedProfile ? JSON.parse(storedProfile) : null;
    }
  );

  useEffect(() => {
    // Update localStorage whenever selectedProfile changes
    localStorage.setItem("profile", JSON.stringify(selectedProfile));
  }, [selectedProfile]);

  const logout = () => {
    setSelectedProfile(null);
    localStorage.removeItem("profile");
    console.log("Logged out");
  };

  return (
    <ProfileContext.Provider
      value={{ selectedProfile, setSelectedProfile, logout }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
