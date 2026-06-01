import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ModalEditarDispositivo } from "../pages/tecnico/EditarDispositivo";
import { ModalCriarDispositivo } from "../pages/tecnico/CriarDispositivo";

interface Props {
  salaId: number;
  salaNome: string;
  onClose: () => void;
}

export function ModalGerenciarDispositivosSala({ salaId, salaNome, onClose }: Props) {
  const [dispositivos, setDispositivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const carregarDadosDaSala = async () => {
    try {
      setLoading(true);
      const response = await api.get<any>(`/inventarios`);
      const inventarioDaSala = response.data.find((inv: any) => inv.salaId === salaId);
      
      setDispositivos(inventarioDaSala?.dispositivos || []);
    } catch (error) {
      console.error("Erro ao carregar dispositivos da sala", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o dispositivo "${nome}"?`)) {
      try {
        await api.delete(`dispositivos/delete-device/${id}`);
        carregarDadosDaSala();
      } catch (error) {
        alert("Erro ao excluir dispositivo.");
      }
    }
  };

  useEffect(() => {
    carregarDadosDaSala();
  }, [salaId]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ATIVO": return "bg-green-100 text-green-700 border-green-200";
      case "DANIFICADO": return "bg-red-100 text-red-700 border-red-200";
      case "MANUTENCAO": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="modal-overlay sub-modal-overlay px-4">
      <div className="modal-content !max-w-4xl !p-4 sm:!p-8 animate-fadeIn w-full">
        {/* Header do Modal */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="modal-title !mb-1 !text-2xl sm:!text-3xl">Gestão de Dispositivos</h2>
            <p className="text-sm text-gray-500 font-['Inter']">Sala: <span className="font-bold text-[#005C6D]">{salaNome}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-2xl text-gray-400">✕</button>
        </div>

        {/* Botão de Ação */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button 
            onClick={() => setShowCreate(true)}
            className="w-full sm:w-auto bg-[#B20000] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-800 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <span>+</span> Novo Dispositivo
          </button>
          
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest w-full sm:w-auto text-center sm:text-left">
            {dispositivos.length} Itens encontrados
          </div>
        </div>

        {/* Tabela de Dispositivos - Com ROLAGEM HORIZONTAL para mobile */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm w-full">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-bold text-[#004A61] uppercase">Dispositivo</th>
                <th className="p-4 text-xs font-bold text-[#004A61] uppercase">Patrimônio</th>
                <th className="p-4 text-xs font-bold text-[#004A61] uppercase">Tipo</th>
                <th className="p-4 text-xs font-bold text-[#004A61] uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-[#004A61] uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">Carregando dispositivos...</td></tr>
              ) : dispositivos.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">Nenhum dispositivo vinculado a esta sala.</td></tr>
              ) : (
                dispositivos.map((d) => (
                  <tr key={d.idDispositivo} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-none">
                    <td className="p-4 font-bold text-gray-700 whitespace-nowrap">{d.nomeDispositivo}</td>
                    <td className="p-4 font-mono text-sm text-[#B20000]">{d.patrimonio || "---"}</td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{d.tipoDispositivo}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(d.statusDispositivo)}`}>
                        {d.statusDispositivo}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button 
                        onClick={() => setEditandoId(d.idDispositivo)}
                        className="bg-[#005C6D]/10 text-[#005C6D] px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-[#005C6D] hover:text-white transition-all"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(d.idDispositivo, d.nomeDispositivo)}
                        className="bg-red-100 text-[#B20000] px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modais de Suporte */}
        {editandoId && (
          <ModalEditarDispositivo 
            dispositivoId={editandoId} 
            dispositivoData={dispositivos.find((d: any) => d.idDispositivo === editandoId)}
            salaAtualId={salaId}
            onClose={() => setEditandoId(null)} 
            onSuccess={() => { setEditandoId(null); carregarDadosDaSala(); }}
          />
        )}

        {showCreate && (
          <ModalCriarDispositivo 
            onClose={() => setShowCreate(false)} 
            onSuccess={() => { setShowCreate(false); carregarDadosDaSala(); }}
          />
        )}
      </div>
    </div>
  );
}