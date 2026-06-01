import { useMemo, useState, useEffect, useCallback } from "react";
import iconeEngrenagem from "../../assets/Engrenagem_FATEC.png";
import { ApiService } from "../../services/api";

type StatusChamado = "ABERTO" | "EM_ATENDIMENTO" | "RESOLVIDO";
type TipoChamado = "Problema técnico" | "Instalação de tecnologia";

type TecnologiaSolicitada = {
  nome: string;
  versao: string;
};

type Maquina = {
  id: number;
  nome: string;
  patrimonio?: string;
};

type SalaDb = {
  id: number;
  nome: string;
  maquinas: Maquina[];
};

type Chamado = {
  idChamada: number;
  sala: {
    idSala: number;
    nomeSala: string;
  };
  status: StatusChamado;
  tipoProblema: "Hardware" | "Software";
  dispositivoNome?: string;
  patrimonio?: string;
  descricao?: string;
  tecnologias?: { nome: string; versao: string }[];
  imagens?: string[];
  dataChamada: string;
};

const statusLabel: Record<StatusChamado, string> = {
  ABERTO: "Pendente",
  EM_ATENDIMENTO: "Em análise",
  RESOLVIDO: "Resolvido",
};

const styles = `
  * { box-sizing: border-box; }

  .chamados-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
    position: relative;
  }

  .header-salas { margin-bottom: 20px; margin-top: 40px; }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-bottom: 26px;
  }

  .btn-reservar {
    height: 42px;
    padding: 0 18px;
    border: none;
    border-radius: 8px;
    background: #005c6d;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  }
  .btn-reservar:hover { filter: brightness(0.96); }

  .filters-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .filter-label { font-size: 14px; font-weight: 600; color: #6f6f6f; line-height: 1; }
  .filters-container { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .filter-btn {
    min-width: 112px;
    height: 42px;
    padding: 0 22px;
    border-radius: 18px;
    border: 2px solid #c89b9b;
    background: #ffffff;
    color: #2f3b44;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: none;
  }
  .filter-btn:hover { border-color: #b20000; color: #b20000; }
  .filter-btn.active { background: #c40000; color: #ffffff; border-color: #c40000; }

  .reservas-grid {
    display: grid;
    grid-template-columns: 1fr; 
    gap: 22px;
    align-items: start;
  }

  @media (min-width: 640px) { .reservas-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .reservas-grid { grid-template-columns: repeat(3, 1fr); } }

  .reserva-card {
    background: #ffffff;
    border: 2px solid #979797;
    border-radius: 16px;
    padding: 18px 16px 16px;
    min-height: 188px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .reserva-subtitle { margin: 0 0 6px; font-size: 14px; color: #7a7a7a; font-weight: 500; }
  .sala-nome-card {
    margin: 0 0 8px;
    padding-left: 10px;
    border-left: 4px solid #73a28c;
    font-family: 'Roboto Slab', serif;
    font-size: 20px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1.2;
  }

  .status-line { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px; }
  .card-info-line { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 8px; font-size: 14px; color: #666666; }
  .text-label { font-weight: 700; color: #7a7a7a; min-width: 80px; }

  .pill {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 24px; padding: 4px 12px; border-radius: 999px;
    font-size: 12px; font-weight: 700; line-height: 1; white-space: nowrap;
  }
  .pill-gray { background: #7a7a7a; color: #ffffff; font-size: 11px; min-height: 22px; padding: 4px 10px; }
  .pill-pendente { background: #f2cf27; color: #ffffff; }
  .pill-analise { background: #2783d9; color: #ffffff; }
  .pill-resolvido { background: #32d267; color: #ffffff; }

  .empty-state { color: #7a7a7a; font-size: 15px; margin-top: 8px; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.42);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 48px 20px; z-index: 999; overflow-y: auto;
  }
  .modal-content {
    width: 100%; max-width: 540px; background: #ffffff; border-radius: 18px;
    padding: 22px 22px 20px; position: relative; box-shadow: 0 14px 38px rgba(0, 0, 0, 0.18);
  }
  .modal-close {
    position: absolute; top: 14px; right: 16px; border: none; background: transparent;
    color: #7a7a7a; font-size: 18px; cursor: pointer; line-height: 1;
  }
  .modal-header-line { border-left: 4px solid #73a28c; padding-left: 10px; margin-bottom: 18px; }
  .modal-title { margin: 0; font-family: 'Roboto Slab', serif; font-size: 22px; font-weight: 700; color: #005c6d; line-height: 1.2; }
  .modal-body { display: flex; flex-direction: column; gap: 14px; }
  .modal-label { font-size: 13px; font-weight: 700; color: #5e5e5e; margin-bottom: 6px; }
  .modal-info-text { font-size: 12px; color: #7a7a7a; font-style: italic; margin-top: -4px; margin-bottom: 6px; }

  .input, .textarea, .select {
    width: 100%; border: 2px solid #d7d7d7; border-radius: 10px; background: #ffffff;
    font-family: 'Inter', sans-serif; font-size: 14px; color: #3b3d41; outline: none;
  }
  .input, .select { height: 40px; padding: 0 12px; }
  .textarea { min-height: 92px; resize: vertical; padding: 12px; }
  
  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 18px; }
  .btn-modal { min-width: 150px; height: 38px; padding: 0 16px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; }
  .btn-modal-light { background: #ffffff; color: #6b6b6b; border: 1px solid #dfdfdf; }
  .btn-modal-primary { background: #b20000; color: #ffffff; border: none; }

  .upload-box {
    border: 1px dashed #d7d7d7; border-radius: 10px; padding: 16px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; text-align: center; background: #fafafa;
  }
  .upload-box input { display: none; }
  .upload-box strong { color: #b20000; font-size: 12px; margin-top: 4px; }
  .upload-box small { color: #7a7a7a; font-size: 11px; }

  .tabela-tecnologias { border: 1px solid #d7d7d7; border-radius: 10px; overflow: hidden; }
  .tabela-header, .tabela-linha { display: grid; grid-template-columns: 1fr 1fr; padding: 10px 12px; font-size: 13px; }
  .tabela-header { background: #f0f0f0; font-weight: 700; color: #5e5e5e; }
  .tabela-linha { border-top: 1px solid #d7d7d7; }
  .btn-adicionar-lista { background: #005c6d; color: white; border: none; border-radius: 8px; padding: 8px; font-size: 12px; font-weight: 700; cursor: pointer; margin-top: 8px; width: 100%; }

  .textarea-readonly {
    background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;
    padding: 10px; font-size: 13px; width: 100%; min-height: 60px; resize: none; color: #666;
  }

  @media (max-width: 768px) {
    .chamados-page { padding: 24px 16px 40px; }
    .title-salas { font-size: 42px !important; }
    .header-icon { width: 40px; height: 40px; }
    .top-actions { gap: 12px; }
    .row-2 { grid-template-columns: 1fr; }
    .modal-content { padding: 20px 16px 18px; }
    .modal-footer { flex-direction: column; align-items: stretch; }
    .btn-modal { width: 100%; min-width: 0; }
  }
`;

