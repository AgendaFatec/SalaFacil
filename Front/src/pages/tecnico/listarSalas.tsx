import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../../services/api';

import iconSala from '../../assets/sala.svg';
import iconPesquisa from '../../assets/pesquisa.svg';
import iconX from '../../assets/x.svg';
import imgSala from '../../assets/sala.png';

import { ModalGerenciarDispositivosSala } from '../../modals/ModalGerenciarDispositivosSala';

type Maquina = { id?: number; nome: string; qtd: number; };
type Tecnologia = { id: number; nome: string; };

type Sala = {
  id: number;
  idInventario: number;
  nome: string;
  capacidade: number;
  maquinas: Maquina[];
  tecnologias: Tecnologia[]; 
  imagem: string;
  fotos: string[];
};

const styles = `
  .lista-salas-container { padding: 2rem 4rem; background-color: #FAFAFA; min-height: 100vh; font-family: 'Inter', sans-serif; }
  .toast-mensagem { position: fixed; top: 20px; right: 20px; padding: 16px 24px; border-radius: 8px; color: white; font-weight: 600; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease-out forwards; }
  .toast-mensagem.sucesso { background-color: #005C6D; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .header-salas { margin-bottom: 2rem; }
  .header-title-wrapper { display: flex; align-items: center; gap: 20px; }
  .icon-header { width: 84px; height: auto; }
  .title-salas { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 64px; color: #005C6D; margin: 0; }
  .header-line { margin-top: 10px; height: 20px; background: #B20000; border-radius: 10px; width: 355px; position: relative; }
  .header-line::after { content: ''; position: absolute; left: calc(100% - 5px); top: 8px; width: 412px; height: 4px; background-color: #B20000; }
  .search-container { display: flex; margin: 2rem 0; max-width: 765px; height: 69px; }
  .search-input { flex: 1; border: 1px solid #818181; border-right: none; border-radius: 34px 0 0 34px; padding: 0 24px; font-size: 18px; color: #333; outline: none; }
  .search-button { width: 97px; background: #FFFFFF; border: 1px solid #818181; border-radius: 0 34px 34px 0; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .salas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 2.5rem; }
  .sala-card { background: #FFFFFF; border: 4px solid #757575; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
  .sala-imagem { width: 100%; height: 181px; object-fit: cover; border-bottom: 4px solid #757575; }
  .sala-info { padding: 1.5rem 2rem; display: flex; flex-direction: column; flex: 1; }
  .sala-nome-card { font-family: 'Roboto Slab', serif; font-weight: 500; font-size: 40px; color: #005C6D; margin: 0 0 1rem 0; border-left: 4px solid #005C6D; padding-left: 1rem; }
  .info-label { font-weight: 500; font-size: 20px; color: #757575; margin-bottom: 8px; display: block; }
  .pills-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }
  .pill-red { background: #B20000; color: #FFFFFF; border-radius: 20px; padding: 4px 12px; font-size: 14px; }
  .pill-gray { background: #757575; color: #FFFFFF; border-radius: 20px; padding: 6px 14px; font-size: 13px; }
  .btn-editar { margin-top: auto; background: #005C6D; color: #FFFFFF; border: none; border-radius: 20px; padding: 12px 0; font-size: 18px; font-weight: 600; cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
  .sub-modal-overlay { z-index: 1001; background: rgba(0, 0, 0, 0.6); }
  .modal-content { background: #FFFFFF; border-radius: 20px; width: 100%; max-width: 700px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; }
  .sub-modal-content { max-width: 400px; }
  .btn-close { position: absolute; top: 24px; right: 24px; background: none; border: none; cursor: pointer; }
  .modal-title { font-family: 'Roboto Slab', serif; font-size: 32px; color: #005C6D; margin-bottom: 24px; border-left: 4px solid #005C6D; padding-left: 12px; }
  .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-weight: 700; color: #3B3D41; }
  .form-group input, .form-group select { padding: 12px; border: 2px solid #D5D7D9; border-radius: 12px; outline: none; font-family: 'Inter', sans-serif; }
  .pill-editable { display: flex; align-items: center; gap: 4px; padding-right: 6px; }
  .pill-action-group { display: flex; gap: 4px; margin-left: 8px; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 6px; }
  .btn-icon-pill { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; opacity: 0.8; font-size: 12px; }
  .btn-icon-pill:hover { opacity: 1; }
  .btn-circle-add { width: 32px; height: 32px; border-radius: 50%; border: 2px dashed #757575; background: #FAFAFA; color: #757575; font-size: 20px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
  .btn-circle-add:hover { border-color: #005C6D; color: #005C6D; }
  .fotos-edit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-top: 8px; }
  .foto-edit-wrapper { position: relative; border-radius: 8px; overflow: hidden; height: 90px; border: 2px solid #D5D7D9; }
  .foto-edit-img { width: 100%; height: 100%; object-fit: cover; }
  .btn-delete-foto { position: absolute; top: 4px; right: 4px; background: #B20000; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: bold; }
  .btn-add-foto-label { border: 2px dashed #757575; background: #FAFAFA; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90px; cursor: pointer; color: #757575; font-weight: 600; font-size: 24px; transition: 0.2s; }
  .btn-add-foto-label:hover { border-color: #005C6D; color: #005C6D; }
  .modal-footer { display: flex; gap: 16px; margin-top: 24px; }
  .btn-save { flex: 1; padding: 14px; background: #B20000; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }
  .btn-cancel { flex: 1; padding: 14px; background: white; border: 1px solid #D5D7D9; border-radius: 12px; cursor: pointer; font-weight: 600; }
  .error-box { background: #B20000; color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }

  /* =========================================
     MEDIA QUERIES PARA RESPONSIVIDADE
     ========================================= */
  @media (max-width: 1024px) {
    .lista-salas-container { padding: 2rem; }
    .salas-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    .header-line { width: 250px; }
    .header-line::after { width: 300px; }
  }

  @media (max-width: 768px) {
    .lista-salas-container { padding: 80px 16px 40px; }
    .header-title-wrapper { gap: 12px; }
    .title-salas { font-size: 40px; }
    .icon-header { width: 50px; }
    
    .header-line { width: 150px; height: 16px; margin-top: 6px; }
    .header-line::after { width: 200px; height: 3px; top: 6px; }
    
    .search-container { margin: 1.5rem 0; height: 55px; max-width: 100%; }
    .search-input { font-size: 16px; padding: 0 16px; }
    .search-button { width: 70px; }
    
    .salas-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    
    .sala-info { padding: 1.2rem; }
    .sala-nome-card { font-size: 30px; margin-bottom: 0.8rem; }
    .info-label { font-size: 18px; }
    .btn-editar { font-size: 16px; padding: 10px 0; }
    
    .modal-content { padding: 24px 16px; max-height: 95vh; }
    .btn-close { top: 16px; right: 16px; }
    .modal-title { font-size: 24px; margin-bottom: 20px; }
    .modal-footer { flex-direction: column-reverse; gap: 12px; }
    .btn-save, .btn-cancel { width: 100%; padding: 12px; }
    
    .fotos-edit-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
  }

  @media (max-width: 480px) {
    .title-salas { font-size: 32px; }
    .icon-header { width: 40px; }
    .header-line { width: 120px; height: 12px; }
    .header-line::after { width: 150px; height: 2px; top: 5px; }
    
    .sala-imagem { height: 160px; }
    .sala-nome-card { font-size: 26px; }
    .info-label { font-size: 16px; }
    .pill-red, .pill-gray { font-size: 12px; padding: 4px 10px; }
    
    .foto-edit-wrapper, .btn-add-foto-label { height: 80px; }
  }
`;

