import { useState, useMemo, useEffect, useRef } from "react";
import iconVerify from "../../assets/Verify_FATEC.png";
import iconData from "../../assets/data.svg";
import iconHorario from "../../assets/horario.svg";
import iconSeta from "../../assets/seta.svg";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ModalAbrirChamado } from "../../modals/ModalAbrirChamada";

type StatusReserva = "aprovado" | "pendente" | "cancelado" | "rejeitado";

type Reserva = {
  id: number;
  sala: string;
  data: string;
  horario: string;
  status: StatusReserva;
  motivo?: string;
};

type SalaDisponivel = {
  id: number;
  nome: string;
  dispositivos: { id?: number; nome: string; patrimonio?: string; numeroSerie?: string }[];
};

const traduzirStatusParaFront = (statusBanco: string): StatusReserva => {
  switch (statusBanco) {
    case "AGENDADO": return "aprovado";
    case "EM_ESPERA": return "pendente";
    case "CANCELADO": return "cancelado";
    default: return "rejeitado";
  }
};

const styles = `
  * {
    box-sizing: border-box;
  }

  .minhas-reservas-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
    position: relative;
  }

  .toast-mensagem {
    position: fixed; top: 20px; right: 20px; padding: 16px 24px;
    border-radius: 8px; color: white; font-weight: 600;
    z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out forwards;
  }
  .toast-mensagem.sucesso { background-color: #005C6D; }
  .toast-mensagem.erro { background-color: #B20000; }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .header-salas {
    margin-bottom: 20px;
    margin-top: 40px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-icon {
    width: 52px;
    height: 52px;
    object-fit: contain;
  }

  .title-salas {
    margin: 0;
    font-family: 'Roboto Slab', serif;
    font-size: 64px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1;
  }

  .header-line-wrap {
    margin-top: 14px;
    display: flex;
    align-items: center;
  }

  .header-line-main {
    width: 175px;
    height: 16px;
    border-radius: 999px;
    background: #b20000;
  }

  .header-line-tail {
    width: 200px;
    height: 3px;
    background: #b20000;
    margin-left: -6px;
    border-radius: 999px;
  }

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

  .btn-reservar:hover {
    filter: brightness(0.96);
  }

  .filters-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .filter-label {
    font-size: 14px;
    font-weight: 600;
    color: #6f6f6f;
    line-height: 1;
  }

  .filters-container {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

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

  .filter-btn:hover {
    border-color: #b20000;
    color: #b20000;
  }

  .filter-btn.active {
    background: #c40000;
    color: #ffffff;
    border-color: #c40000;
  }

  .reservas-grid {
    display: grid;
    grid-template-columns: 1fr; 
    gap: 22px;
    align-items: start;
  }

  @media (min-width: 640px) {
    .reservas-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1024px) {
    .reservas-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .reserva-card {
    background: #ffffff;
    border: 2px solid #979797;
    border-radius: 16px;
    padding: 18px 16px 16px;
    min-height: 188px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .reserva-subtitle {
    margin: 0 0 6px;
    font-size: 14px;
    color: #7a7a7a;
    font-weight: 500;
  }

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

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .card-info-line {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666666;
  }

  .text-label {
    font-weight: 700;
    color: #7a7a7a;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }

  .pill-date,
  .pill-hour {
    background: #7a7a7a;
    color: #ffffff;
    font-size: 11px;
    min-height: 22px;
    padding: 4px 10px;
  }

  .pill-aprovado {
    background: #32d267;
    color: #ffffff;
  }

  .pill-pendente {
    background: #f2cf27;
    color: #ffffff;
  }

  .pill-rejeitado {
    background: #d11a1a;
    color: #ffffff;
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  .btn-small {
    height: 28px;
    padding: 0 12px;
    border: none;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    color: #ffffff;
  }

  .btn-alterar {
    background: #005c6d;
  }

  .btn-cancelar {
    background: #b20000;
  }

  .btn-motivo {
    background: #005c6d;
  }

  .empty-state {
    color: #7a7a7a;
    font-size: 15px;
    margin-top: 8px;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.42);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 20px;
    z-index: 999;
    overflow-y: auto;
  }

  .modal-content {
    width: 100%;
    max-width: 540px;
    background: #ffffff;
    border-radius: 18px;
    padding: 22px 22px 20px;
    position: relative;
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.18);
  }

  .modal-content.small {
    max-width: 400px;
  }

  .modal-close {
    position: absolute;
    top: 14px;
    right: 16px;
    border: none;
    background: transparent;
    color: #7a7a7a;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
  }

  .modal-header-line {
    border-left: 4px solid #73a28c;
    padding-left: 10px;
    margin-bottom: 18px;
  }

  .modal-title {
    margin: 0;
    font-family: 'Roboto Slab', serif;
    font-size: 22px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1.2;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .modal-label {
    font-size: 13px;
    font-weight: 700;
    color: #5e5e5e;
    margin-bottom: 6px;
  }

  .input,
  .textarea {
    width: 100%;
    border: 2px solid #d7d7d7;
    border-radius: 10px;
    background: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #3b3d41;
    outline: none;
  }

  .input {
    height: 40px;
    padding: 0 12px;
  }

  .textarea {
    min-height: 92px;
    resize: vertical;
    padding: 12px;
  }

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .input-with-icon { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 12px; width: 20px; pointer-events: none; }
  .custom-calendar {
    position: absolute; top: calc(100% + 4px); left: 0; background: white;
    border: 1px solid #D5D7D9; border-radius: 12px; padding: 16px;
    z-index: 20; width: 260px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 700; color: #005C6D; }
  .calendar-nav { cursor: pointer; color: #757575; padding: 0 8px; user-select: none; font-size: 18px; }
  .calendar-nav:hover { color: #B20000; }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
  .calendar-day-name { font-size: 12px; font-weight: 700; color: #757575; margin-bottom: 4px; }
  .calendar-cell { padding: 6px 0; font-size: 14px; color: #3B3D41; cursor: pointer; border-radius: 6px; transition: 0.2s; user-select: none; }
  .calendar-cell:hover { background: #F0F0F0; color: #B20000; font-weight: 700; }
  .calendar-cell.empty { visibility: hidden; pointer-events: none; }
  .calendar-cell.today { background-color: #B20000; color: #FFFFFF; font-weight: 700; }
  .calendar-cell.today:hover { background-color: #8E0000; color: #FFFFFF; }


  .cancel-card-preview {
    background: #f6e4e6;
    border: 1px solid #d7bcbc;
    border-radius: 10px;
    padding: 18px 14px;
  }

  .cancel-question {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: #4a4a4a;
    margin: 8px 0 2px;
  }

  .modal-text-box {
    border: 1px solid #dddddd;
    border-radius: 8px;
    min-height: 96px;
    background: #ffffff;
    padding: 12px;
    font-size: 13px;
    color: #5a5a5a;
    line-height: 1.5;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 18px;
  }

  .modal-footer.center {
    justify-content: center;
  }

  .btn-modal {
    min-width: 150px;
    height: 38px;
    padding: 0 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-modal-light {
    background: #ffffff;
    color: #6b6b6b;
    border: 1px solid #dfdfdf;
  }

  .btn-modal-primary {
    background: #b20000;
    color: #ffffff;
    border: none;
  }

  @media (max-width: 768px) {
    .minhas-reservas-page {
      padding: 24px 16px 40px;
    }

    .title-salas {
      font-size: 42px;
    }

    .header-icon {
      width: 40px;
      height: 40px;
    }

    .header-line-main {
      width: 120px;
      height: 12px;
    }

    .header-line-tail {
      width: 120px;
    }

    .top-actions {
      gap: 12px;
    }

    .row-2 {
      grid-template-columns: 1fr;
    }

    .modal-content {
      padding: 20px 16px 18px;
    }

    .modal-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-modal {
      width: 100%;
      min-width: 0;
    }
  }
`;

