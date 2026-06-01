import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { jwtDecode } from "jwt-decode";

export default function LayoutBase() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [authState] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        perfilAtivo: "docente" as const,
        emailLogado: "",
        nomeLogado: "",
        idLogado: 0,
      };
    }

    try {
      const decoded = jwtDecode<{
        sub: number;
        role: string;
        email: string;
        name?: string;
        userName?: string;
      }>(token);

      const mapRoles: Record<string, "docente" | "coordenador" | "tecnico"> = {
        DOCENTE: "docente",
        ADM: "coordenador",
        TI: "tecnico",
      };

      return {
        perfilAtivo: mapRoles[decoded.role] || "docente",
        emailLogado: decoded.email || "",
        nomeLogado: decoded.name || decoded.userName || "Usuário",
        idLogado: decoded.sub,
      };
    } catch (error) {
      console.error("Erro ao decodificar token no Layout:", error);
      return {
        perfilAtivo: "docente" as const,
        emailLogado: "",
        nomeLogado: "",
        idLogado: 0,
      };
    }
  });

  const { perfilAtivo, emailLogado, nomeLogado, idLogado } = authState;

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden relative text-gray-900">
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      <Sidebar
        userId={idLogado}
        tipoUsuario={perfilAtivo}
        nomeUsuario={nomeLogado} // <-- ADICIONE ISSO
        usuarioEmail={emailLogado}
        onFechar={() => setSidebarAberta(false)}
        isOpen={sidebarAberta}
      />

      <main
        className={`flex-1 h-full overflow-y-auto relative transition-all duration-300 w-full ${
          sidebarAberta ? "md:pl-70" : "pl-0"
        }`}
      >
        {!sidebarAberta && (
          <button
            onClick={() => setSidebarAberta(true)}
            className="fixed top-6 left-6 z-30 p-2 bg-[#B20000] text-white rounded-lg shadow-md hover:bg-red-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </button>
        )}

        <Outlet />
      </main>
    </div>
  );
}
