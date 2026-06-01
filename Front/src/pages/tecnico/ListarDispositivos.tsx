import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Dispositivo } from "../../interfaces/deviceInterface";

import { ModalEditarDispositivo } from "./EditarDispositivo"; // Ajuste o caminho se necessário
import { ModalCriarDispositivo } from "./CriarDispositivo";
const dispositivoApi = {
  listar: async (params: { busca?: string; tipo?: string }) => {
    return await api.get<{ data: Dispositivo[]; total: number }>(
      "dispositivos/list-devices",
      { params },
    );
  },
  deletar: async (id: number) => {
    return await api.delete(`dispositivos/delete-device/${id}`);
  },
};

export default function TelaDispositivos() {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispositivoApi.listar({ busca });
      setDispositivos(response.data);
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [busca]);

  const handleExcluir = async (id: number, nome: string) => {
    if (
      window.confirm(`Tem certeza que deseja excluir o dispositivo "${nome}"?`)
    ) {
      try {
        await dispositivoApi.deletar(id);
        fetchData(); // Atualiza a lista após deletar
      } catch (error) {
        alert("Erro ao excluir dispositivo.");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {/* Cabeçalho Estilizado (Figma Style) */}
      <header className="mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-[#004A61] p-3 rounded-xl shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#004A61] tracking-tight">
            Dispositivos
          </h1>
        </div>
        <div className="w-full max-w-[400px] h-1.5 bg-[#B20000] mt-3 rounded-full"></div>
      </header>

      {/* Barra de Ferramentas: Busca e Botão Novo */}
      <section className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:max-w-xl">
          <input
            type="text"
            placeholder="Pesquise por nome ou patrimônio..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#B20000] outline-none transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div className="absolute left-4 top-3.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#B20000] hover:bg-red-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2"
        >
          <span>+</span> Novo Dispositivo
        </button>

        {/* <button 
          onClick={() => navigate('/cadastrar-dispositivo')}
          className="bg-[#B20000] hover:bg-red-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2"
        >
          <span>+</span> Novo Dispositivo
        </button> */}
      </section>

      {/* Grid de Cards ou Loading */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
          <p className="text-[#004A61] font-medium">
            Carregando dispositivos...
          </p>
        </div>
      ) : (
        <>
          {dispositivos.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">
                Nenhum dispositivo encontrado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dispositivos.map((disp) => (
                <article
                  key={disp.idDispositivo}
                  className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
                >
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#B20000] uppercase tracking-widest mb-1">
                          {disp.tipoDispositivo}
                        </span>
                        <h3 className="text-2xl font-bold text-[#004A61] leading-tight group-hover:text-[#B20000] transition-colors">
                          {disp.nomeDispositivo}
                        </h3>
                      </div>
                      <div
                        className={`h-3 w-3 rounded-full shadow-sm ${
                          disp.statusDispositivo === "ATIVO"
                            ? "bg-green-500 animate-pulse"
                            : disp.statusDispositivo === "DANIFICADO"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                        title={disp.statusDispositivo}
                      ></div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-bold px-2 py-1 bg-gray-100 rounded-md text-[#004A61]">
                          ID:
                        </span>
                        <span>{disp.idDispositivo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-bold px-2 py-1 bg-gray-100 rounded-md text-[#004A61]">
                          Patrimônio:
                        </span>
                        <span className="font-mono bg-red-50 px-2 py-0.5 rounded text-[#B20000]">
                          {disp.patrimonio || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditandoId(disp.idDispositivo)}
                        className="flex-1 bg-[#005F73] hover:bg-[#004A61] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm"
                      >
                        Editar detalhes
                      </button>
                      <button
                        onClick={() =>
                          handleExcluir(
                            disp.idDispositivo,
                            disp.nomeDispositivo,
                          )
                        }
                        className="p-3 bg-red-50 text-[#B20000] hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* Renderização do Modal de Edição */}
      {editandoId !== null && (
        <ModalEditarDispositivo
          dispositivoId={editandoId}
          onClose={() => setEditandoId(null)}
          onSuccess={() => {
            setEditandoId(null);
            fetchData(); // Recarrega a lista para mostrar os novos dados
          }}
        />
      )}
      {showCreateModal && (
        <ModalCriarDispositivo
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
