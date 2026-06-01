import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePesquisaBadge } from "../../hooks/usePesquisaBadge";
import PesquisaSatisfacao from "../../PesquisaSatisfacao";

export default function PesquisaAdm() {
  const { userRole } = useAuth();
  const { marcarComoVisualizada } = usePesquisaBadge();

  useEffect(() => {
    // Marca a pesquisa como visualizada quando a página é acessada
    marcarComoVisualizada();
  }, [marcarComoVisualizada]);

  // Protegida apenas visualmente - o redirecionamento acontece nas rotas
  if (userRole !== "coordenador") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#B20000] mb-4">
            Acesso Não Autorizado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta pesquisa.
          </p>
        </div>
      </div>
    );
  }

  return <PesquisaSatisfacao profileType="coordenador" />;
}