export default function MinhasReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [salasDisponiveis, setSalasDisponiveis] = useState<SalaDisponivel[]>([]);
  const [filtro, setFiltro] = useState<"todas" | StatusReserva>("todas");

  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const [modalMotivoAberto, setModalMotivoAberto] = useState(false);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);
  const [modalAlteracaoAberto, setModalAlteracaoAberto] = useState(false);

  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  const [novaSala, setNovaSala] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaDataIso, setNovaDataIso] = useState("");
  const [novosHorarios, setNovosHorarios] = useState<string[]>([]);
  const [motivoAlteracao, setMotivoAlteracao] = useState("");

  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [dataVisualizacao, setDataVisualizacao] = useState(new Date());
  const calendarioRef = useRef<HTMLDivElement>(null);

  const [modalChamadoAberto, setModalChamadoAberto] = useState(false);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const listaReservas = await api.get<any[]>('/agendamentos/meus-agendamentos');
        const reservasFormatadas = listaReservas.map((item: any) => ({
          id: item.idAgendamento,
          sala: item.salaNome || `Sala ${item.salaId}`,
          data: new Date(item.dataAgendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
          horario: `${item.horaInicio} às ${item.horaFim}`,
          status: traduzirStatusParaFront(item.statusAgendamento), 
          motivo: item.descricao || "Nenhum motivo informado",
        }));
        setReservas(reservasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };
    fetchReservas();
  }, []);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await api.get('/inventarios');
        const data = Array.isArray((response as any).data) ? (response as any).data : (response as any).data?.data || [];
        
        const salasLidas = data.map((item: any) => ({
          id: item.salaId,
          nome: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
          dispositivos: Array.isArray(item.dispositivos) ? item.dispositivos.map((d: any) => ({
            id: d.idDispositivo || d.dispositivo?.idDispositivo,
            nome: d.nomeDispositivo || d.dispositivo?.nomeDispositivo || 'Dispositivo',
            patrimonio: d.patrimonio || d.dispositivo?.patrimonio,
            numeroSerie: d.numeroSerie || d.dispositivo?.numeroSerie
          })) : []
        }));

        const uniqueSalas = salasLidas.filter((v: any, i: number, a: any) => a.findIndex((t: any) => (t.id === v.id)) === i);
        setSalasDisponiveis(uniqueSalas);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
      }
    };
    fetchSalas();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarioRef.current && !calendarioRef.current.contains(event.target as Node)) {
        setCalendarioAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const reservasFiltradas = useMemo(() => {
    if (filtro === "todas") return reservas;
    return reservas.filter((r) => r.status === filtro);
  }, [filtro, reservas]);

  const abrirModalMotivo = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalMotivoAberto(true);
  };

  const abrirModalCancelar = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalCancelarAberto(true);
  };

  const abrirModalAlteracao = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setNovaSala(reserva.sala);

    if (reserva.data && reserva.data.includes('/')) {
      const [dia, mes, ano] = reserva.data.split('/');
      if (dia && mes && ano) {
        setNovaDataIso(`${ano}-${mes}-${dia}`);
        
        const d = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        const diasExtenso = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const nomeSemana = diasExtenso[d.getDay()];
        setNovaData(`${dia}/${mes}/${ano} (${nomeSemana})`);
      } else {
        setNovaData(reserva.data);
        setNovaDataIso("");
      }
    } else {
      setNovaData(reserva.data || "");
      setNovaDataIso("");
    }

    if (reserva.horario) {
      setNovosHorarios([reserva.horario.replace(' às ', ' as ')]);
    } else {
      setNovosHorarios([]);
    }
    
    setMotivoAlteracao("");
    setModalAlteracaoAberto(true);
  };

  const fecharTudo = () => {
    setModalMotivoAberto(false);
    setModalCancelarAberto(false);
    setModalAlteracaoAberto(false);
    setCalendarioAberto(false);
    setReservaSelecionada(null);
  };

  const mudarMes = (delta: number) => {
    setDataVisualizacao(new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth() + delta, 1));
  };

  const selecionarData = (dia: number) => {
    const d = new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth(), dia);
    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(dataVisualizacao.getMonth() + 1).padStart(2, '0');
    const anoStr = dataVisualizacao.getFullYear();
    const diasExtenso = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const nomeSemana = diasExtenso[d.getDay()];

    setNovaData(`${diaStr}/${mesStr}/${anoStr} (${nomeSemana})`);
    setNovaDataIso(`${anoStr}-${mesStr}-${diaStr}`);
    setCalendarioAberto(false);
  };

  const confirmarCancelamento = async () => {
    if (!reservaSelecionada) return;
    try {
        await api.post(`/agendamentos/${reservaSelecionada.id}/cancelar-docente`);
        
        setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? { 
            ...r, 
            status: "cancelado", 
            motivo: "Reserva cancelada pelo docente." 
        } : r));
        
        setMensagem({ tipo: 'sucesso', texto: 'Reserva cancelada com sucesso.' });
        setTimeout(() => setMensagem(null), 4000);
        fecharTudo();
    } catch (error) {
        console.error("Erro ao cancelar:", error);
        setMensagem({ tipo: 'erro', texto: 'Erro ao cancelar a reserva.' });
    }
    fecharTudo();
  };

  const confirmarAlteracao = async () => {
    if (!reservaSelecionada) return;

    try {
      let dataAgendamentoIso: string | undefined;
      if (novaDataIso) {
         dataAgendamentoIso = new Date(`${novaDataIso}T00:00:00Z`).toISOString();
      }

      const salaSelecionadaObj = salasDisponiveis.find(s => s.nome === novaSala);

      const promises = novosHorarios.map(horario => {
        let horaInicio, horaFim;
        if (horario.includes(" as ")) {
          const parts = horario.split(" as ");
          horaInicio = parts[0].trim();
          horaFim = parts[1].trim();
        }

        const payload = {
          ...(dataAgendamentoIso && { dataAgendamento: dataAgendamentoIso }),
          ...(horaInicio && { horaInicio }),
          ...(horaFim && { horaFim }),
          descricao: motivoAlteracao ? `[ALTERAÇÃO] ${motivoAlteracao}` : "[ALTERAÇÃO] Solicitação de mudança de data/horário.",
          ...(salaSelecionadaObj && { salaId: salaSelecionadaObj.id }),
          statusAgendamento: "EM_ESPERA" 
        };
        
        return api.post('/agendamentos/' + reservaSelecionada.id + '/solicitar-alteracao', payload);
      });

      await Promise.all(promises);
      
      setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? {
        ...r, 
        sala: novaSala,
        data: novaData.split(' ')[0] || r.data, 
        horario: novosHorarios.join(', ').replace(/ as /g, ' às ') || r.horario, 
        status: "pendente" 
      } : r));

      setMensagem({ tipo: 'sucesso', texto: 'Solicitação de alteração enviada com sucesso.' });
      setTimeout(() => setMensagem(null), 4000);
      
      setMotivoAlteracao("");
      fecharTudo();
    } catch (error:any) {
      console.error("Erro ao alterar reserva:", error);
      const msgErro = error.response?.data?.message || error.message || "Erro desconhecido.";
      setMensagem({ tipo: 'erro', texto: msgErro });
      setTimeout(() => setMensagem(null), 4000);
    }
  };

  const getStatusClass = (status: StatusReserva) => {
    const map = {
      aprovado: "pill-aprovado",
      pendente: "pill-pendente",
      cancelado: "pill-cancelado",
      rejeitado: "pill-rejeitado"
    };
    return map[status];
  };

  const getStatusLabel = (status: StatusReserva) => {
    const map: Record<StatusReserva, string> = {
      aprovado: "Aprovada",
      pendente: "Pendente",
      cancelado: "Cancelada",
      rejeitado: "Rejeitada"
    };
    return map[status] || "Rejeitada";
  };

  const diasDoMes = new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth() + 1, 0).getDate();
  const primeiroDiaDaSemana = new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth(), 1).getDay();
  const diasArr = Array.from({length: diasDoMes}, (_, i) => i + 1);
  const espacosArr = Array.from({length: primeiroDiaDaSemana}, (_, i) => i);
  const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const diasSemanaNomes = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <>
      <style>{styles}</style>
      <div className="minhas-reservas-page">
        {mensagem && (
          <div className={`fixed top-5 right-5 z-[9999] p-4 rounded-lg text-white shadow-xl ${mensagem.tipo === 'sucesso' ? 'bg-[#005C6D]' : 'bg-[#B20000]'}`}>
            {mensagem.texto}
          </div>
        )}

        <header className="header-salas">
          <div className="flex items-center gap-4">
            <img src={iconVerify} className="w-12 h-12" alt="Logo" />
            <h1 className="text-4xl md:text-6xl font-bold text-[#005c6d] font-['Roboto_Slab']">Minhas Reservas</h1>
          </div>
          <div className="mt-4 h-2 w-40 bg-[#b20000] rounded-full"></div>
        </header>

        <div className="top-actions">
        <button className="btn-reservar" onClick={() => navigate('/listar-salas-docentes')}>
          + Reservar sala
        </button>
          <div className="filters-bar">
            <span className="filter-label">Status:</span>
            <div className="filters-container">
              <button
                className={`filter-btn ${filtro === "todas" ? "active" : ""}`}
                onClick={() => setFiltro("todas")}
              >
                Todas
              </button>

              <button
                className={`filter-btn ${filtro === "aprovado" ? "active" : ""}`}
                onClick={() => setFiltro("aprovado")}
              >
                Aprovadas
              </button>

              <button
                className={`filter-btn ${filtro === "pendente" ? "active" : ""}`}
                onClick={() => setFiltro("pendente")}
              >
                Pendentes
              </button>

              <button
                className={`filter-btn ${filtro === "cancelado" ? "active" : ""}`}
                onClick={() => setFiltro("cancelado")}
              >
                Rejeitadas
              </button>
            </div>
          </div>
        </div>

        <div className="reservas-grid">
          {reservasFiltradas.length > 0 ? (
            reservasFiltradas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <p className="reserva-subtitle">Solicitação de reserva</p>

                <h2 className="sala-nome-card">{reserva.sala}</h2>

                <div className="status-line">
                  <span className="text-label">Status:</span>
                  <span className={`pill ${getStatusClass(reserva.status)}`}>
                    {getStatusLabel(reserva.status)}
                  </span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Data:</span>
                  <span className="pill pill-date">
                    {reserva.data}
                  </span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Horário:</span>
                  <span className="pill pill-hour">{reserva.horario}</span>
                </div>

                <div className="card-actions">
                  <button
                  className="btn-small"
                  style={{ background: '#B20000' }}
                  onClick={() => {
                    setReservaSelecionada(reserva);
                    setModalChamadoAberto(true);
                    }}
                  >
                  Relatar Problema
                  </button>
                  {reserva.status !== "cancelado" && (
                    <button
                      className="btn-small btn-alterar"
                      onClick={() => abrirModalAlteracao(reserva)}
                    >
                      Solicitar alteração
                    </button>
                  )}

                  {reserva.status !== "cancelado" && (
                    <button
                      className="btn-small btn-cancelar"
                      onClick={() => abrirModalCancelar(reserva)}
                    >
                      Cancelar reserva
                    </button>
                  )}

                  {reserva.status === "cancelado" && (
                    <button
                      className="btn-small btn-motivo"
                      onClick={() => abrirModalMotivo(reserva)}
                    >
                      Visualizar motivo
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">Nenhuma reserva encontrada para esse filtro.</p>
          )}
        </div>

        {modalAlteracaoAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharTudo}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharTudo}>
                ×
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Solicitar alteração</h2>
              </div>

              <div className="modal-body">
                <div>
                  <div className="modal-label">Alterar sala:</div>
                  <select
                    className="input"
                    value={novaSala}
                    onChange={(e) => setNovaSala(e.target.value)}
                  >
                    {salasDisponiveis.map(sala => (
                      <option key={sala.id} value={sala.nome}>{sala.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="row-2">
                  <div ref={calendarioRef} style={{ position: 'relative' }}>
                    <div className="modal-label">Alterar data:</div>
                    <div className="input-with-icon" onClick={() => setCalendarioAberto(!calendarioAberto)} style={{ cursor: 'pointer' }}>
                      <img src={iconData} alt="Data" className="input-icon" />
                      <input 
                        type="text" 
                        className="input"
                        style={{ paddingLeft: '40px', cursor: 'pointer' }}
                        placeholder="Selecione a data" 
                        value={novaData} 
                        readOnly 
                      />
                      
                      {calendarioAberto && (
                        <div className="custom-calendar" onClick={e => e.stopPropagation()}>
                          <div className="calendar-header">
                            <span className="calendar-nav" onClick={() => mudarMes(-1)}>&lt;</span>
                            <span>{mesesNomes[dataVisualizacao.getMonth()]} {dataVisualizacao.getFullYear()}</span>
                            <span className="calendar-nav" onClick={() => mudarMes(1)}>&gt;</span>
                          </div>
                          <div className="calendar-grid">
                            {diasSemanaNomes.map((dia, idx) => (
                              <div key={idx} className="calendar-day-name">{dia}</div>
                            ))}
                            {espacosArr.map((_, idx) => (
                              <div key={`espaco-${idx}`} className="calendar-cell empty"></div>
                            ))}
                            {diasArr.map(dia => {
                              const hoje = new Date();
                              const isToday = dia === hoje.getDate() && 
                                              dataVisualizacao.getMonth() === hoje.getMonth() && 
                                              dataVisualizacao.getFullYear() === hoje.getFullYear();
                              
                              return (
                                <div 
                                  key={dia} 
                                  className={`calendar-cell ${isToday ? 'today' : ''}`}
                                  onClick={() => selecionarData(dia)}
                                >
                                  {dia}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="modal-label">Alterar horários:</div>
                    <div className="input-with-icon">
                      <img src={iconHorario} alt="Horário" className="input-icon" />
                      <select 
                        className="input"
                        style={{ paddingLeft: '40px', appearance: 'none', backgroundImage: 'url(' + iconSeta + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer' }}
                        value="" 
                        onChange={e => {
                          const val = e.target.value;
                          if (val && !novosHorarios.includes(val)) {
                            setNovosHorarios([...novosHorarios, val]);
                          }
                        }}
                      >
                        <option value="" disabled hidden>Selecione os horários</option>
                        <option value="07:30 as 09:10">07:30 às 09:10</option>
                        <option value="09:20 as 11:00">09:20 às 11:00</option>
                        <option value="11:10 as 13:00">11:10 às 13:00</option>
                        <option value="14:50 as 16:30">14:50 às 16:30</option>
                        <option value="16:40 as 18:20">16:40 às 18:20</option>
                      </select>
                    </div>
                    {novosHorarios.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {novosHorarios.map((horario, idx) => (
                          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', background: '#7a7a7a', color: '#ffffff', fontWeight: 700 }}>
                            {horario.replace('as', 'às')}
                            <button 
                              type="button" 
                              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', padding: '0 4px' }}
                              onClick={() => setNovosHorarios(novosHorarios.filter(h => h !== horario))}
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="modal-label">Motivo da alteração:</div>
                  <textarea
                    className="textarea"
                    value={motivoAlteracao}
                    onChange={(e) => setMotivoAlteracao(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-modal btn-modal-light" onClick={fecharTudo}>
                  Cancelar
                </button>
                <button className="btn-modal btn-modal-primary" onClick={confirmarAlteracao}>
                  Solicitar alteração
                </button>
              </div>
            </div>
          </div>
        )}

        {modalCancelarAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharTudo}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharTudo}>
                ×
              </button>

              <div className="modal-body">
                <div className="cancel-card-preview">
                  <p className="reserva-subtitle">Solicitação de reserva</p>
                  <h2 className="sala-nome-card">{reservaSelecionada.sala}</h2>

                  <div className="status-line">
                    <span className="text-label">Status:</span>
                    <span className={`pill ${getStatusClass(reservaSelecionada.status)}`}>
                      {getStatusLabel(reservaSelecionada.status)}
                    </span>
                  </div>

                  <div className="card-info-line">
                    <span className="text-label">Data:</span>
                    <span className="pill pill-date">
                      {reservaSelecionada.data}
                    </span>
                  </div>

                  <div className="card-info-line">
                    <span className="text-label">Horário:</span>
                    <span className="pill pill-hour">{reservaSelecionada.horario}</span>
                  </div>
                </div>

                <div className="cancel-question">
                  Deseja mesmo cancelar essa reserva?
                </div>
              </div>

              <div className="modal-footer center">
                <button className="btn-modal btn-modal-light" onClick={fecharTudo}>
                  Voltar
                </button>
                <button className="btn-modal btn-modal-primary" onClick={confirmarCancelamento}>
                  Cancelar reserva
                </button>
              </div>
            </div>
          </div>
        )}

        {modalMotivoAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharTudo}>
            <div
              className="modal-content small"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={fecharTudo}>
                ×
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Motivo da rejeição / cancelamento</h2>
              </div>

              <div className="modal-body">
                <div className="modal-text-box">
                  {reservaSelecionada.motivo}
                </div>
              </div>
            </div>
          </div>
        )}

        {modalChamadoAberto && reservaSelecionada && (
          <ModalAbrirChamado 
            salaId={salasDisponiveis.find(s => s.nome === reservaSelecionada.sala)?.id || 0}
            salaNome={reservaSelecionada.sala}
            dispositivos={salasDisponiveis.find(s => s.nome === reservaSelecionada.sala)?.dispositivos || []} 
            onClose={() => setModalChamadoAberto(false)}
            onSuccess={(msg) => {
              setMensagem({ tipo: 'sucesso', texto: msg });
              setModalChamadoAberto(false);
              setTimeout(() => setMensagem(null), 4000);
            }}
          />
        )}
      </div>
    </>
  );
}