import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "./auth.service";

interface IdentityResult {
  approved: boolean;
  score: number | null;
  risk_level: string;
  details?: {
    ocr: any;
  };
  metadata?: {
    validation_timestamp?: string | null;
  };
}

interface AuthContextType {
  isApproved: boolean;
  identityResult: IdentityResult | null;
  approve: (result: IdentityResult) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isApproved, setIsApproved] = useState(false);
  const [identityResult, setIdentityResult] =
    useState<IdentityResult | null>(null);

  useEffect(() => {
    setIsApproved(authService.isApproved());
  }, []);

  const approve = (result: IdentityResult) => {
    authService.saveApproved();
    setIsApproved(true);
    setIdentityResult(result);
  };

  const logout = () => {
    authService.logout();
    setIsApproved(false);
    setIdentityResult(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isApproved,
        identityResult,
        approve,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