export default function ListaSalasTecnico() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [salaEditando, setSalaEditando] = useState<Sala | null>(null);

  const [modalTecnologiaAberto, setModalTecnologiaAberto] = useState(false);
  const [novaTecnologiaNome, setNovaTecnologiaNome] = useState('');

  const [modalMaquinaAberto, setModalMaquinaAberto] = useState(false);
  const [maquinaForm, setMaquinaForm] = useState({ nome: 'Desktop', qtd: 1 });
  const [editandoMaquinaNome, setEditandoMaquinaNome] = useState<string | null>(null);

  const [modalExcluirFotoAberto, setModalExcluirFotoAberto] = useState(false);
  const [fotoIndexParaExcluir, setFotoIndexParaExcluir] = useState<number | null>(null);

  const [modalGerenciarDispositivos, setModalGerenciarDispositivos] = useState<{id: number, nome: string} | null>(null);
  
  useEffect(() => {
    const fetchSalas = async () => {
      try {
        setErroApi(null);
        const response = await api.get<any>('/inventarios');

        let arrayDeSalas = [];
        if (Array.isArray(response.data)) { arrayDeSalas = response.data; } 
        else if (response.data && Array.isArray(response.data.data)) { arrayDeSalas = response.data.data; }

        const salasFormatadas = arrayDeSalas.map((item: any) => {
          
          let arrayFotos: string[] = [];
          const fotoBD = item.fotoSala || item.sala?.fotoSala;
          if (fotoBD) {
            arrayFotos = fotoBD.split(',');
          }

          return {
            id: item.salaId, 
            idInventario: item.idInventario, 
            nome: item.salaNome || item.sala?.nomeSala || 'Sala Sem Nome',
            capacidade: item.capacidadeAlunos || item.sala?.capacidadeAlunos || 0,
            
            maquinas: Array.isArray(item.dispositivos) ? item.dispositivos.map((d: any) => ({
              id: d.idDispositivo || d.dispositivo?.idDispositivo,
              nome: d.nomeDispositivo || d.dispositivo?.nomeDispositivo || 'Dispositivo',
              qtd: d.quantidade || 1
            })) : [],

            tecnologias: Array.isArray(item.tecnologias) ? item.tecnologias.map((t: any) => ({
              id: t.idTecnologia || t.tecnologia?.idTecnologia,
              nome: t.nomeTecnologia || t.tecnologia?.nomeTecnologia || 'Tecnologia'
            })) : [],
            
            imagem: arrayFotos.length > 0 ? arrayFotos[0] : imgSala,
            fotos: arrayFotos
          };
        });

        setSalas(salasFormatadas);
      } catch (error: any) {
        console.error("Erro CRÍTICO na API:", error);
        setErroApi(error.message || "Erro desconhecido ao tentar acessar o backend.");
      }
    };
    fetchSalas();
  }, []);

  const salasFiltradas = useMemo(() => {
    let resultado = [...salas];
    if (busca.trim() !== '') {
      resultado = resultado.filter(sala => 
        sala.nome.toLowerCase().includes(busca.toLowerCase()) ||
        sala.tecnologias.some(tec => tec.nome.toLowerCase().includes(busca.toLowerCase()))
      );
    }
    return resultado;
  }, [busca, salas]);

  const abrirEdicao = (sala: Sala) => {
    setSalaEditando(JSON.parse(JSON.stringify(sala)));
    setModalEdicaoAberto(true);
  };
  const salvarEdicao = async () => {
    if (!salaEditando) return;

    try {
      const payloadInventario = {
        fotoSala: salaEditando.fotos, // Envia o array de URLs do Cloudinary
        capacidadeAlunos: salaEditando.capacidade,
        statusInventario: "ATIVO",
        dispositivos: salaEditando.maquinas.map((m: any) => ({ 
          id: m.id, nome: m.nome, quantidade: m.qtd 
        })),
        tecnologias: salaEditando.tecnologias.map((t: any) => ({ 
          id: t.id, nome: t.nome 
        }))
      };

      await api.put(`/inventarios/${salaEditando.idInventario}`, payloadInventario);

      // Atualiza o estado local para exibir as fotos novas imediatamente
      setSalas(prev => prev.map(s => s.id === salaEditando.id ? {
        ...salaEditando,
        imagem: salaEditando.fotos.length > 0 ? salaEditando.fotos[0] : imgSala
      } : s));

      setMensagem('Inventário atualizado!');
      setModalEdicaoAberto(false);
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      alert("Erro ao salvar alterações no banco.");
    }
  };
  
  const handleAddFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && salaEditando) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<{ url: string }>(
          '/inventarios/upload', 
          formData, 
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        setSalaEditando({ 
          ...salaEditando, 
          fotos: [...salaEditando.fotos, response.url] 
        });

        setMensagem("Imagem processada e adicionada!");
        setTimeout(() => setMensagem(null), 3000);

      } catch (err) {
        console.error("Erro no upload:", err);
        alert("Falha no upload para o Cloudinary.");
      }
    }
    e.target.value = '';
  };

  const solicitarRemocaoFoto = (index: number) => {
    setFotoIndexParaExcluir(index);
    setModalExcluirFotoAberto(true);
  };

  const confirmarRemocaoFoto = () => {
    if (fotoIndexParaExcluir !== null && salaEditando) {
      const novasFotos = [...salaEditando.fotos];
      novasFotos.splice(fotoIndexParaExcluir, 1);
      setSalaEditando({ ...salaEditando, fotos: novasFotos });
    }
    setModalExcluirFotoAberto(false);
    setFotoIndexParaExcluir(null);
  };

  const removerTecnologia = (idTecnologia: number) => {
    if(!salaEditando) return;
    setSalaEditando({ ...salaEditando, tecnologias: salaEditando.tecnologias.filter((t: Tecnologia) => t.id !== idTecnologia) });
  };

  const salvarNovaTecnologia = () => {
    if (novaTecnologiaNome.trim() !== '' && salaEditando) {
      setSalaEditando({ ...salaEditando, tecnologias: [...salaEditando.tecnologias, { id: Date.now(), nome: novaTecnologiaNome.trim() }] });
    }
    setModalTecnologiaAberto(false);
    setNovaTecnologiaNome('');
  };

  const removerMaquina = (nomeMaquina: string) => {
    if(!salaEditando) return;
    setSalaEditando({ ...salaEditando, maquinas: salaEditando.maquinas.filter((m: any) => m.nome !== nomeMaquina) });
  };

  const abrirModalAdicionarMaquina = () => {
    setEditandoMaquinaNome(null);
    setMaquinaForm({ nome: 'Desktop', qtd: 1 });
    setModalMaquinaAberto(true);
  };

  const abrirModalEditarMaquina = (maquina: Maquina) => {
    setEditandoMaquinaNome(maquina.nome);
    setMaquinaForm({ nome: maquina.nome, qtd: maquina.qtd });
    setModalMaquinaAberto(true);
  };
  console.log(`${removerMaquina}\n${abrirModalAdicionarMaquina}\n ${abrirModalEditarMaquina}`)

  const salvarMaquina = () => {
    if(!salaEditando) return;
    let novasMaquinas = [...salaEditando.maquinas];

    if (editandoMaquinaNome) {
      novasMaquinas = novasMaquinas.map(m => m.nome === editandoMaquinaNome ? { ...m, qtd: Number(maquinaForm.qtd) } : m);
    } else {
      const existente = novasMaquinas.find(m => m.nome === maquinaForm.nome);
      if (existente) {
        existente.qtd += Number(maquinaForm.qtd);
      } else {
        novasMaquinas.push({ id: Date.now(), nome: maquinaForm.nome, qtd: Number(maquinaForm.qtd) });
      }
    }
    setSalaEditando({ ...salaEditando, maquinas: novasMaquinas });
    setModalMaquinaAberto(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lista-salas-container">
        
        {mensagem && <div className="toast-mensagem sucesso">{mensagem}</div>}

        <header className="header-salas">
          <div className="header-title-wrapper">
            <img src={iconSala} alt="Ícone Salas" className="icon-header" />
            <h1 className="title-salas">Salas</h1>
          </div>
          <div className="header-line"></div>
        </header>

        {erroApi && (
          <div className="error-box">
            <h2 style={{margin: '0 0 10px 0'}}> A API do Backend falhou!</h2>
            <p style={{margin: '0'}}><strong>Motivo:</strong> {erroApi}</p>
            <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>Pressione F12 e olhe a aba "Network/Rede" para ver o erro real.</p>
          </div>
        )}

        <div className="search-container">
          <input type="text" placeholder="Pesquise uma sala ou tecnologia..." value={busca} onChange={(e) => setBusca(e.target.value)} className="search-input" />
          <button className="search-button"><img src={iconPesquisa} alt="Buscar" /></button>
        </div>

        <div className="salas-grid">
          {salasFiltradas.length > 0 ? (
            salasFiltradas.map(sala => (
              <div key={sala.id} className="sala-card">
                <img src={sala.fotos.length > 0 ? sala.fotos[0] : imgSala} alt={sala.nome} className="sala-imagem" />
                <div className="sala-info">
                  <h2 className="sala-nome-card">{sala.nome}</h2>
                  <span className="info-label">Capacidade: <span className="pill-red" style={{display: 'inline-block', marginLeft: '8px'}}>{sala.capacidade} alunos</span></span>
                  <span className="info-label">Máquinas:</span>
                  <div className="pills-container">
                    {sala.maquinas.map((maq, i) => (<span key={i} className="pill-red">{maq.nome}: {maq.qtd}</span>))}
                  </div>
                  <span className="info-label">Tecnologias:</span>
                  <div className="pills-container">
                    {sala.tecnologias.slice(0, 3).map((tec, i) => (<span key={i} className="pill-red">{tec.nome}</span>))}
                    {sala.tecnologias.length > 3 && <span className="pill-red">+ Mais</span>}
                  </div>
                  <button 
                    className="btn-editar !bg-white !text-[#005C6D] !border-2 !border-[#005C6D] mb-2" 
                    onClick={() => setModalGerenciarDispositivos({id: sala.id, nome: sala.nome})}
                  >
                    Gerenciar Dispositivos
                  </button>
                  <button className="btn-editar" onClick={() => abrirEdicao(sala)}>Editar Descrição</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', color: '#757575', fontSize: '18px', marginTop: '20px' }}>
              {erroApi ? "Não foi possível carregar as salas." : "Nenhuma sala encontrada no banco de dados."}
            </p>
          )}
        </div>

        {modalEdicaoAberto && salaEditando && (
          <div className="modal-overlay" onClick={() => setModalEdicaoAberto(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="btn-close" onClick={() => setModalEdicaoAberto(false)}><img src={iconX} alt="Fechar" /></button>
              <h2 className="modal-title">Editar {salaEditando.nome}</h2>

              <div className="form-group">
                <label>Fotos da Sala:</label>
                <div className="fotos-edit-grid">
                  {salaEditando.fotos.map((foto: string, i: number) => (
                    <div key={i} className="foto-edit-wrapper">
                      <img src={foto} alt="Sala" className="foto-edit-img" />
                      <button className="btn-delete-foto" type="button" onClick={() => solicitarRemocaoFoto(i)}>✕</button>
                    </div>
                  ))}
                  
                  <label className="btn-add-foto-label">
                    +
                    <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleAddFoto} />
                  </label>

                </div>
              </div>

              <div className="form-group" style={{marginTop: '24px'}}>
                <label>Capacidade da sala:</label>
                <div className="pill-red" style={{width: 'fit-content'}}>{salaEditando.capacidade} alunos</div>
              </div>

              <div className="form-group">
                <label>Tecnologias:</label>
                <div className="pills-container">
                  {salaEditando.tecnologias.map((tec: Tecnologia, i: number) => (
                    <span key={i} className="pill-gray pill-editable">
                      {tec.nome} 
                      <div className="pill-action-group">
                        <button type="button" className="btn-icon-pill" onClick={() => removerTecnologia(tec.id)}><img src={iconX} width="10" style={{filter: 'brightness(0) invert(1)'}} alt="Remover"/></button>
                      </div>
                    </span>
                  ))}
                  <button type="button" className="btn-circle-add" onClick={() => setModalTecnologiaAberto(true)}>+</button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setModalEdicaoAberto(false)}>Cancelar</button>
                <button type="button" className="btn-save" onClick={salvarEdicao}>Confirmar Edições</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAIS SECUNDÁRIOS */}
        {modalMaquinaAberto && (
          <div className="modal-overlay sub-modal-overlay" onClick={() => setModalMaquinaAberto(false)}>
            <div className="modal-content sub-modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{fontSize: '24px'}}>{editandoMaquinaNome ? 'Editar Máquina' : 'Adicionar Máquina'}</h2>
              <div className="form-group">
                <label>Tipo de Máquina:</label>
                <select value={maquinaForm.nome} onChange={e => setMaquinaForm({...maquinaForm, nome: e.target.value})} disabled={!!editandoMaquinaNome}>
                  <option value="Desktop">Desktop</option><option value="Notebook">Notebook</option><option value="Projetor">Projetor</option><option value="Televisão">Televisão</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantidade:</label>
                <input type="number" min="1" value={maquinaForm.qtd} onChange={e => setMaquinaForm({...maquinaForm, qtd: Number(e.target.value)})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setModalMaquinaAberto(false)}>Cancelar</button>
                <button type="button" className="btn-save" onClick={salvarMaquina}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {modalTecnologiaAberto && (
          <div className="modal-overlay sub-modal-overlay" onClick={() => setModalTecnologiaAberto(false)}>
            <div className="modal-content sub-modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{fontSize: '24px'}}>Nova Tecnologia</h2>
              <div className="form-group">
                <label>Nome da tecnologia/software:</label>
                <input type="text" autoFocus placeholder="Ex: Visual Studio 2022" value={novaTecnologiaNome} onChange={e => setNovaTecnologiaNome(e.target.value)} onKeyDown={e => e.key === 'Enter' && salvarNovaTecnologia()} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setModalTecnologiaAberto(false)}>Cancelar</button>
                <button type="button" className="btn-save" onClick={salvarNovaTecnologia}>Adicionar</button>
              </div>
            </div>
          </div>
        )}

        {modalExcluirFotoAberto && (
          <div className="modal-overlay sub-modal-overlay" onClick={() => setModalExcluirFotoAberto(false)}>
            <div className="modal-content sub-modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{fontSize: '24px', borderLeftColor: '#B20000', color: '#B20000'}}>Excluir Foto</h2>
              <p style={{color: '#3B3D41', fontSize: '16px', fontWeight: '500', marginBottom: '24px'}}>Tem certeza que deseja excluir esta foto da sala?</p>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setModalExcluirFotoAberto(false)}>Cancelar</button>
                <button type="button" className="btn-save" onClick={confirmarRemocaoFoto}>Excluir</button>
              </div>
            </div>
          </div>
        )}

        {modalGerenciarDispositivos && (
          <ModalGerenciarDispositivosSala 
            salaId={modalGerenciarDispositivos.id}
            salaNome={modalGerenciarDispositivos.nome}
            onClose={() => setModalGerenciarDispositivos(null)}
          />
        )}
      </div>
    </>
  );
}