import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import iconEngrenagem from '../../assets/Engrenagem_FATEC.png';
import { ModalAlterarStatus } from '../../modals/ModalAlterarStatus';
import type { Chamado, ChamadaStatus } from '../../interfaces/chamadaInterdace';

type ChamadoComImagens = Chamado & { imagens?: string[] };

const styles = `
  * { box-sizing: border-box; }

  .chamados-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
  }

  /* =========================================
     CABEÇALHO PADRÃO DO SISTEMA
     ========================================= */
  .header-salas { margin-bottom: 2rem; margin-top: 40px; }
  .header-title-wrapper { display: flex; align-items: center; gap: 20px; }
  .icon-header { width: 84px; height: auto; }
  .title-salas { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 64px; color: #005C6D; margin: 0; }
  .header-line { margin-top: 10px; height: 20px; background: #B20000; border-radius: 10px; width: 355px; position: relative; }
  .header-line::after { content: ''; position: absolute; left: calc(100% - 5px); top: 8px; width: 412px; height: 4px; background-color: #B20000; }

  /* =========================================
     FILTROS E AÇÕES
     ========================================= */
  .top-actions {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-bottom: 36px;
  }

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
  }
  .filter-btn:hover { border-color: #b20000; color: #b20000; }
  .filter-btn.active { background: #c40000; color: #ffffff; border-color: #c40000; }

  /* =========================================
     GRID DOS CHAMADOS
     ========================================= */
  .reservas-grid {
    display: grid;
    grid-template-columns: 1fr; 
    gap: 22px;
    align-items: start;
  }

  .galeria-chamado {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 6px;
  }
  .img-chamado {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #d7d7d7;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .img-chamado:hover {
    transform: scale(1.05);
  }

  @media (min-width: 640px) { .reservas-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .reservas-grid { grid-template-columns: repeat(3, 1fr); } }

  .reserva-card {
    background: #ffffff;
    border: 2px solid #979797;
    border-radius: 16px;
    padding: 18px 16px 16px;
    display: flex;
    flex-direction: column;
    min-height: 188px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .reserva-subtitle { margin: 0 0 6px; font-size: 14px; color: #7a7a7a; font-weight: 500; }
  .sala-nome-card {
    margin: 0 0 12px;
    padding-left: 10px;
    border-left: 4px solid #005c6d;
    font-family: 'Roboto Slab', serif;
    font-size: 24px;
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
  
  .pill-tipo { background: #ffffff; color: #005c6d; border: 1px solid #005c6d; }

  .textarea-readonly {
    background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;
    padding: 10px; font-size: 13px; width: 100%; min-height: 60px; resize: none; color: #666;
  }

  .resolucao-box {
    background: #f5fff7; border: 1px solid #c3e6cb; border-radius: 8px;
    padding: 10px; font-size: 13px; width: 100%; margin-top: 4px; color: #1fbf3a;
  }

  .btn-alterar {
    margin-top: auto;
    padding-top: 16px;
  }

  .btn-alterar button {
    width: 100%;
    background: #005c6d;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-alterar button:hover {
    background: #004a58;
  }

  .empty-state { color: #7a7a7a; font-size: 15px; margin-top: 8px; }

  /* =========================================
     RESPONSIVIDADE
     ========================================= */
  @media (max-width: 1024px) {
    .header-line { width: 250px; }
    .header-line::after { width: 300px; }
  }

  @media (max-width: 768px) {
    .chamados-page { padding: 24px 16px 40px; }
    .header-title-wrapper { gap: 12px; }
    .title-salas { font-size: 40px !important; }
    .icon-header { width: 50px; }
    .header-line { width: 150px; height: 16px; margin-top: 6px; }
    .header-line::after { width: 200px; height: 3px; top: 6px; }
    .top-actions { gap: 12px; }
  }

  @media (max-width: 768px) {
    .chamados-page { padding: 80px 16px 40px; }
    .header-title-wrapper { gap: 12px; }
    .title-salas { font-size: 40px !important; }
    .icon-header { width: 50px; }
    .header-line { width: 150px; height: 16px; margin-top: 6px; }
    .header-line::after { width: 200px; height: 3px; top: 6px; }
    .top-actions { gap: 12px; }
  }
`;

