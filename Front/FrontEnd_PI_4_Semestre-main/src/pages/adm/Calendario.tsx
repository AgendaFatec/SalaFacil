import React, { useMemo, useState, useEffect } from "react";
import { api } from "../../services/api";

import iconCalendario from "../../assets/calendario_FATEC.png";
import iconFiltro from "../../assets/filtrar.svg";
import iconSeta from "../../assets/seta.svg";

type ModoVisualizacao = "dia" | "semana" | "mes" | "lista";

type Reserva = {
  id: number;
  titulo: string;
  professor: string;
  sala: string;
  data: string;
  inicio: string;
  fim: string;
  status: "reservado";
};

const horarios = ["07:30", "09:20", "11:10", "14:50", "16:40"];

const horariosExibicao: Record<string, string> = {
  "07:30": "07:30\n09:10",
  "09:20": "09:20\n11:00",
  "11:10": "11:10\n13:00",
  "14:50": "14:50\n16:30",
  "16:40": "16:40\n18:20",
};

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const diasSemana = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];

const diasSemanaCurto = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const styles = `
  * { box-sizing: border-box; }

  .calendario-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', Arial, sans-serif;
    color: #333;
  }

  .calendario-header { 
    margin-bottom: 26px; 
    margin-top: 40px; 
  }

  .calendario-header-row {
    display: flex;
    align-items: flex-end;
    gap: 14px;
  }

  .calendario-header-icon {
    width: 52px;
    height: 52px;
    object-fit: contain;
  }

  .calendario-header-title {
    margin: 0;
    font-family: 'Roboto Slab', Georgia, serif;
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

  .calendario-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    margin-top: 18px;
  }

  .calendario-toolbar-esquerda {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .calendario-toolbar-direita {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .btn-hoje {
    height: 32px;
    padding: 0 16px;
    border: 1px solid #D5D7D9;
    border-radius: 6px;
    background: #ffffff;
    color: #3B3D41;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-nav-data {
    width: 28px;
    height: 28px;
    border: 1px solid #D5D7D9;
    border-radius: 4px;
    background: #ffffff;
    color: #3B3D41;
    font-size: 16px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .calendario-data-label {
    margin-left: 12px;
    font-size: 15px;
    font-weight: 700;
    color: #3B3D41;
    text-transform: capitalize;
  }

  .btn-modo {
    min-width: 50px;
    height: 32px;
    padding: 0 14px;
    border: 1px solid #D5D7D9;
    border-radius: 6px;
    background: #ffffff;
    color: #757575;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-modo.ativo {
    background: #c40000;
    color: #ffffff;
    border-color: #c40000;
  }

  .calendario-subtoolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .filtro-bloco {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .filtro-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #757575;
    font-weight: 600;
  }

  .filtro-label img {
    width: 18px;
    height: 18px;
  }

  .filtro-select-wrap {
    position: relative;
    width: 220px;
  }

  .filtro-select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 42px;
    border: 1px solid #D5D7D9;
    border-radius: 8px;
    background: #FFFFFF;
    padding: 0 38px 0 16px;
    font-size: 14px;
    font-weight: 600;
    color: #3B3D41;
    cursor: pointer;
    outline: none;
  }

  .filtro-select-icone {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    pointer-events: none;
  }

  .calendario-content {
    background: #ffffff;
    border: 1px solid #D5D7D9;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  }

  /* DIA */
  .dia-agenda {
    display: flex;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    overflow: hidden;
  }

  .dia-coluna-horarios {
    width: 90px;
    background: #F9FAFB;
    border-right: 1px solid #E5E7EB;
    flex-shrink: 0;
  }

  .dia-horario {
    height: 70px;
    border-bottom: 1px solid #E5E7EB;
    padding: 12px 10px;
    font-size: 13px;
    font-weight: 700;
    color: #4B5563;
    white-space: pre-line;
  }

  .dia-grade {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .dia-linha {
    min-height: 70px;
    border-bottom: 1px solid #E5E7EB;
    padding: 10px 14px;
    background: #ffffff;
  }

  .dia-linha:last-child, .dia-horario:last-child {
    border-bottom: none;
  }

  .mini-box-reserva {
    width: 100%;
    max-width: 250px;
    background: #fdeeee;
    border: 1px solid #ef6b6b;
    border-radius: 6px;
    padding: 10px;
  }

  .mini-box-titulo {
    font-size: 13px;
    font-weight: 700;
    color: #B20000;
    margin-bottom: 4px;
  }

  .mini-box-professor {
    font-size: 11px;
    font-weight: 600;
    color: #4B5563;
  }

/* SEMANA */
  .calendario-grade-semana {
    display: grid;
    grid-template-columns: 80px repeat(6, 1fr);
    grid-template-rows: 44px repeat(5, minmax(70px, auto));
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
  }

  .calendario-canto-vazio {
    background: #F9FAFB;
    border-right: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
  }

  .cabecalho-dia-semana {
    background: #ffffff;
    border-right: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .cabecalho-dia-semana:last-child { border-right: none; }

  .cabecalho-dia-semana.destacado { background: #fdeeee; }

  .cabecalho-dia-nome {
    font-size: 11px;
    font-weight: 700;
    color: #6B7280;
  }

  .cabecalho-dia-numero {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
  }

  .cabecalho-dia-bolinha {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #B20000;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }

  .semana-hora {
    background: #F9FAFB;
    border-right: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
    padding: 12px 8px;
    font-size: 12px;
    font-weight: 700;
    color: #4B5563;
    white-space: pre-line;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .celula-semana {
    border-right: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
    padding: 6px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }

  .mini-box-semana {
    width: 100%;
    min-height: 50px;
    background: #fdeeee;
    border: 1px solid #ef6b6b;
    border-radius: 4px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-shrink: 0;
  }

  .mini-box-semana .mini-box-titulo {
    font-size: 11px;
    margin-bottom: 2px;
    font-weight: bold;
    color: #B20000;
    word-break: break-word; 
    white-space: normal;
  }
  
  .mini-box-semana .mini-box-professor {
    font-size: 9px;
    color: #4B5563;
    word-break: break-word;
    white-space: normal;
  }

  /* MÊS */
  .calendario-grade-mes {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    overflow: hidden;
  }

  .cabecalho-mes {
    height: 36px;
    background: #F9FAFB;
    border-right: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #4B5563;
    font-weight: 700;
  }

  .celula-mes {
    min-height: 120px;
    border-right: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
    background: #ffffff;
    padding: 10px;
  }
  .celula-mes.vazia { background: #FAFAFA; }

  .numero-dia-mes {
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    margin-bottom: 8px;
  }

  .eventos-dia-mes {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .evento-mes {
    background: #B20000;
    color: #ffffff;
    border-radius: 4px;
    padding: 6px 8px;
    line-height: 1.3;
  }

  .evento-mes-topo {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }

  .evento-mes-bolinha {
    width: 6px;
    height: 6px;
    background: #ffffff;
    border-radius: 50%;
  }

  .evento-mes-hora, .evento-mes-professor {
    font-size: 10px;
  }
  .evento-mes-titulo {
    font-size: 11px;
    font-weight: 700;
  }

  /* LISTA */
  .calendario-lista {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .item-lista-reserva {
    border: 1px solid #efcaca;
    background: #fdeeee;
    border-radius: 8px;
    padding: 16px;
  }

  .item-lista-linha-superior {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .item-lista-horario {
    font-size: 13px;
    color: #4B5563;
    font-weight: 700;
  }

  .item-lista-badge {
    background: #B20000;
    color: #ffffff;
    font-size: 11px;
    border-radius: 999px;
    padding: 4px 10px;
    font-weight: 700;
  }

  .item-lista-titulo {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }

  /* RODAPÉ */
  .calendario-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-top: 24px;
  }

  .calendario-legenda {
    display: flex;
    gap: 20px;
    font-size: 12px;
    color: #4B5563;
  }

  .legenda-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .legenda-quadrado {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  .legenda-quadrado.branco { background: #E5E7EB; }
  .legenda-quadrado.vermelho { background: #B20000; }

  @media (max-width: 900px) {
    .calendario-page { padding: 24px 16px; }
    .calendario-header-title { font-size: 36px; }
    .calendario-content { overflow-x: auto; }
    .dia-agenda, .calendario-grade-semana, .calendario-grade-mes { min-width: 800px; }
  }
`;

