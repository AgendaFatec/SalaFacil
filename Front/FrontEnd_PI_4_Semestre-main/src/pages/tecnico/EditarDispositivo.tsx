import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import type {
  Dispositivo,
  DispositvoTipo,
  StatusDispositivo,
} from "../../interfaces/deviceInterface";

type SalaOption = {
  id: number;
  nome: string;
};

type TecnologiaOption = {
  idTecnologia: number;
  nomeTecnologia: string;
};

interface ModalProps {
  dispositivoId: number;
  dispositivoData?: any;
  salaAtualId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalEditarDispositivo({
  dispositivoId,
  dispositivoData,
  salaAtualId,
  onClose,
  onSuccess,
}: ModalProps) {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  const [salas, setSalas] = useState<SalaOption[]>([]);
  const [tecnologiasDisponiveis, setTecnologiasDisponiveis] = useState<TecnologiaOption[]>([]);

  const [salaId, setSalaId] = useState<number | null>(null);
  const [tecnologiasSelecionadas, setTecsSelecionadas] = useState<number[]>([]);

  const [dadosOriginais, setDadosOriginais] = useState<Dispositivo | null>(null);

  const [formData, setFormData] = useState({
    nomeDispositivo: "",
    tipoDispositivo: "NOTEBOOK" as DispositvoTipo,
    patrimonio: "",
    statusDispositivo: "ATIVO" as StatusDispositivo,
  });

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setLoading(true);
        
        let d = dispositivoData;
        
        if (!d) {
          const resDisp = await api.get<any>(`dispositivos/get-device/${dispositivoId}`);
          d = resDisp.data;
          if (d?.data) d = d.data;
          if (d?.dispositivo) d = d.dispositivo;
          if (Array.isArray(d)) d = d[0];
        }
        
        const resSalas = await api.get<any>("/inventarios");
        const rawSalas = Array.isArray(resSalas.data) ? resSalas.data : (resSalas.data?.data || []);
        
        const resTecs = await api.get<any>("/tecnologias");
        const listaTecnologias = resTecs.data || [];
        setTecnologiasDisponiveis(listaTecnologias);

        if (d) {
          setDadosOriginais(d);
          setFormData({
            nomeDispositivo: d.nomeDispositivo || "",
            tipoDispositivo: d.tipoDispositivo || "NOTEBOOK",
            patrimonio: d.patrimonio || "",
            statusDispositivo: d.statusDispositivo || "ATIVO",
          });
        }

        const salaAtual = rawSalas.find((inv: any) => 
          inv.salaId === salaAtualId || inv.dispositivos.some((item: any) => item.idDispositivo === dispositivoId)
        );

        if (salaAtual) {
          setSalaId(salaAtual.salaId);
          setTecsSelecionadas(salaAtual.tecnologias.map((t: any) => t.idTecnologia));
        }

        const salasUnicas = rawSalas.map((item: any) => ({
          id: item.salaId,
          nome: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
        })).filter((v: any, i: number, a: any[]) => a.findIndex(t => t.id === v.id) === i);
        
        setSalas(salasUnicas);

      } catch (error) {
        console.error("Erro ao carregar modal:", error);
        alert("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    carregarDadosIniciais();
  }, [dispositivoId]);

  const toggleTecnologia = (id: number) => {
    setTecsSelecionadas(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salaId) return alert("Selecione uma sala.");

    setSalvando(true);
    try {
      const payload = {
        dispositivo: {
          idDispositivo: dispositivoId, 
          nomeDispositivo: formData.nomeDispositivo,
          tipoDispositivo: formData.tipoDispositivo,
          patrimonio: formData.patrimonio,
          statusDispositivo: formData.statusDispositivo,
        },
        inventario: {
          type: "update",
          data: {
            salaId: salaId,
            tecnologiaIds: tecnologiasSelecionadas, 
          },
        },
      };

      await api.post("/dispositivos/atualizar-inventario", payload);
      alert("Dispositivo e Sala atualizados com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.msg || "Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modificado para p-5 no celular e p-8 no PC */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004A61]">Editar Detalhes</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
          </div>

          {loading ? (
            <div className="py-10 text-center">Carregando...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Nome do Dispositivo</label>
                <input
                  type="text" required
                  placeholder={dadosOriginais?.nomeDispositivo || 'N/D'}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.nomeDispositivo}
                  onChange={(e) => setFormData({ ...formData, nomeDispositivo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Patrimônio</label>
                  <input
                    type="text" maxLength={7}
                    placeholder={dadosOriginais?.patrimonio || "Sem patrimônio"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none"
                    value={formData.patrimonio}
                    onChange={(e) => setFormData({ ...formData, patrimonio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Sala Atual</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                    value={salaId ?? ""}
                    onChange={(e) => setSalaId(Number(e.target.value))}
                  >
                    {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                    value={formData.statusDispositivo}
                    onChange={(e) => setFormData({ ...formData, statusDispositivo: e.target.value as any })}
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="DANIFICADO">Danificado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-2">Softwares / Tecnologias da Sala</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50">
                  {tecnologiasDisponiveis.map(tec => (
                    <button
                      key={tec.idTecnologia}
                      type="button"
                      onClick={() => toggleTecnologia(tec.idTecnologia)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                        tecnologiasSelecionadas.includes(tec.idTecnologia)
                          ? "bg-[#004A61] text-white border-[#004A61]"
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {tec.nomeTecnologia}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modificado: botões empilhados no celular, um lado do outro no PC */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold border border-gray-200 sm:border-transparent hover:bg-gray-50 rounded-xl transition-all">Cancelar</button>
                <button
                  type="submit" disabled={salvando}
                  className="flex-1 py-3 bg-[#004A61] text-white font-bold rounded-xl hover:bg-[#003546] shadow-lg disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}