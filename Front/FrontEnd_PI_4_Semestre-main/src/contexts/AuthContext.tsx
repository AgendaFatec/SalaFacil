import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export type UserRole = "docente" | "coordenador" | "tecnico";

interface AuthContextType {
  userRole: UserRole | null;
  userName: string;
  userEmail: string;
  userId: number | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<{
          sub: number;
          role: string;
          email: string;
          name?: string;
          userName?: string;
        }>(token);

        const mapRoles: Record<string, UserRole> = {
          DOCENTE: "docente",
          ADM: "coordenador",
          TI: "tecnico",
        };

        setUserRole(mapRoles[decoded.role] || "docente");
        setUserEmail(decoded.email || "");
        setUserId(decoded.sub);
        setUserName(decoded.name || decoded.userName || "Usuário");
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userName,
        userEmail,
        userId,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
