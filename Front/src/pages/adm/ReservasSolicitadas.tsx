import { useState, useEffect } from "react";
import iconVerify from "../../assets/Verify_FATEC.png";
import iconX from "../../assets/x.svg";
import iconData from "../../assets/data.svg";
import iconHorario from "../../assets/horario.svg";
import { api } from "../../services/api";

type StatusReserva = "Aprovada" | "Pendente" | "Rejeitada";

type Reserva = {
  id: number;
  sala: string;
  data: string;
  horario: string;
  status: StatusReserva;
  motivo: string;
  usuarioId: number;
  docenteNome: string;
  isAlteracao: boolean;
};

const styles = `
  * { box-sizing: border-box; }

  .reservas-coord-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
  }

  .header-salas { margin-bottom: 24px; margin-top: 40px; }
  .header-content { display: flex; align-items: center; gap: 14px; }
  .header-icon { width: 52px; height: 52px; object-fit: contain; }
  .title-salas {
    margin: 0; font-family: 'Roboto Slab', serif; font-size: 56px; font-weight: 700; color: #005c6d; line-height: 1;
  }
  .header-line-wrap { margin-top: 14px; display: flex; align-items: center; }
  .header-line-main { width: 175px; height: 16px; border-radius: 999px; background: #b20000; }
  .header-line-tail { width: 200px; height: 3px; background: #b20000; margin-left: -6px; border-radius: 999px; }

  .filters-wrapper {
    display: flex; align-items: center; gap: 16px;
    background: #FFFFFF; border: 1px solid #D5D7D9; border-radius: 8px;
    padding: 12px 20px; width: fit-content; margin-bottom: 36px;
  }
  .filter-label { font-size: 15px; font-weight: 500; color: #757575; }
  .filter-btn-group { display: flex; gap: 12px; }
  .filter-pill-btn {
    padding: 6px 18px; border-radius: 999px; font-size: 13px; font-weight: 600;
    cursor: pointer; background: #FFFFFF; transition: all 0.2s;
  }
  .filter-pill-btn.aprovada { border: 1px solid #00C853; color: #00C853; }
  .filter-pill-btn.aprovada.active { background: #00C853; color: #FFFFFF; }
  
  .filter-pill-btn.pendente { border: 1px solid #FBC02D; color: #FBC02D; }
  .filter-pill-btn.pendente.active { background: #FBC02D; color: #FFFFFF; }
  
  .filter-pill-btn.rejeitada { border: 1px solid #B20000; color: #B20000; }
  .filter-pill-btn.rejeitada.active { background: #B20000; color: #FFFFFF; }

  .section-title {
    font-size: 18px; font-weight: 700; color: #757575; margin-bottom: 16px; margin-top: 32px;
  }
  .reservas-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 320px)); gap: 20px;
  }

  .reserva-card {
    background: #ffffff; border: 2px solid #D5D7D9; border-radius: 12px;
    padding: 20px; display: flex; flex-direction: column;
  }
  .reserva-subtitle { margin: 0 0 6px; font-size: 13px; color: #757575; font-weight: 500; }
  .reserva-subtitle.alteracao { color: #005c6d; font-weight: 700; }
  
  .sala-nome-card {
    margin: 0 0 12px; padding-left: 10px; border-left: 3px solid #005c6d;
    font-family: 'Roboto Slab', serif; font-size: 24px; font-weight: 700; color: #005c6d;
  }
  .card-info-line {
    display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px;
  }
  .text-label { font-weight: 600; color: #757575; }
  
  .pill {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
  }
  .pill-date, .pill-hour { background: #757575; color: #ffffff; }
  .pill-aprovada { background: #00C853; color: #ffffff; }
  .pill-pendente { background: #FBC02D; color: #ffffff; }
  .pill-rejeitada { background: #B20000; color: #ffffff; }
  .pill-docente { background: #EAEAEA; color: #3B3D41; }

  .btn-revisar {
    margin-top: 16px; height: 36px; background: #005c6d; color: #ffffff;
    border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; width: 100%; transition: background 0.2s;
  }
  .btn-revisar:hover { background: #004552; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  }
  .modal-content {
    background: #ffffff; border-radius: 12px; width: 100%; max-width: 520px;
    padding: 24px; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
  .modal-close {
    position: absolute; top: 16px; right: 16px; background: transparent; border: none; cursor: pointer; opacity: 0.6;
  }
  .modal-close:hover { opacity: 1; }
  .modal-header-line { border-left: 3px solid #005C6D; padding-left: 12px; margin-bottom: 24px; }
  .modal-title { font-family: 'Roboto Slab', serif; font-size: 28px; font-weight: 700; color: #005c6d; margin: 0; }
  
  .form-group { margin-bottom: 16px; }
  .modal-label { font-size: 13px; font-weight: 700; color: #3B3D41; margin-bottom: 6px; display: block; }
  
  .input-styled {
    width: 100%; height: 42px; border: 1px solid #D5D7D9; border-radius: 8px;
    padding: 0 12px; font-family: 'Inter', sans-serif; font-size: 14px; color: #3B3D41;
    background: #F9F9F9;
  }
  .textarea-styled {
    width: 100%; min-height: 80px; border: 1px solid #D5D7D9; border-radius: 8px;
    padding: 12px; font-family: 'Inter', sans-serif; font-size: 14px; color: #3B3D41;
    background: #F9F9F9; resize: none;
  }
  
  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  
  .input-with-icon { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 12px; width: 18px; pointer-events: none; opacity: 0.5; }
  .input-with-icon .input-styled { padding-left: 38px; }

  .modal-footer { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .footer-row { display: flex; gap: 12px; width: 100%; }
  
  .btn-modal {
    flex: 1; height: 42px; border-radius: 8px; font-size: 14px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s;
  }
  .btn-modal:hover { opacity: 0.9; }
  .btn-rejeitar { background: #B20000; color: white; border: none; }
  .btn-aprovar { background: #00C853; color: white; border: none; }
  .btn-cancelar { background: #FFFFFF; color: #757575; border: 1px solid #D5D7D9; }

  @media (max-width: 768px) {
    .reservas-coord-page { padding: 24px 16px; }
    .title-salas { font-size: 40px; }
    .row-2 { grid-template-columns: 1fr; }
    .filters-wrapper { flex-direction: column; align-items: flex-start; width: 100%; }
    .filter-btn-group { width: 100%; justify-content: space-between; }
  }
`;

