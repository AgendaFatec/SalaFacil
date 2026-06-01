import {
  BrowserRouter as Router,
  Routes,
  Route,
  
  // Navigate,
} from "react-router-dom";

import Login from "./pages/login/login";
import ListaSalasDocentes from "./pages/docentes/listarSalas";
import ListaSalasTecnico from "./pages/tecnico/listarSalas";
import MinhasReservas from "./pages/docentes/reservaDocente";
import DashboardAdm from "./pages/adm/dashboardAdm";
import LayoutBase from "./components/LayoutBase";

// import CriarUsuario from "./pages/adm/criarUsuarios";

import Calendario from "./pages/adm/Calendario";
import ReservasSolicitadas from "./pages/adm/ReservasSolicitadas";
import ChamadosTI from "./pages/tecnico/ChamadaTI";
import ChamadosDocente from "./pages/docentes/chamadoDocente";
import PesquisaDocente from "./pages/pesquisas/PesquisaDocente";
import PesquisaAdm from "./pages/pesquisas/PesquisaAdm";
import PesquisaTI from "./pages/pesquisas/PesquisaTI";
//import FrequenciaSalas from "./pages/adm/Frequencia";
import GestaoUsuarios from "./pages/adm/listarUsuarios";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
// import { RoleBasedRedirect } from "./components/RoleBaseRedirect";
// import { useEffect } from "react";
import { Navigate } from "react-router-dom";
function AppRoutes() {
  // const valuesLogin = localStorage.getItem("token")|| localStorage.getItem('@AgendamentoToken')
    
    
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* <Route path="/" element={
            valuesLogin?<RoleBasedRedirect/>
            : <Login/>
            } /> */}
   
          <Route path="/login" element={<Login />} />

          <Route element={<LayoutBase />}>
            <Route
              path="/listar-salas-docentes"
              element={<ListaSalasDocentes />}
            />
            <Route
              path="/listar-salas-tecnico"
              element={<ListaSalasTecnico />}
            />

            <Route path="/chamados-ti" element={<ChamadosTI />} />
            <Route path="/chamados" element={<ChamadosDocente />} />

            <Route path="/minhas-reservas" element={<MinhasReservas />} />
            <Route path="/dashboard-adm" element={<DashboardAdm />} />
            {/* <Route path="/criar-usuario" element={<CriarUsuario />} /> */}
            <Route path="/listar-usuarios" element={<GestaoUsuarios />} />
            {/* <Route path="/frequencia" element={<FrequenciaSalas />} /> */}


            <Route path="/calendario" element={<Calendario />} />
            <Route
              path="/reservas-solicitadas"
              element={<ReservasSolicitadas />}
            />

            <Route
              path="/pesquisa-docente"
              element={
                <ProtectedRoute allowedRoles={["docente"]}>
                  <PesquisaDocente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pesquisa-adm"
              element={
                <ProtectedRoute allowedRoles={["coordenador"]}>
                  <PesquisaAdm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pesquisa-ti"
              element={
                <ProtectedRoute allowedRoles={["tecnico"]}>
                  <PesquisaTI />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;