export default function ChamadosDocente() {
  const api = ApiService.getInstance();
  const [filtro, setFiltro] = useState<"todos" | StatusChamado>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados Base de Dados
  const [salasDb, setSalasDb] = useState<SalaDb[]>([]);
  const [chamados, setChamados] = useState<Chamado[]>([]);

  // Formulário
  const [salaId, setSalaId] = useState<number | null>(null);
  const [tipoChamado, setTipoChamado] = useState<TipoChamado>("Problema técnico");
  const [descricao, setDescricao] = useState("");

  // Hardware Form
  const [dispositivoSelecionadoId, setDispositivoSelecionadoId] = useState<number | "outro">("outro");
  const [dispositivoOutroNome, setDispositivoOutroNome] = useState("");
  const [patrimonioOutro, setPatrimonioOutro] = useState("");

  // Software Form
  const [nomeTecnologia, setNomeTecnologia] = useState("");
  const [versaoTecnologia, setVersaoTecnologia] = useState("");
  const [listaTecnologias, setListaTecnologias] = useState<TecnologiaSolicitada[]>([]);

  // Carregar as Salas do Banco de Dados
  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const response = await api.get<any>("/inventarios");
        let arrayDeSalas = Array.isArray(response.data) ? response.data : (response.data?.data || []);

        const salasFormatadas = arrayDeSalas.map((item: any) => ({
          id: item.salaId,
          nome: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
          maquinas: Array.isArray(item.dispositivos) ? item.dispositivos.map((d: any) => ({
            id: d.idDispositivo || d.dispositivo?.idDispositivo,
            nome: d.nomeDispositivo || d.dispositivo?.nomeDispositivo || "Dispositivo",
            patrimonio: d.patrimonio || d.dispositivo?.patrimonio,
          })) : [],
        }));

        setSalasDb(salasFormatadas);
        if (salasFormatadas.length > 0) {
          setSalaId(salasFormatadas[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar salas do banco:", error);
      }
    };
    carregarSalas();
  }, []);

  const buscarChamados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const url = filtro === "todos" ? "/chamados/meus-chamados" : `/chamados/meus-chamados?status=${filtro}`;
      const dados = await api.get<Chamado[]>(url);

      setChamados(dados || []);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
      setErro("Erro ao buscar chamados. Tente novamente.");
      setChamados([]);
    } finally {
      setCarregando(false);
    }
  }, [filtro, api]);

  useEffect(() => {
    buscarChamados();
  }, [buscarChamados]);

  const chamadosFiltrados = useMemo(() => chamados, [chamados]);

  // Auxiliares para o Modal Dinâmico
  const salaSelecionada = useMemo(() => salasDb.find(s => s.id === salaId), [salasDb, salaId]);
  const maquinasDaSala = salaSelecionada?.maquinas || [];

  function limparFormulario() {
    if (salasDb.length > 0) setSalaId(salasDb[0].id);
    setTipoChamado("Problema técnico");
    setDispositivoSelecionadoId("outro");
    setDispositivoOutroNome("");
    setPatrimonioOutro("");
    setDescricao("");
    setNomeTecnologia("");
    setVersaoTecnologia("");
    setListaTecnologias([]);
  }

  function adicionarTecnologia() {
    if (!nomeTecnologia.trim() || !versaoTecnologia.trim()) return;

    setListaTecnologias((lista) => [
      ...lista,
      {
        nome: nomeTecnologia.trim(),
        versao: versaoTecnologia.trim(),
      },
    ]);

    setNomeTecnologia("");
    setVersaoTecnologia("");
  }