export default function ReservasSolicitadas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<"Todas" | StatusReserva>("Todas");
  
  // Controle de modais
  const [modalRevisarAberto, setModalRevisarAberto] = useState(false);
  const [modalRejeitarAberto, setModalRejeitarAberto] = useState(false);
  
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAgendamentos = await api.get('/agendamentos');
        const agendamentosData = (resAgendamentos as any).data;

        const listaReservas = Array.isArray(agendamentosData) ? agendamentosData : (agendamentosData?.data || []);
        
        const reservasFormatadas = listaReservas.map((item: any) => {
          let statusFormatado: StatusReserva = "Pendente";
          if (item.statusAgendamento === "AGENDADO") statusFormatado = "Aprovada";
          else if (item.statusAgendamento === "CANCELADO" || item.statusAgendamento === "REJEITADO") statusFormatado = "Rejeitada";

          let dataFormatada = item.dataAgendamento;
          if (item.dataAgendamento) {
            const dataObj = new Date(item.dataAgendamento);
            dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); 
          }

          const motivoTexto = item.descricao || "Nenhum motivo informado";
          const isAlteracao = motivoTexto.includes("[ALTERAÇÃO]");
          const motivoLimpo = isAlteracao ? motivoTexto.replace("[ALTERAÇÃO]", "").trim() : motivoTexto;

          return {
            id: item.idAgendamento || item.id,
            sala: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
            data: dataFormatada || "Data não informada",
            horario: item.horaInicio && item.horaFim ? `${item.horaInicio} às ${item.horaFim}` : "Horário não informado",
            status: statusFormatado,
            motivo: motivoLimpo,
            usuarioId: item.usuarioId,
            docenteNome: item.docenteNome || "Professor não identificado", 
            isAlteracao
          };
        });

        setReservas(reservasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const reservasPendentes = reservas.filter(r => r.status === "Pendente" && (filtroAtivo === "Todas" || filtroAtivo === "Pendente"));
  const reservasAprovadas = reservas.filter(r => r.status === "Aprovada" && (filtroAtivo === "Todas" || filtroAtivo === "Aprovada"));
  const reservasRejeitadas = reservas.filter(r => r.status === "Rejeitada" && (filtroAtivo === "Todas" || filtroAtivo === "Rejeitada"));

  const abrirModalRevisar = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalRevisarAberto(true);
  };

  const fecharModais = () => {
    setModalRevisarAberto(false);
    setModalRejeitarAberto(false);
    setReservaSelecionada(null);
    setMotivoRejeicao("");
  };

  const handleAprovarReserva = async () => {
    if (!reservaSelecionada) return;

    try {
      await api.post(`/agendamentos/${reservaSelecionada.id}/aprovar`);
      
      if (reservaSelecionada.isAlteracao) {
        await api.put(`/agendamentos/${reservaSelecionada.id}`, { descricao: reservaSelecionada.motivo });
      }

      setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? { ...r, status: "Aprovada", isAlteracao: false } : r));
      fecharModais();
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Ocorreu um erro ao aprovar a reserva. Verifique a conexão com o servidor e se a sala não possui conflitos de horário.");
    }
  };

  const abrirPopUpRejeitar = () => {
    setModalRevisarAberto(false);
    setModalRejeitarAberto(true);
  };

  const confirmarRejeicao = async () => {
    if (!reservaSelecionada) return;

    try {
      const justificativa = motivoRejeicao.trim() ? `[REJEITADA] ${motivoRejeicao}` : "[REJEITADA] Reserva não aprovada pela coordenação.";
      await api.put(`/agendamentos/${reservaSelecionada.id}`, { descricao: justificativa });

      await api.post(`/agendamentos/${reservaSelecionada.id}/cancelar`);

      setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? { 
        ...r, 
        status: "Rejeitada", 
        motivo: justificativa,
        isAlteracao: false 
      } : r));

      fecharModais();
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      alert("Ocorreu um erro ao rejeitar a reserva.");
    }
  };

  const renderReservaCard = (reserva: Reserva) => (
    <div key={reserva.id} className="reserva-card">
      {reserva.isAlteracao ? (
        <p className="reserva-subtitle alteracao">⚠️ Solicitação de alteração</p>
      ) : (
        <p className="reserva-subtitle">Solicitação de reserva nova</p>
      )}
      
      <h2 className="sala-nome-card">{reserva.sala}</h2>

      <div className="card-info-line">
        <span className="text-label">Docente:</span>
        <span className="pill pill-docente">{reserva.docenteNome}</span>
      </div>

      <div className="card-info-line">
        <span className="text-label">Status:</span>
        <span className={`pill pill-${reserva.status.toLowerCase()}`}>{reserva.status}</span>
      </div>

      <div className="card-info-line">
        <span className="text-label">Data:</span>
        <span className="pill pill-date">{reserva.data}</span>
      </div>

      <div className="card-info-line">
        <span className="text-label">Horário:</span>
        <span className="pill pill-hour">{reserva.horario}</span>
      </div>

      {reserva.status === "Pendente" && (
        <button className="btn-revisar" onClick={() => abrirModalRevisar(reserva)}>
          Revisar solicitação
        </button>
      )}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="reservas-coord-page">
        
        <header className="header-salas">
          <div className="header-content">
            <img src={iconVerify} alt="Verificar" className="header-icon" />
            <h1 className="title-salas">Reservas Solicitadas</h1>
          </div>
          <div className="header-line-wrap">
            <div className="header-line-main"></div>
            <div className="header-line-tail"></div>
          </div>
        </header>

        <div className="filters-wrapper">
          <span className="filter-label">Status:</span>
          <div className="filter-btn-group">
            <button 
              className={`filter-pill-btn aprovada ${filtroAtivo === 'Aprovada' ? 'active' : ''}`}
              onClick={() => setFiltroAtivo(filtroAtivo === 'Aprovada' ? 'Todas' : 'Aprovada')}
            >
              Aprovada
            </button>
            <button 
              className={`filter-pill-btn pendente ${filtroAtivo === 'Pendente' ? 'active' : ''}`}
              onClick={() => setFiltroAtivo(filtroAtivo === 'Pendente' ? 'Todas' : 'Pendente')}
            >
              Pendente
            </button>
            <button 
              className={`filter-pill-btn rejeitada ${filtroAtivo === 'Rejeitada' ? 'active' : ''}`}
              onClick={() => setFiltroAtivo(filtroAtivo === 'Rejeitada' ? 'Todas' : 'Rejeitada')}
            >
              Rejeitada
            </button>
          </div>
        </div>

        {reservasPendentes.length > 0 && (
          <div>
            <h3 className="section-title">Reservas pendentes:</h3>
            <div className="reservas-grid">
              {reservasPendentes.map(renderReservaCard)}
            </div>
          </div>
        )}

        {reservasAprovadas.length > 0 && (
          <div>
            <h3 className="section-title">Reservas aprovadas:</h3>
            <div className="reservas-grid">
              {reservasAprovadas.map(renderReservaCard)}
            </div>
          </div>
        )}

        {reservasRejeitadas.length > 0 && (
          <div>
            <h3 className="section-title">Reservas rejeitadas:</h3>
            <div className="reservas-grid">
              {reservasRejeitadas.map(renderReservaCard)}
            </div>
          </div>
        )}

        {/* MODAL: REVISAR RESERVA */}
        {modalRevisarAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharModais}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharModais}>
                <img src={iconX} alt="Fechar" className="w-4 h-4" />
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">
                  {reservaSelecionada.isAlteracao ? "Revisar Alteração" : "Solicitação de reserva"}
                </h2>
              </div>

              <div className="row-2">
                <div className="form-group">
                  <label className="modal-label">Docente:</label>
                  <input type="text" className="input-styled" value={reservaSelecionada.docenteNome} readOnly />
                </div>
                <div className="form-group">
                  <label className="modal-label">Sala solicitada:</label>
                  <input type="text" className="input-styled" value={reservaSelecionada.sala} readOnly />
                </div>
              </div>

              <div className="row-2">
                <div className="form-group">
                  <label className="modal-label">Data da reserva</label>
                  <div className="input-with-icon">
                    <img src={iconData} alt="Data" className="input-icon" />
                    <input type="text" className="input-styled" value={`${reservaSelecionada.data}`} readOnly />
                  </div>
                </div>

                <div className="form-group">
                  <label className="modal-label">Horário da reserva</label>
                  <div className="input-with-icon">
                    <img src={iconHorario} alt="Horário" className="input-icon" />
                    <input type="text" className="input-styled" value={reservaSelecionada.horario} readOnly />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="modal-label">Motivo da Reserva / Alteração</label>
                <textarea className="textarea-styled" value={reservaSelecionada.motivo} readOnly />
              </div>

              <div className="modal-footer">
                <div className="footer-row">
                  <button className="btn-modal btn-rejeitar" onClick={abrirPopUpRejeitar}>
                    Rejeitar reserva
                  </button>
                  <button className="btn-modal btn-aprovar" onClick={handleAprovarReserva}>
                    Aprovar reserva
                  </button>
                </div>
                <button className="btn-modal btn-cancelar" onClick={fecharModais}>
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL SECUNDÁRIO: MOTIVO DA REJEIÇÃO */}
        {modalRejeitarAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharModais}>
            <div className="modal-content small" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharModais}>
                <img src={iconX} alt="Fechar" className="w-4 h-4" />
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Motivo da Rejeição</h2>
              </div>

              <div className="form-group">
                <label className="modal-label">Informe ao docente o motivo de rejeitar esta reserva:</label>
                <textarea 
                  className="textarea-styled" 
                  placeholder="Ex: A sala estará em manutenção nesta data..."
                  value={motivoRejeicao} 
                  onChange={(e) => setMotivoRejeicao(e.target.value)} 
                  autoFocus
                />
              </div>

              <div className="modal-footer">
                <button className="btn-modal btn-cancelar" onClick={() => {
                  setModalRejeitarAberto(false);
                  setModalRevisarAberto(true);
                }}>
                  Voltar
                </button>
                <button className="btn-modal btn-rejeitar" onClick={confirmarRejeicao}>
                  Confirmar Rejeição
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}