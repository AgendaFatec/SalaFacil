import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import { ModalCriarUsuario } from "../../modals/ModalCriarUsuario";
import userSVG from "../../assets/user-svgrepo-com.svg";

const styles = `
  * { box-sizing: border-box; }

  .gestao-usuarios-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
  }

  .header-salas { 
    margin-bottom: 24px; 
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
    filter: invert(16%) sepia(86%) saturate(2250%) hue-rotate(174deg) brightness(95%) contrast(101%);
  }
  
  .title-salas {
    margin: 0; 
    font-family: 'Roboto Slab', serif; 
    font-size: 56px; 
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

  .toolbar-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 32px;
  }
  
  @media (min-width: 768px) {
    .toolbar-container {
      flex-direction: row;
    }
  }

  .search-input {
    padding: 12px;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    width: 100%;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    outline: none;
  }
  
  .search-input:focus {
    border-color: #B20000;
  }

  @media (min-width: 768px) {
    .search-input {
      width: 33.333333%;
    }
  }

  .filter-buttons-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .btn-filtro {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    transition: all 0.2s;
    border: 1px solid #E5E7EB;
    background: #FFFFFF;
    color: #6B7280;
    cursor: pointer;
  }

  .btn-filtro:hover {
    border-color: #005C6D;
  }

  .btn-filtro.ativo {
    background: #005C6D;
    color: #FFFFFF;
    border-color: #005C6D;
  }

  .btn-novo {
    background: #B20000;
    color: #FFFFFF;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-novo:hover {
    background: #990000;
  }

  .table-wrapper {
    overflow-x: auto;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    border-radius: 16px;
    border: 1px solid #F3F4F6;
    background: #FFFFFF;
  }

  .usuarios-table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
  }

  .usuarios-table th {
    padding: 16px;
    color: #6B7280;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #F9FAFB;
    border-bottom: 1px solid #F3F4F6;
  }

  .usuarios-table td {
    padding: 16px;
    border-bottom: 1px solid #F9FAFB;
    font-size: 14px;
  }

  .usuarios-table tr:hover {
    background: #F9FAFB;
    transition: background 0.2s;
  }

  .td-nome {
    font-weight: 600;
    color: #1F2937;
  }

  .td-email {
    color: #4B5563;
  }

  .badge-tipo {
    background: #F3F4F6;
    color: #4B5563;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .badge-status {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .badge-status.ativa {
    background: #ECFDF5;
    color: #047857;
  }

  .badge-status.convidada {
    background: #FEFCE8;
    color: #A16207;
  }

  .btn-deletar {
    color: #DC2626;
    font-weight: 700;
    font-size: 12px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .btn-deletar:hover {
    color: #7F1D1D;
  }

  @media (max-width: 768px) {
    .gestao-usuarios-page { padding: 24px 16px; }
    .title-salas { font-size: 40px; }
  }
`;

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

  const fetchUsuarios = async () => {
    try {
      const res = await api.get<any[]>('/Usuarios/list-users');
      setUsuarios(res);
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filtrados = useMemo(() => {
    return usuarios.filter(u => {
      const matchBusca = u.userNome?.toLowerCase().includes(termoBusca.toLowerCase()) || 
                         u.userEmail.toLowerCase().includes(termoBusca.toLowerCase());
      
      let matchTipo = true;

      if (filtroTipo === "CONVIDADOS") {
        matchTipo = u.statusUser === "CONVIDADA";
      } else if (filtroTipo === "TODOS") {
        matchTipo = u.statusUser === "ATIVA";
      } else {
        matchTipo = u.tipoUser === filtroTipo && u.statusUser === "ATIVA";
      }
      
      return matchBusca && matchTipo;
    });
  }, [usuarios, termoBusca, filtroTipo]);

  const deletarUsuario = async (id: number) => {
    if (confirm("Tem certeza? Esta ação removerá o usuário do sistema permanentemente.")) {
      try {
        await api.delete(`/Usuarios/delete-user/${id}`);
        setUsuarios(prev => prev.filter(u => u.userID !== id));
      } catch (error) {
        alert("Erro ao deletar usuário.");
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="gestao-usuarios-page">
        <header className="header-salas">
          <div className="header-content">
            <img 
              src={userSVG} 
              alt="Usuário" 
              className="header-icon" 
            />
            <h1 className="title-salas">Gestão de Usuários</h1>
          </div>
          <div className="header-line-wrap">
            <div className="header-line-main"></div>
            <div className="header-line-tail"></div>
          </div>
        </header>

        <div className="toolbar-container">
          <input 
            className="search-input" 
            placeholder="Filtrar por nome ou e-mail..."
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          
          <div className="filter-buttons-wrapper">
            {["TODOS", "DOCENTE", "TI", "ADM", "CONVIDADOS"].map(tipo => (
              <button 
                key={tipo}
                className={`btn-filtro ${filtroTipo === tipo ? "ativo" : ""}`}
                onClick={() => setFiltroTipo(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setModalCriarAberto(true)}
            className="btn-novo"
          >
            + Novo Usuário
          </button>
        </div>

        <div className="table-wrapper">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.userID}>
                  <td className="td-nome">{u.userNome || "Sem nome"}</td>
                  <td className="td-email">{u.userEmail}</td>
                  <td>
                    <span className="badge-tipo">
                      {u.tipoUser}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${u.statusUser === 'ATIVA' ? 'ativa' : 'convidada'}`}>
                      {u.statusUser}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-deletar"
                      onClick={() => deletarUsuario(u.userID)}
                    >
                      DELETAR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalCriarAberto && (
          <ModalCriarUsuario 
            onClose={() => setModalCriarAberto(false)}
            onUserCreated={() => {
              fetchUsuarios();
              setModalCriarAberto(false);
            }}
          />
        )}
      </div>
    </>
  );
}