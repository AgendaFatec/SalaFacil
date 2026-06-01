import React, { useState, useMemo, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

import iconSala from '../../assets/sala.svg';
import iconPesquisa from '../../assets/pesquisa.svg';
import iconFiltrar from '../../assets/filtrar.svg';
import iconSeta from '../../assets/seta.svg';
import iconX from '../../assets/x.svg';
import iconData from '../../assets/data.svg';
import iconHorario from '../../assets/horario.svg';
import imgSala from '../../assets/sala.png';

import { ModalAbrirChamado } from '../../modals/ModalAbrirChamada';

type Maquina = {
  id?: number;
  nome: string;
  qtd: number;
  patrimonio?: string;
  numeroSerie?: string;
};

type Sala = {
  id: number;
  idInventario: number;
  nome: string;
  capacidade: number;
  maquinas: Maquina[];
  tecnologias: string[];
  imagem: string;
  fotos: string[];
};

const styles = `
  .card-footer-actions {
    display: flex;
    flex-direction: column;
    gap: 12px; 
    margin-top: auto;
  }

  .btn-relatar-problema {
    background: #B20000;
    color: #FFFFFF;
    border: 2px solid #B20000;
    border-radius: 20px;
    padding: 12px 0;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    width: 100%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-relatar-problema:hover {
    background: #FFFFFF;
    color: #B20000;
    border-color: #B20000;
  }

  .lista-salas-container {
    padding: 2rem 4rem;
    background-color: #FAFAFA;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
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

  .header-salas { margin-bottom: 2rem; margin-top: 40px; }
  .header-title-wrapper { display: flex; align-items: center; gap: 20px; }
  .icon-header { width: 84px; height: auto; }
  .title-salas { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 64px; color: #005C6D; margin: 0; }
  .header-line { margin-top: 10px; height: 20px; background: #B20000; border-radius: 10px; width: 355px; position: relative; }
  .header-line::after {
    content: ''; position: absolute; left: calc(100% - 5px); top: 8px;
    width: 412px; height: 4px; background-color: #B20000;
  }

  .search-container { display: flex; margin: 2rem 0; max-width: 765px; height: 69px; } 
  .search-input {
    flex: 1; border: 1px solid #818181; border-right: none;
    border-radius: 34px 0 0 34px; padding: 0 24px; font-size: 18px; color: #333; outline: none;
  }
  .search-button {
    width: 97px; background: #FFFFFF; border: 1px solid #818181;
    border-radius: 0 34px 34px 0; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .filters-container { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem; justify-content: flex-start; } 
  
  .filter-box {
    background: #FFFFFF; border: 1px solid #757575; border-radius: 8px;
    height: 46px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px; cursor: pointer; min-width: 200px; position: relative;
    user-select: none;
  }
  .filter-box-content { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 16px; }
  .filter-text { font-weight: 500; font-size: 14px; color: #757575; white-space: nowrap; }
  
  .custom-checkbox { accent-color: #B20000; width: 16px; height: 16px; cursor: pointer; }

  .dropdown-menu {
    position: absolute; top: calc(100% + 4px); left: 0; background: white; 
    border: 1px solid #757575; border-radius: 8px; padding: 8px; 
    z-index: 10; min-width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: flex; flex-direction: column; gap: 4px;
  }
  .dropdown-item {
    display: flex; align-items: center; gap: 10px; padding: 8px; cursor: pointer;
    border-radius: 4px; transition: background 0.2s; font-size: 14px; color: #3B3D41;
  }
  .dropdown-item:hover { background: #f0f0f0; }

  .salas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 2.5rem; padding-bottom: 4rem; }
  .sala-card { background: #FFFFFF; border: 4px solid #757575; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s; }
  .sala-card:hover { transform: translateY(-5px); }
  .sala-imagem { width: 100%; height: 181px; object-fit: cover; border-bottom: 4px solid #757575; }
  .sala-info { padding: 1.5rem 2rem; display: flex; flex-direction: column; flex: 1; }
  .sala-nome-card { font-family: 'Roboto Slab', serif; font-weight: 500; font-size: 40px; color: #005C6D; margin: 0 0 1rem 0; border-left: 4px solid #005C6D; padding-left: 1rem; }
  .info-row, .info-section { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .info-section { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .info-label { font-weight: 500; font-size: 20px; color: #757575; }
  .pills-container { display: flex; flex-wrap: wrap; gap: 8px; }
  .pill-red { background: #B20000; color: #FFFFFF; border-radius: 20px; padding: 4px 12px; font-size: 14px; font-weight: 600; }
  .pill-outline-red { background: #FFFFFF; color: #B20000; border: 2px solid #B20000; border-radius: 20px; padding: 4px 12px; font-size: 14px; font-weight: 600; }
  .pill-gray { background: #757575; color: #FFFFFF; border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 700; }
  .btn-solicitar { margin-top: auto; background: #005C6D; color: #FFFFFF; border: none; border-radius: 20px; padding: 12px 0; font-size: 18px; font-weight: 600; cursor: pointer; text-align: center; width: 100%; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
  .modal-content { background: #FFFFFF; border-radius: 20px; width: 100%; max-width: 654px; padding: 32px 40px; position: relative; display: flex; flex-direction: column; gap: 24px; max-height: 90vh; overflow-y: auto; }
  .btn-close { position: absolute; top: 24px; right: 24px; background: none; border: none; cursor: pointer; padding: 4px; }
  .modal-header-line { border-left: 3px solid #005C6D; padding-left: 12px; }
  .modal-title { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 36px; color: #005C6D; margin: 0; }
  .modal-label { font-weight: 700; font-size: 16px; color: #3B3D41; margin: 0 0 8px 0; }
  .mt-4 { margin-top: 24px; }
  .mt-2 { margin-top: 8px; }
  .modal-footer { display: flex; gap: 16px; margin-top: 16px; }
  .btn-cancel { flex: 1; padding: 12px; background: #FFFFFF; border: 1px solid #D5D7D9; border-radius: 12px; font-weight: 500; color: #3B3D41; cursor: pointer; }
  .btn-confirm { flex: 1; padding: 12px; background: #B20000; border: none; border-radius: 12px; font-weight: 500; color: #FFFFFF; cursor: pointer; }

  .galeria-container { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .foto-destaque { width: 100%; height: 320px; object-fit: cover; border-radius: 12px; border: 2px solid #D5D7D9; }
  .thumbnails-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
  .thumbnail-img { width: 100px; height: 75px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 3px solid transparent; opacity: 0.6; transition: 0.2s; }
  .thumbnail-img:hover { opacity: 1; }
  .thumbnail-img.ativa { border-color: #005C6D; opacity: 1; }

  .form-reserva { display: flex; flex-direction: column; gap: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-weight: 700; font-size: 14px; color: #3B3D41; }
  .form-row { display: flex; gap: 16px; }
  .form-group.half { flex: 1; }
  .input-with-icon { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 12px; width: 20px; pointer-events: none; }
  .input-with-icon input, .input-with-icon select, .form-group textarea { width: 100%; border: 2px solid #D5D7D9; border-radius: 12px; padding: 10px 16px; font-family: 'Inter', sans-serif; font-size: 14px; outline: none; color: #19191B; }
  .input-with-icon input { padding-left: 40px; }
  
  .input-with-icon select.has-icon-pad { padding-left: 40px; } 

  .input-with-icon select { appearance: none; background-image: url('../assets/seta.svg'); background-repeat: no-repeat; background-position: right 16px center; cursor: pointer; }
  .input-with-icon select:focus { border-color: #B20000; }

  .pill-editable { display: flex; align-items: center; gap: 8px; }
  .btn-remove-pill { background: none; border: none; color: white; cursor: pointer; font-weight: bold; padding: 0 4px; }

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

  @media (max-width: 768px) {
    .lista-salas-container { padding: 1rem; }
    .title-salas { font-size: 48px; }
    .header-line::after { display: none; }
    .salas-grid { grid-template-columns: 1fr; }
    .form-row { flex-direction: column; }
    .modal-footer { flex-direction: column; }
    .search-container { flex-direction: column; height: auto; border-radius: 12px; overflow: hidden; border: 1px solid #818181; }
    .search-input { border: none; border-radius: 0; padding: 16px; width: 100%; box-sizing: border-box; }
    .search-button { width: 100%; height: 50px; border: none; border-top: 1px solid #818181; border-radius: 0; }
  }
`;

export default function ListaSalasDocentes() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [busca, setBusca] = useState('');
  
  const [ordenacao, setOrdenacao] = useState('');
  const [filtroOrdemAberto, setFiltroOrdemAberto] = useState(false);
  const [filtroMaquinaAberto, setFiltroMaquinaAberto] = useState(false);
  const [maquinasSelecionadas, setMaquinasSelecionadas] = useState<string[]>([]);
  
  const ordemRef = useRef<HTMLDivElement>(null);
  const maquinaRef = useRef<HTMLDivElement>(null);
  const calendarioRef = useRef<HTMLDivElement>(null);
  
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalReservaAberto, setModalReservaAberto] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<any>(null);
  const [fotoAtual, setFotoAtual] = useState<string>(''); 

  const [dataReserva, setDataReserva] = useState('');
  const [dataReservaIso, setDataReservaIso] = useState('');
  const [horariosSelecionados, setHorariosSelecionados] = useState<string[]>([]);
  const [motivoReserva, setMotivoReserva] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [dataVisualizacao, setDataVisualizacao] = useState(new Date());

  const [modalChamadoAberto, setModalChamadoAberto] = useState(false);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await api.get<any>('/inventarios');

        let arrayDeSalas = [];
        if (Array.isArray(response.data)) { arrayDeSalas = response.data; } 
        else if (response.data && Array.isArray(response.data.data)) { arrayDeSalas = response.data.data; }

        const salasFormatadas = arrayDeSalas.map((item: any) => {
          let arrayFotos: string[] = [];
          const fotoBD = item.fotoSala || item.sala?.fotoSala;
          if (fotoBD) { arrayFotos = fotoBD.split(','); }

          return {
            id: item.salaId, 
            idInventario: item.idInventario, 
            nome: item.salaNome || item.sala?.nomeSala || 'Sala Sem Nome',
            capacidade: item.capacidadeAlunos || item.sala?.capacidadeAlunos || 0,
            
            maquinas: Array.isArray(item.dispositivos) ? item.dispositivos.map((d: any) => ({
              id: d.idDispositivo || d.dispositivo?.idDispositivo,
              nome: d.nomeDispositivo || d.dispositivo?.nomeDispositivo || 'Dispositivo',
              qtd: d.quantidade || 1,
              patrimonio: d.patrimonio || d.dispositivo?.patrimonio,
              numeroSerie: d.numeroSerie || d.dispositivo?.numeroSerie
            })) : [],
            
            tecnologias: Array.isArray(item.tecnologias) ? item.tecnologias.map((t: any) => (
              t.nomeTecnologia || t.tecnologia?.nomeTecnologia || 'Tecnologia'
            )) : [],
            
            imagem: arrayFotos.length > 0 ? arrayFotos[0] : imgSala,
            fotos: arrayFotos.length > 0 ? arrayFotos : [imgSala]
          };
        });

        setSalas(salasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar salas do banco:", error);
      }
    };
    fetchSalas();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ordemRef.current && !ordemRef.current.contains(event.target as Node)) setFiltroOrdemAberto(false);
      if (maquinaRef.current && !maquinaRef.current.contains(event.target as Node)) setFiltroMaquinaAberto(false);
      if (calendarioRef.current && !calendarioRef.current.contains(event.target as Node)) setCalendarioAberto(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const todasMaquinas = useMemo(() => {
    const maquinas = new Set<string>();
    salas.forEach(sala => sala.maquinas.forEach(m => maquinas.add(m.nome)));
    return Array.from(maquinas);
  }, [salas]);

  const toggleMaquina = (nomeMaquina: string) => {
    setMaquinasSelecionadas(prev => 
      prev.includes(nomeMaquina) ? prev.filter(m => m !== nomeMaquina) : [...prev, nomeMaquina]
    );
  };

  const mapOrdenacaoTexto: Record<string, string> = {
    '': 'Ordenar por..',
    'capacidade-maior': 'Maior Capacidade',
    'capacidade-menor': 'Menor Capacidade'
  };

  const salasFiltradas = useMemo(() => {
    let resultado = [...salas];
    if (busca.trim() !== '') {
      resultado = resultado.filter(sala =>
        sala.nome.toLowerCase().includes(busca.toLowerCase()) ||
        sala.tecnologias.some(tec => tec.toLowerCase().includes(busca.toLowerCase()))
      );
    }
    if (maquinasSelecionadas.length > 0) {
      resultado = resultado.filter(sala =>
        sala.maquinas.some(maq => maquinasSelecionadas.includes(maq.nome))
      );
    }
    if (ordenacao === 'capacidade-maior') resultado.sort((a, b) => b.capacidade - a.capacidade);
    else if (ordenacao === 'capacidade-menor') resultado.sort((a, b) => a.capacidade - b.capacidade);
    return resultado;
  }, [busca, maquinasSelecionadas, ordenacao, salas]);

  const abrirDetalhes = (sala: any) => { 
    setSalaSelecionada(sala); 
    setFotoAtual(sala.fotos[0]);
    setModalDetalhesAberto(true); 
  };
  
  const abrirReserva = (sala: any, e?: React.MouseEvent) => { 
    if (e) e.stopPropagation(); 
    setSalaSelecionada(sala); 
    setModalDetalhesAberto(false); 
    setModalReservaAberto(true); 
  };
  
  const fecharModais = () => { 
    setModalDetalhesAberto(false); 
    setModalReservaAberto(false); 
    setSalaSelecionada(null); 
    setCalendarioAberto(false);
  };

  const selecionarData = (dia: number) => {
    const d = new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth(), dia);
    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(dataVisualizacao.getMonth() + 1).padStart(2, '0');
    const anoStr = dataVisualizacao.getFullYear();
    const diasExtenso = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const nomeSemana = diasExtenso[d.getDay()];

    setDataReserva(`${diaStr}/${mesStr}/${anoStr} (${nomeSemana})`);
    setDataReservaIso(`${anoStr}-${mesStr}-${diaStr}`);
    setCalendarioAberto(false);
  };

  const confirmarReserva = async () => {
    if (!salaSelecionada || !dataReservaIso || horariosSelecionados.length === 0) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, selecione uma data e pelo menos um horário.' });
      setTimeout(() => setMensagem(null), 4000);
      return;
    }

    let usuarioIdLogado = null;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: number }>(token);
        usuarioIdLogado = decoded.sub;
      } catch (e) {
        console.error("Erro ao ler o token JWT:", e);
      }
    }

    try {
      const promises = horariosSelecionados.map(horario => {
        const [horaInicio, horaFim] = horario.split(' as ');
        return api.post('/agendamentos/solicitar-reserva', {
          salaId: salaSelecionada.id,
          usuarioId: usuarioIdLogado,
          dataAgendamento: new Date(`${dataReservaIso}T00:00:00Z`).toISOString(),
          horaInicio: horaInicio.trim(),
          horaFim: horaFim.trim(),
          descricao: motivoReserva
        });
      });

      await Promise.all(promises);

      setMensagem({ tipo: 'sucesso', texto: 'Solicitações de reserva enviadas com sucesso!' });
      fecharModais();
      setDataReserva(''); setHorariosSelecionados([]); setMotivoReserva(''); setDataReservaIso('');
    } catch (error: any) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: error.response?.data?.message || 'Erro ao solicitar reserva. Verifique a disponibilidade da sala.' });
    }
    setTimeout(() => setMensagem(null), 4000);
  };

  const diasDoMes = new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth() + 1, 0).getDate();
  const primeiroDiaDaSemana = new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth(), 1).getDay();
  const diasArr = Array.from({length: diasDoMes}, (_, i) => i + 1);
  const espacosArr = Array.from({length: primeiroDiaDaSemana}, (_, i) => i);
  const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const diasSemanaNomes = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const mudarMes = (delta: number) => {
    setDataVisualizacao(new Date(dataVisualizacao.getFullYear(), dataVisualizacao.getMonth() + delta, 1));
  };


  const abrirChamadoTecnico = (sala: any) => {
    setSalaSelecionada(sala);
    setModalDetalhesAberto(false); 
    setModalChamadoAberto(true);   
  };
  return (
    <>
      <style>{styles}</style>

      <div className="lista-salas-container">
        
        {mensagem && (
          <div className={`toast-mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}

        <header className="header-salas">
          <div className="header-title-wrapper">
            <img src={iconSala} alt="Ícone Salas" className="icon-header" />
            <h1 className="title-salas">Salas</h1>
          </div>
          <div className="header-line"></div>
        </header>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Pesquise uma sala ou tecnologia usando uma palavra-chave..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <img src={iconPesquisa} alt="Pesquisar" />
          </button>
        </div>

        <div className="filters-container">
          
          <div className="filter-box" ref={ordemRef} onClick={() => setFiltroOrdemAberto(!filtroOrdemAberto)}>
            <div className="filter-box-content">
              <span className="filter-text">{mapOrdenacaoTexto[ordenacao]}</span>
              <img src={iconSeta} alt="Seta" className="filter-icon" />
            </div>
            {filtroOrdemAberto && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => setOrdenacao('')}>Limpar ordenação</div>
                <div className="dropdown-item" onClick={() => setOrdenacao('capacidade-maior')}>Maior Capacidade</div>
                <div className="dropdown-item" onClick={() => setOrdenacao('capacidade-menor')}>Menor Capacidade</div>
              </div>
            )}
          </div>

          <div className="filter-box" ref={maquinaRef} onClick={() => setFiltroMaquinaAberto(!filtroMaquinaAberto)}>
            <div className="filter-box-content">
              <span className="filter-text">
                Filtrar por máquinas {maquinasSelecionadas.length > 0 && `(${maquinasSelecionadas.length})`}
              </span>
              <img src={iconFiltrar} alt="Filtrar" className="filter-icon" />
            </div>
            {filtroMaquinaAberto && (
              <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                {todasMaquinas.map(maq => (
                  <label key={maq} className="dropdown-item">
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={maquinasSelecionadas.includes(maq)}
                      onChange={() => toggleMaquina(maq)}
                    />
                    <span>{maq}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="salas-grid">
          {salasFiltradas.length > 0 ? (
            salasFiltradas.map(sala => (
              <div key={sala.id} className="sala-card" onClick={() => abrirDetalhes(sala)}>
                <img src={sala.imagem} alt={sala.nome} className="sala-imagem" />

                <div className="sala-info">
                  <h2 className="sala-nome-card">{sala.nome}</h2>
                  <div className="info-row">
                    <span className="info-label">Capacidade:</span>
                    <span className="pill-red">{sala.capacidade} alunos</span>
                  </div>
                  <div className="info-section">
                    <span className="info-label">Máquinas:</span>
                    <div className="pills-container">
                        {sala.maquinas.map((maq: any, index: number) => (
                          <span key={index} className="pill-gray">{maq.nome}: {maq.qtd}</span>
                        ))}
                      </div>
                  </div>
                  <div className="info-section">
                    <span className="info-label">Tecnologias:</span>
                    <div className="pills-container">
                      {sala.tecnologias.slice(0, 3).map((tec: string, index: number) => (
                        <span key={index} className="pill-red">{tec}</span>
                      ))}
                      {sala.tecnologias.length > 3 && (
                        <span className="pill-outline-red">+ Mais</span>
                      )}
                    </div>
                  </div>
                  <div className="card-footer-actions">
                  <button 
                    className="btn-relatar-problema" 
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirChamadoTecnico(sala);
                    }}
                  >
                    Relatar Problema
                  </button>

                  <button className="btn-solicitar" onClick={(e) => abrirReserva(sala, e)}>
                    Solicitar reserva
                  </button>
                </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', color: '#757575' }}>
              Nenhuma sala encontrada com esses filtros.
            </p>
          )}
        </div>

        {modalDetalhesAberto && salaSelecionada && (
          <div className="modal-overlay" onClick={fecharModais}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="btn-close" onClick={fecharModais}>
                <img src={iconX} alt="Fechar" />
              </button>
              <div className="modal-header-line"><h2 className="modal-title">{salaSelecionada.nome}</h2></div>
              
              <div className="modal-body">
                <div className="galeria-container">
                  <img src={fotoAtual} alt="Destaque da sala" className="foto-destaque" />
                  {salaSelecionada.fotos.length > 1 && (
                    <div className="thumbnails-row">
                      {salaSelecionada.fotos.map((foto: string, index: number) => (
                        <img 
                          key={index} 
                          src={foto} 
                          alt={`Miniatura ${index + 1}`} 
                          className={`thumbnail-img ${fotoAtual === foto ? 'ativa' : ''}`}
                          onClick={() => setFotoAtual(foto)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="modal-label">Capacidade da sala:</p>
                <span className="pill-red modal-pill" style={{width: 'fit-content', display: 'inline-block'}}>{salaSelecionada.capacidade} alunos</span>
                
                <p className="modal-label mt-4">Máquinas:</p>
                <div className="pills-container">
                  {salaSelecionada.maquinas.map((maq: any, idx: number) => (
                    <span key={idx} className="pill-gray">{maq.nome}: {maq.qtd}</span>
                  ))}
                </div>
                
                <p className="modal-label mt-4">Tecnologias:</p>
                <div className="pills-container">
                  {salaSelecionada.tecnologias.map((tec: string, idx: number) => (
                    <span key={idx} className="pill-gray">{tec}</span>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={fecharModais}>Cancelar</button>
                <button className="btn-confirm" onClick={() => abrirReserva(salaSelecionada)}>Reservar sala</button>
              </div>
            </div>
          </div>
        )}

        {modalReservaAberto && salaSelecionada && (
          <div className="modal-overlay" onClick={fecharModais}>
            <div className="modal-content modal-reserva" onClick={e => e.stopPropagation()}>
              <button className="btn-close" onClick={fecharModais}>
                <img src={iconX} alt="Fechar" />
              </button>
              <div className="modal-header-line"><h2 className="modal-title">Reservar sala</h2></div>
              
              <div className="modal-body form-reserva">
                <div className="form-group">
                  <label>Qual sala deseja reservar?</label>
                  <div className="input-with-icon">
                    <select defaultValue={salaSelecionada.nome}>
                      {salas.map(s => <option key={s.id} value={s.nome}>{s.nome}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half" ref={calendarioRef}>
                    <label>Data da reserva</label>
                    <div className="input-with-icon" onClick={() => setCalendarioAberto(!calendarioAberto)} style={{ cursor: 'pointer' }}>
                      <img src={iconData} alt="Data" className="input-icon" />
                      <input 
                        type="text" 
                        placeholder="Selecione a data" 
                        value={dataReserva} 
                        readOnly 
                        style={{ cursor: 'pointer' }}
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

                  <div className="form-group half">
                    <label>Horários da reserva</label>
                    <div className="input-with-icon">
                      <img src={iconHorario} alt="Horário" className="input-icon" />
                      <select 
                        className="has-icon-pad"
                        value="" 
                        onChange={e => {
                          const val = e.target.value;
                          if (val && !horariosSelecionados.includes(val)) {
                            setHorariosSelecionados([...horariosSelecionados, val]);
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
                    {horariosSelecionados.length > 0 && (
                      <div className="pills-container mt-2">
                        {horariosSelecionados.map((horario, idx) => (
                          <span key={idx} className="pill-gray pill-editable">
                            {horario.replace('as', 'às')}
                            <button 
                              type="button" 
                              className="btn-remove-pill" 
                              onClick={() => setHorariosSelecionados(horariosSelecionados.filter(h => h !== horario))}
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Motivo da Reserva</label>
                  <textarea rows={4} value={motivoReserva} onChange={e => setMotivoReserva(e.target.value)}></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={fecharModais}>Cancelar</button>
                <button className="btn-confirm" onClick={confirmarReserva}>Confirmar reserva</button>
              </div>
            </div>
          </div>
        )}

      
        {modalChamadoAberto && salaSelecionada && (
          <ModalAbrirChamado 
            salaId={salaSelecionada.id}
            salaNome={salaSelecionada.nome}
            dispositivos={salaSelecionada.maquinas}
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