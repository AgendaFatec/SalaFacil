import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import type {
  DispositvoTipo,
  StatusDispositivo,
} from "../../interfaces/deviceInterface";

interface ModalCriarProps {
  onClose: () => void;
  onSuccess: () => void;
}

type SalaOption = {
  id: number;
  nome: string;
};

type TecnologiaOption = {
  idTecnologia: number;
  nomeTecnologia: string;
};

type InventarioRaw = {
  salaId: number;
  salaNome?: string;
  sala?: {
    nomeSala?: string;
  };
};

type InventariosResponse = {
  data?: InventarioRaw[] | { data?: InventarioRaw[] };
};

type ApiError = {
  response?: {
    data?: {
      msg?: string;
    };
  };
};

export function ModalCriarDispositivo({ onClose, onSuccess }: ModalCriarProps) {
  const [salvando, setSalvando] = useState(false);
  const [, setLoading] = useState(false);

  const [salas, setSalas] = useState<SalaOption[]>([]);
  const [tecnologiasDisponiveis, setTecnologiasDisponiveis] = useState<
    TecnologiaOption[]
  >([]);

  const [tipoInventario, setTipoInventario] = useState<"create" | "update">(
    "create",
  );
  const [salaId, setSalaId] = useState<number | null>(null);
  const [tecnologiasSelecionadas, setTecsSelecionadas] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    nomeDispositivo: "",
    tipoDispositivo: "NOTEBOOK" as DispositvoTipo,
    patrimonio: "",
    statusDispositivo: "ATIVO" as StatusDispositivo,
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resSalas = await api.get<InventariosResponse>("/inventarios");
        const rawSalas = Array.isArray(resSalas.data)
          ? resSalas.data
          : resSalas.data?.data || [];

        const salasUnicas = rawSalas
          .map((item: InventarioRaw) => ({
            id: item.salaId,
            nome: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
          }))
          .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

        setSalas(salasUnicas);

        const tecnologias = await api.get<TecnologiaOption[]>("/tecnologias");

        if (Array.isArray(tecnologias)) {
          setTecnologiasDisponiveis(tecnologias);
        } else if (tecnologias && (tecnologias as any).data) {
          setTecnologiasDisponiveis((tecnologias as any).data);
        } else {
          setTecnologiasDisponiveis([]);
        }
      } catch (error: unknown) {
        console.error("Erro ao carregar dados do modal:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const toggleTecnologia = (id: number) => {
    setTecsSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!salaId) {
      alert("Selecione uma sala para associar o inventário.");
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        dispositivo: {
          nomeDispositivo: formData.nomeDispositivo,
          tipoDispositivo: formData.tipoDispositivo,
          patrimonio: formData.patrimonio,
          statusDispositivo: formData.statusDispositivo,
        },
        inventario: {
          type: tipoInventario,
          data: {
            salaId,
            tecnologiaIds: tecnologiasSelecionadas, 
          },
        },
      };

      await api.post("/dispositivos/atualizar-inventario", payload);
      alert("Dispositivo cadastrado e vinculado com sucesso!");
      onSuccess();
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as ApiError;
      const msg =
        apiError.response?.data?.msg || "Erro ao salvar novo dispositivo.";
      alert(msg);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modificado para padding reduzido no celular */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004A61]">
              Novo Dispositivo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                Nome
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                value={formData.nomeDispositivo}
                onChange={(e) =>
                  setFormData({ ...formData, nomeDispositivo: e.target.value })
                }
              />
            </div>

            {/* Modificado: quebra para 1 coluna no celular */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                  Tipo
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.tipoDispositivo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoDispositivo: e.target.value as DispositvoTipo,
                    })
                  }
                >
                  <option value="NOTEBOOK">Notebook</option>
                  <option value="DESKTOP">Desktop</option>
                  <option value="TV">TV</option>
                  <option value="PROJETOR">Projetor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                  Patrimônio
                </label>
                <input
                  type="text"
                  maxLength={7}
                  placeholder="Ex: 123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.patrimonio}
                  onChange={(e) =>
                    setFormData({ ...formData, patrimonio: e.target.value })
                  }
                />
              </div>
            </div>

            <fieldset className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
              <legend className="px-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                Configuração de Inventário
              </legend>

              {/* Modificado: flex column no celular para não espremer os inputs */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoInv"
                    checked={tipoInventario === "create"}
                    onChange={() => setTipoInventario("create")}
                  />
                  <span className="text-xs font-medium text-[#004A61]">
                    Novo Inventário
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoInv"
                    checked={tipoInventario === "update"}
                    onChange={() => setTipoInventario("update")}
                  />
                  <span className="text-xs font-medium text-[#004A61]">
                    Usar Existente
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-[#004A61] mb-1">
                  Selecionar Sala
                </label>
                <select
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                  value={salaId ?? ""}
                  onChange={(e) => setSalaId(Number(e.target.value))}
                >
                  <option value="">Selecione...</option>
                  {salas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#004A61] mb-2">
                  Tecnologias na Sala
                </label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {Array.isArray(tecnologiasDisponiveis) && tecnologiasDisponiveis.map((tec) => (
                    <button
                      key={tec.idTecnologia}
                      type="button"
                      onClick={() => toggleTecnologia(tec.idTecnologia)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        tecnologiasSelecionadas.includes(tec.idTecnologia)
                          ? "bg-[#B20000] text-white border-[#B20000]"
                          : "bg-white text-gray-400 border-gray-200"
                      }`}
                    >
                      {tec.nomeTecnologia}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Modificado: Botões um embaixo do outro no mobile, lado a lado no PC */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-gray-500 font-bold border border-gray-200 sm:border-transparent hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 py-3 bg-[#004A61] text-white font-bold rounded-xl hover:bg-[#003546] shadow-lg disabled:opacity-50"
              >
                {salvando ? "Criando..." : "Cadastrar Dispositivo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}