async function abrirChamado() {
    try {
      const usuarioId = await api.getUsuarioLogadoId();
      if (usuarioId == null) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      if (!salaId) {
        alert("Nenhuma sala selecionada.");
        return;
      }

      if (tipoChamado === "Problema técnico") {
        let dispositivoNomeFinal = "";
        let patrimonioFinal = "";

        if (dispositivoSelecionadoId === "outro") {
          if (!dispositivoOutroNome.trim()) {
            alert("Preencha o nome do dispositivo.");
            return;
          }
          dispositivoNomeFinal = dispositivoOutroNome.trim();
          patrimonioFinal = patrimonioOutro.trim();
        } else {
          const maquina = maquinasDaSala.find(m => m.id === dispositivoSelecionadoId);
          dispositivoNomeFinal = maquina?.nome || "Dispositivo";
          patrimonioFinal = maquina?.patrimonio || "";
        }

        if (!descricao.trim()) {
          alert("Preencha a descrição do problema.");
          return;
        }

        const payload = {
          salaId,
          usuarioId,
          tipoProblema: "Hardware",
          dispositivo: dispositivoNomeFinal,
          patrimonio: patrimonioFinal,
          descricao: descricao.trim(),
        };

        await api.post("/chamados", payload);
        await buscarChamados();

        setModalAberto(false);
        limparFormulario();
        alert("Chamado criado com sucesso!");
      }

      if (tipoChamado === "Instalação de tecnologia") {
        if (listaTecnologias.length === 0) {
          alert("Adicione pelo menos uma tecnologia à lista.");
          return;
        }

        const payload = {
          salaId,
          usuarioId,
          tipoProblema: "Software",
          descricao: descricao.trim() || "Solicitação de Instalação",
          tecnologias: listaTecnologias,
        };

        await api.post("/chamados", payload);
        await buscarChamados();

        setModalAberto(false);
        limparFormulario();
        alert("Chamado criado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      alert("Erro ao criar chamado. Tente novamente.");
    }
  }

  const getStatusClass = (status: StatusChamado) => {
    const map = {
      ABERTO: "pill-pendente",
      EM_ATENDIMENTO: "pill-analise",
      RESOLVIDO: "pill-resolvido"
    };
    return map[status] || "pill-gray";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="chamados-page">
        
        <header className="header-salas">
          <div className="flex items-center gap-4">
            <img src={iconeEngrenagem} className="w-12 h-12" alt="Engrenagem" />
            <h1 className="text-4xl md:text-6xl font-bold text-[#005c6d] font-['Roboto_Slab'] title-salas" style={{ fontSize: '64px' }}>Chamados de TI</h1>
          </div>
          <div className="mt-4 h-2 w-40 bg-[#b20000] rounded-full"></div>
        </header>

        <div className="top-actions">
          <button className="btn-reservar" onClick={() => setModalAberto(true)}>
            + Novo chamado
          </button>
          <div className="filters-bar">
            <span className="filter-label">Status:</span>
            <div className="filters-container">
              <button
                className={`filter-btn ${filtro === "todos" ? "active" : ""}`}
                onClick={() => setFiltro("todos")}
              >
                Todos
              </button>

              <button
                className={`filter-btn ${filtro === "ABERTO" ? "active" : ""}`}
                onClick={() => setFiltro("ABERTO")}
              >
                Pendentes
              </button>

              <button
                className={`filter-btn ${filtro === "EM_ATENDIMENTO" ? "active" : ""}`}
                onClick={() => setFiltro("EM_ATENDIMENTO")}
              >
                Em análise
              </button>

              <button
                className={`filter-btn ${filtro === "RESOLVIDO" ? "active" : ""}`}
                onClick={() => setFiltro("RESOLVIDO")}
              >
                Resolvidos
              </button>
            </div>
          </div>
        </div>

        {carregando && <p className="empty-state">Carregando chamados...</p>}
        {erro && <p className="empty-state" style={{ color: '#b20000' }}>{erro}</p>}
        {!carregando && chamadosFiltrados.length === 0 && (
          <p className="empty-state">Nenhum chamado encontrado para esse filtro.</p>
        )}

        <div className="reservas-grid">
          {chamadosFiltrados.map((chamado) => (
            <div key={chamado.idChamada} className="reserva-card">
              <p className="reserva-subtitle">Chamado n° {chamado.idChamada}</p>
              
              <h2 className="sala-nome-card">{chamado.sala?.nomeSala || "Sala não definida"}</h2>

              <div className="status-line">
                <span className="text-label">Status:</span>
                <span className={`pill ${getStatusClass(chamado.status)}`}>
                  {statusLabel[chamado.status]}
                </span>
              </div>

              <div className="card-info-line">
                <span className="text-label">Tipo:</span>
                <span className="pill pill-gray">{chamado.tipoProblema}</span>
              </div>

              {chamado.tipoProblema === "Hardware" && (
                <>
                  {chamado.dispositivoNome && (
                    <div className="card-info-line">
                      <span className="text-label">Dispositivo:</span>
                      <span className="pill pill-gray">{chamado.dispositivoNome}</span>
                    </div>
                  )}
                  {chamado.patrimonio && (
                    <div className="card-info-line">
                      <span className="text-label">Patrimônio:</span>
                      <span className="pill pill-gray">{chamado.patrimonio}</span>
                    </div>
                  )}
                  <div className="card-info-line">
                    <span className="text-label">Data:</span>
                    <span className="pill pill-gray">{new Date(chamado.dataChamada).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {chamado.descricao && (
                    <div className="card-info-line" style={{ flexDirection: 'column' }}>
                      <span className="text-label">Descrição:</span>
                      <textarea readOnly value={chamado.descricao} className="textarea-readonly" />
                    </div>
                  )}
                </>
              )}

              {chamado.tipoProblema === "Software" && (
                <>
                  <div className="card-info-line">
                    <span className="text-label">Data:</span>
                    <span className="pill pill-gray">{new Date(chamado.dataChamada).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {chamado.tecnologias && chamado.tecnologias.length > 0 && (
                    <div className="card-info-line" style={{ flexDirection: 'column' }}>
                      <span className="text-label">Tecnologias:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {chamado.tecnologias.map((tec, index) => (
                          <span key={`${chamado.idChamada}-tec-${index}`} className="pill pill-gray">
                            {tec.nome} {tec.versao}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          ))}
        </div>

        {modalAberto && (
          <div className="modal-overlay" onClick={() => { setModalAberto(false); limparFormulario(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => { setModalAberto(false); limparFormulario(); }}>
                ×
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Abrir chamado</h2>
              </div>

              <div className="modal-body">
                <div>
                  <div className="modal-label">Identificação da sala:</div>
                  <select
                    className="select"
                    value={salaId ?? ""}
                    onChange={(e) => {
                      setSalaId(Number(e.target.value));
                      setDispositivoSelecionadoId("outro"); // Reseta dispositivo ao trocar de sala
                    }}
                  >
                    {salasDb.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        {sala.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="modal-label">Qual o tipo de chamado?</div>
                  <select
                    className="select"
                    value={tipoChamado}
                    onChange={(e) => setTipoChamado(e.target.value as TipoChamado)}
                  >
                    <option>Problema técnico</option>
                    <option>Instalação de tecnologia</option>
                  </select>
                </div>

                {tipoChamado === "Problema técnico" && (
                  <>
                    <div>
                      <div className="modal-label">Qual dispositivo está com problema?</div>
                      <select
                        className="select"
                        value={dispositivoSelecionadoId}
                        onChange={(e) => setDispositivoSelecionadoId(e.target.value === "outro" ? "outro" : Number(e.target.value))}
                      >
                        {maquinasDaSala.length === 0 && <option value="outro" disabled>Nenhum dispositivo cadastrado nesta sala</option>}
                        
                        {maquinasDaSala.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nome} {m.patrimonio ? `(Pat: ${m.patrimonio})` : ""}
                          </option>
                        ))}
                        <option value="outro">Outro (Não listado)</option>
                      </select>
                    </div>

                    {dispositivoSelecionadoId === "outro" && (
                      <div className="row-2">
                        <div>
                          <div className="modal-label">Nome do dispositivo:</div>
                          <input
                            className="input"
                            value={dispositivoOutroNome}
                            onChange={(e) => setDispositivoOutroNome(e.target.value)}
                            placeholder="Ex: Desktop"
                          />
                        </div>
                        <div>
                          <div className="modal-label">Patrimônio <span style={{color: '#7a7a7a', fontWeight: 500}}>(Opcional)</span>:</div>
                          <input
                            className="input"
                            value={patrimonioOutro}
                            onChange={(e) => setPatrimonioOutro(e.target.value)}
                            placeholder="Ex: 1234567"
                            maxLength={7}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="modal-label">Descrição do problema:</div>
                      <textarea
                        className="textarea"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {tipoChamado === "Instalação de tecnologia" && (
                  <>
                    <div className="row-2">
                      <div>
                        <div className="modal-label">Nome da tecnologia:</div>
                        <input
                          className="input"
                          value={nomeTecnologia}
                          onChange={(e) => setNomeTecnologia(e.target.value)}
                          placeholder="Ex: Node"
                        />
                      </div>

                      <div>
                        <div className="modal-label">Versão:</div>
                        <input
                          className="input"
                          value={versaoTecnologia}
                          onChange={(e) => setVersaoTecnologia(e.target.value)}
                          placeholder="Ex: 1.0"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-adicionar-lista"
                      onClick={adicionarTecnologia}
                    >
                      + Adicionar à lista
                    </button>

                    {listaTecnologias.length > 0 && (
                      <div>
                        <div className="modal-label mt-2">Lista de solicitações:</div>
                        <div className="tabela-tecnologias">
                          <div className="tabela-header">
                            <span>Nome</span>
                            <span>Versão</span>
                          </div>
                          {listaTecnologias.map((tecnologia, index) => (
                            <div className="tabela-linha" key={index}>
                              <span>{tecnologia.nome}</span>
                              <span>{tecnologia.versao}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="modal-label" style={{marginTop: '12px'}}>Detalhes adicionais <span style={{ color: '#7a7a7a', fontWeight: 500 }}>(Opcional):</span></div>
                      <textarea
                        className="textarea"
                        style={{minHeight: '60px'}}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Ex: Necessário para as aulas da disciplina X..."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn-modal btn-modal-light"
                  onClick={() => {
                    setModalAberto(false);
                    limparFormulario();
                  }}
                >
                  Cancelar
                </button>
                <button className="btn-modal btn-modal-primary" onClick={abrirChamado}>
                  Abrir chamado
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}