function formatarDataISO(data: Date) {
  return data.toISOString().split("T")[0];
}

function formatarTituloDia(data: Date) {
  return `${data.getDate()} de ${meses[data.getMonth()]} (${data.getFullYear()})`;
}

function getSemanaAtual(dataBase: Date) {
  const data = new Date(dataBase);
  const dia = data.getDay();
  const diffInicio = dia === 0 ? -6 : 1 - dia;
  const inicio = new Date(data);
  inicio.setDate(data.getDate() + diffInicio);

  const semana: Date[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    semana.push(d);
  }

  return semana;
}

function getDiasDoMes(dataBase: Date) {
  const ano = dataBase.getFullYear();
  const mes = dataBase.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);

  const inicioIndice = primeiroDia.getDay();
  const totalDias = ultimoDia.getDate();

  const dias: Array<Date | null> = [];

  for (let i = 0; i < inicioIndice; i++) dias.push(null);
  for (let dia = 1; dia <= totalDias; dia++) dias.push(new Date(ano, mes, dia));
  while (dias.length % 7 !== 0) dias.push(null);

  return dias;
}

function somarDias(data: Date, qtd: number) {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + qtd);
  return nova;
}

export default function CalendarioVisualizacaoAdm() {
  const [modo, setModo] = useState<ModoVisualizacao>("dia");
  const [dataAtual, setDataAtual] = useState(new Date());
  
  const [reservasDb, setReservasDb] = useState<Reserva[]>([]);
  const [salasDisponiveis, setSalasDisponiveis] = useState<string[]>([]);
  const [filtroSala, setFiltroSala] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAgendamentos, resSalas] = await Promise.all([
          api.get('/agendamentos'),
          api.get('/inventarios').catch(() => ({ data: [] }))
        ]);

        const inventariosData = (resSalas as any).data;
        const listaSalas = Array.isArray(inventariosData) ? inventariosData : (inventariosData?.data || []);
        
        const nomesSalas = new Set<string>();
        listaSalas.forEach((item: any) => {
          const nome = item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`;
          if (nome) nomesSalas.add(nome);
        });
        setSalasDisponiveis(Array.from(nomesSalas));

        const agendamentosData = (resAgendamentos as any).data;
        const listaReservas = Array.isArray(agendamentosData) ? agendamentosData : (agendamentosData?.data || []);

        const formatadas: Reserva[] = listaReservas
          .filter((item: any) => item.statusAgendamento === "AGENDADO")
          .map((item: any) => {
            let dataFormatada = "";
            if (item.dataAgendamento) {
              const d = new Date(item.dataAgendamento);
              dataFormatada = d.toISOString().split("T")[0]; 
            }

            return {
              id: item.idAgendamento || item.id,
              titulo: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
              sala: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
              professor: item.docenteNome || "Professor não identificado",
              data: dataFormatada,
              inicio: item.horaInicio,
              fim: item.horaFim,
              status: "reservado"
            };
          });

        setReservasDb(formatadas);
      } catch (error) {
        console.error("Erro ao buscar dados para o calendário:", error);
      }
    };

    fetchData();
  }, []);

  const reservasFiltradas = useMemo(() => {
    if (!filtroSala.trim()) return reservasDb;
    const termo = filtroSala.toLowerCase().trim();
    return reservasDb.filter((r) => r.sala.toLowerCase().includes(termo));
  }, [filtroSala, reservasDb]);

  const reservasDoDia = useMemo(() => {
    const iso = formatarDataISO(dataAtual);
    return reservasFiltradas.filter((r) => r.data === iso);
  }, [dataAtual, reservasFiltradas]);

  const reservasDaSemana = useMemo(() => {
    const semana = getSemanaAtual(dataAtual).map((d) => formatarDataISO(d));
    return reservasFiltradas.filter((r) => semana.includes(r.data));
  }, [dataAtual, reservasFiltradas]);

  const reservasDoMes = useMemo(() => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    return reservasFiltradas.filter((r) => {
      const d = new Date(`${r.data}T00:00:00`);
      return d.getFullYear() === ano && d.getMonth() === mes;
    });
  }, [dataAtual, reservasFiltradas]);

  const mudarAnterior = () => {
    if (modo === "dia") setDataAtual(somarDias(dataAtual, -1));
    if (modo === "semana") setDataAtual(somarDias(dataAtual, -7));
    if (modo === "mes" || modo === "lista") {
      setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1));
    }
  };

  const mudarProximo = () => {
    if (modo === "dia") setDataAtual(somarDias(dataAtual, 1));
    if (modo === "semana") setDataAtual(somarDias(dataAtual, 7));
    if (modo === "mes" || modo === "lista") {
      setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1));
    }
  };

  const renderTitulo = () => {
    if (modo === "dia") return formatarTituloDia(dataAtual);

    if (modo === "semana") {
      const semana = getSemanaAtual(dataAtual);
      const inicio = semana[0];
      const fim = semana[5];
      return `${meses[dataAtual.getMonth()]} - Semana ${Math.ceil(
        (inicio.getDate() + 6) / 7
      )} (${inicio.getDate()}-${fim.getDate()}/${dataAtual.getFullYear()})`;
    }

    return `${meses[dataAtual.getMonth()]} (${dataAtual.getFullYear()})`;
  };

  const renderDia = () => {
    return (
      <div className="dia-wrapper">
        <div className="dia-agenda">
          <div className="dia-coluna-horarios">
            {horarios.map((h) => (
              <div key={h} className="dia-horario">
                {horariosExibicao[h]}
              </div>
            ))}
          </div>

          <div className="dia-grade">
            {horarios.map((h) => {
              const reserva = reservasDoDia.find((r) => r.inicio === h);

              return (
                <div key={h} className={`dia-linha ${reserva ? "tem-reserva" : ""}`}>
                  {reserva && (
                    <div className="mini-box-reserva">
                      <div className="mini-box-titulo">{reserva.sala}</div>
                      <div className="mini-box-professor">{reserva.professor}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSemana = () => {
    const semana = getSemanaAtual(dataAtual);
    const diaDestaque = dataAtual.getDate();

    return (
      <div className="semana-wrapper">
        <div className="calendario-grade-semana">
          <div className="calendario-canto-vazio"></div>

          {semana.map((dia) => {
            const destacado = dia.getDate() === diaDestaque;

            return (
              <div key={dia.toISOString()} className={`cabecalho-dia-semana ${destacado ? "destacado" : ""}`}>
                <span className="cabecalho-dia-nome">
                  {diasSemana[dia.getDay()].replace("-feira", "")}
                </span>
                {destacado ? (
                  <span className="cabecalho-dia-bolinha">{dia.getDate()}</span>
                ) : (
                  <span className="cabecalho-dia-numero">{dia.getDate()}</span>
                )}
              </div>
            );
          })}

          {horarios.map((hora) => (
            <React.Fragment key={hora}>
              <div className="calendario-hora-slot semana-hora">
                {horariosExibicao[hora].split("\n").map((linha, i) => (
                  <span key={i}>{linha}</span>
                ))}
              </div>

              {semana.map((dia) => {
                const iso = formatarDataISO(dia);
                const reserva = reservasDaSemana.find(
                  (r) => r.data === iso && r.inicio === hora
                );

                return (
                  <div key={`${iso}-${hora}`} className={`celula-semana ${reserva ? "tem-reserva" : ""}`}>
                    {reserva && (
                      <div className="mini-box-semana">
                        <div className="mini-box-titulo">{reserva.sala}</div>
                        <div className="mini-box-professor">{reserva.professor}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderMes = () => {
    const dias = getDiasDoMes(dataAtual);

    return (
      <div className="calendario-grade-mes">
        {diasSemanaCurto.map((dia) => (
          <div key={dia} className="cabecalho-mes">
            {dia}
          </div>
        ))}

        {dias.map((dia, index) => {
          if (!dia) {
            return <div key={index} className="celula-mes vazia"></div>;
          }

          const iso = formatarDataISO(dia);
          const reservasDia = reservasDoMes.filter((r) => r.data === iso);

          return (
            <div key={iso} className="celula-mes">
              <div className="numero-dia-mes">{dia.getDate()}</div>

              <div className="eventos-dia-mes">
                {reservasDia.map((reserva) => (
                  <div key={reserva.id} className="evento-mes">
                    <div className="evento-mes-topo">
                      <span className="evento-mes-bolinha"></span>
                      <span className="evento-mes-hora">
                        {reserva.inicio} - {reserva.fim}
                      </span>
                    </div>
                    <div className="evento-mes-titulo">{reserva.titulo}</div>
                    <div className="evento-mes-professor">{reserva.professor}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLista = () => (
    <div className="calendario-lista">
      {reservasDoMes.map((reserva) => (
        <div key={reserva.id} className="item-lista-reserva">
          <div className="item-lista-linha-superior">
            <span className="item-lista-horario">
              {reserva.data.split('-').reverse().join('/')} | {reserva.inicio} - {reserva.fim}
            </span>
            <span className="item-lista-badge">{reserva.sala}</span>
          </div>
          <div className="item-lista-titulo">{reserva.professor}</div>
        </div>
      ))}
      {reservasDoMes.length === 0 && (
        <div style={{ textAlign: "center", color: "#6B7280", marginTop: "20px" }}>
          Nenhuma reserva aprovada para este mês.
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      <div className="calendario-page">
        <header className="calendario-header">
          <div className="calendario-header-row">
            <img
              src={iconCalendario}
              alt="Calendário"
              className="calendario-header-icon"
            />
            <h1 className="calendario-header-title">Calendário</h1>
          </div>

          <div className="header-line-wrap">
            <div className="header-line-main"></div>
            <div className="header-line-tail"></div>
          </div>
        </header>

        <section className="calendario-toolbar">
          <div className="calendario-toolbar-esquerda">
            <button
              type="button"
              className="btn-hoje"
              onClick={() => setDataAtual(new Date())}
            >
              Hoje
            </button>

            <button type="button" className="btn-nav-data" onClick={mudarAnterior}>
              ‹
            </button>

            <button type="button" className="btn-nav-data" onClick={mudarProximo}>
              ›
            </button>

            <span className="calendario-data-label">{renderTitulo()}</span>
          </div>

          <div className="calendario-toolbar-direita">
            <button
              type="button"
              className={`btn-modo ${modo === "dia" ? "ativo" : ""}`}
              onClick={() => setModo("dia")}
            >
              Dia
            </button>

            <button
              type="button"
              className={`btn-modo ${modo === "semana" ? "ativo" : ""}`}
              onClick={() => setModo("semana")}
            >
              Semana
            </button>

            <button
              type="button"
              className={`btn-modo ${modo === "mes" ? "ativo" : ""}`}
              onClick={() => setModo("mes")}
            >
              Mês
            </button>

            <button
              type="button"
              className={`btn-modo ${modo === "lista" ? "ativo" : ""}`}
              onClick={() => setModo("lista")}
            >
              Lista
            </button>
          </div>
        </section>

        <section className="calendario-subtoolbar">
          <div className="filtro-bloco">
            <div className="filtro-label">
              <img src={iconFiltro} alt="Filtro" />
              <span>Filtros:</span>
            </div>

            <div className="filtro-select-wrap">
              <select
                className="filtro-select"
                value={filtroSala}
                onChange={(e) => setFiltroSala(e.target.value)}
              >
                <option value="">Filtrar por sala...</option>
                {salasDisponiveis.map((sala) => (
                  <option key={sala} value={sala}>
                    {sala}
                  </option>
                ))}
              </select>

              <img
                src={iconSeta}
                alt="Abrir seleção"
                className="filtro-select-icone"
              />
            </div>
          </div>
        </section>

        <section className="calendario-content">
          {modo === "dia" && renderDia()}
          {modo === "semana" && renderSemana()}
          {modo === "mes" && renderMes()}
          {modo === "lista" && renderLista()}
        </section>

        <footer className="calendario-footer">
          <div className="calendario-legenda">
            <div className="legenda-item">
              <span className="legenda-quadrado branco"></span>
              <span>Horário Livre</span>
            </div>

            <div className="legenda-item">
              <span className="legenda-quadrado vermelho"></span>
              <span>Sala Reservada</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}