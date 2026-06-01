import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export const RoleBasedRedirect = () => {
  const { userRole, isLoading } = useAuth();

  if (isLoading) return null; 

  if (!userRole) return <Navigate to="/login" replace />;

  const routes: Record<string, string> = {
    tecnico: "/listar-salas-tecnico",
    coordenador: "/reservas-solicitadas",
    docente: "/listar-salas-docentes",
  };

  return <Navigate to={routes[userRole] || "/login"} replace />;
};