export default function ChamadosTI() {

  const [abaAtiva, setAbaAtiva] = useState<ChamadaStatus>('ABERTO');
  const [chamados, setChamados] = useState<ChamadoComImagens[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [chamadoSelecionadoId, setChamadoSelecionadoId] = useState<number | null>(null);

  const fetchChamados = async () => {
    try {
      setLoading(true);
      // Chamada para a rota @Get() do TSOA
      const data = await api.get<ChamadoComImagens[]>(`/chamados?status=${abaAtiva}`);
      setChamados(data);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
  }, [abaAtiva]);

  const handleAlterarStatus = async (novoStatus: string, acoes: string) => {
    if (!chamadoSelecionadoId) return;

    try {
      const tecnicoId = 1; 

      const payload = {
        status: novoStatus as ChamadaStatus,
        tecnicoId: tecnicoId,
        acoesRealizadas: acoes
      };

      await api.put(`/chamados/${chamadoSelecionadoId}/status`, payload);
      
      setModalAberto(false);
      fetchChamados(); 
    } catch (error) {
      alert("Erro ao atualizar status do chamado.");
    }
  };

  const getStatusClass = (status: ChamadaStatus) => {
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
          <div className="header-title-wrapper">
            <img src={iconEngrenagem} alt="Ícone Engrenagem" className="icon-header" />
            <h1 className="title-salas">Chamados de TI</h1>
          </div>
          <div className="header-line"></div>
        </header>

        <div className="top-actions">
          <div className="filters-bar">
            <span className="filter-label">Status:</span>
            <div className="filters-container">
              <button
                className={`filter-btn ${abaAtiva === "ABERTO" ? "active" : ""}`}
                onClick={() => setAbaAtiva("ABERTO")}
              >
                Pendentes
              </button>
              <button
                className={`filter-btn ${abaAtiva === "EM_ATENDIMENTO" ? "active" : ""}`}
                onClick={() => setAbaAtiva("EM_ATENDIMENTO")}
              >
                Em análise
              </button>
              <button
                className={`filter-btn ${abaAtiva === "RESOLVIDO" ? "active" : ""}`}
                onClick={() => setAbaAtiva("RESOLVIDO")}
              >
                Resolvidos
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Carregando chamados...</p>
        ) : chamados.length === 0 ? (
          <p className="empty-state">Nenhum chamado encontrado para esse status.</p>
        ) : (
          <div className="reservas-grid">
            {chamados.map(c => (
              <div key={c.idChamada} className="reserva-card">
                <p className="reserva-subtitle">Chamado n° {c.idChamada}</p>
                <div style={{ marginBottom: '12px' }}>
                  <span className="pill pill-tipo">{c.tipoProblema}</span>
                </div>
                
                <h2 className="sala-nome-card">
                  {c.sala?.nomeSala || "Sala não definida"}
                </h2>

                <div className="status-line">
                  <span className="text-label">Status:</span>
                  <span className={`pill ${getStatusClass(c.status)}`}>
                    {c.status === 'ABERTO' ? 'Pendente' : c.status === 'EM_ATENDIMENTO' ? 'Em Análise' : 'Resolvido'}
                  </span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Dispositivo:</span>
                  <span className="pill pill-gray">{c.dispositivo?.nomeDispositivo || 'Geral'}</span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Patrimônio:</span>
                  <span className="pill pill-gray">{c.dispositivo?.patrimonio || 'N/A'}</span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Data:</span>
                  <span className="pill pill-gray">{new Date(c.dataChamada).toLocaleDateString("pt-BR")}</span>
                </div>

                <div className="card-info-line" style={{ flexDirection: 'column' }}>
                  <span className="text-label">Descrição:</span>
                  <textarea readOnly value={c.descricao} className="textarea-readonly" />
                </div>

                {c.imagens && c.imagens.length > 0 && (
                  <div className="card-info-line" style={{ flexDirection: 'column' }}>
                    <span className="text-label">Imagens anexadas:</span>
                    <div className="galeria-chamado">
                      {c.imagens.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer">
                          <img src={img} alt={`Anexo ${idx + 1}`} className="img-chamado" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {c.acoesRealizadas && c.status === 'RESOLVIDO' && (
                  <div className="card-info-line" style={{ flexDirection: 'column' }}>
                    <span className="text-label">Resolução:</span>
                    <div className="resolucao-box">
                      {c.acoesRealizadas}
                    </div>
                  </div>
                )}

                <div className="btn-alterar">
                  <button 
                    onClick={() => { setChamadoSelecionadoId(c.idChamada); setModalAberto(true); }}
                  >
                    Alterar status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalAberto && (
          <ModalAlterarStatus 
            onClose={() => setModalAberto(false)} 
            onConfirm={handleAlterarStatus}
          />
        )}
      </div>
    </>
  );
}