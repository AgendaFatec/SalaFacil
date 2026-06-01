import { useState } from "react";
import { ApiService } from "../services/api";

interface Maquina {
  id?: number;
  nome: string;
  patrimonio?: string;
}

interface ModalAbrirChamadoProps {
  salaId: number;
  salaNome: string;
  dispositivos: Maquina[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

type TipoChamado = "Problema técnico" | "Instalação de tecnologia";
type TecnologiaSolicitada = { nome: string; versao: string };

const styles = `
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.42);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 48px 20px; z-index: 9999; overflow-y: auto;
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

  .tabela-tecnologias { border: 1px solid #d7d7d7; border-radius: 10px; overflow: hidden; }
  .tabela-header, .tabela-linha { display: grid; grid-template-columns: 1fr 1fr; padding: 10px 12px; font-size: 13px; }
  .tabela-header { background: #f0f0f0; font-weight: 700; color: #5e5e5e; }
  .tabela-linha { border-top: 1px solid #d7d7d7; }
  .btn-adicionar-lista { background: #005c6d; color: white; border: none; border-radius: 8px; padding: 8px; font-size: 12px; font-weight: 700; cursor: pointer; margin-top: 8px; width: 100%; }
`;

export function ModalAbrirChamado({ salaId, salaNome, dispositivos, onClose, onSuccess }: ModalAbrirChamadoProps) {
  const api = ApiService.getInstance();
  
  const [tipoChamado, setTipoChamado] = useState<TipoChamado>("Problema técnico");
  const [descricao, setDescricao] = useState("");
  
  // Hardware
  const [dispositivoSelecionadoId, setDispositivoSelecionadoId] = useState<number | "outro">("outro");
  const [dispositivoOutroNome, setDispositivoOutroNome] = useState("");
  const [patrimonioOutro, setPatrimonioOutro] = useState("");

  // Software
  const [nomeTecnologia, setNomeTecnologia] = useState("");
  const [versaoTecnologia, setVersaoTecnologia] = useState("");
  const [listaTecnologias, setListaTecnologias] = useState<TecnologiaSolicitada[]>([]);

  const [salvando, setSalvando] = useState(false);

  function adicionarTecnologia() {
    if (!nomeTecnologia.trim() || !versaoTecnologia.trim()) return;
    setListaTecnologias(lista => [...lista, { nome: nomeTecnologia.trim(), versao: versaoTecnologia.trim() }]);
    setNomeTecnologia("");
    setVersaoTecnologia("");
  }

  async function handleSubmit() {
    try {
      setSalvando(true);
      const usuarioId = await api.getUsuarioLogadoId();
      if (usuarioId == null) {
        alert("Usuário não autenticado. Faça login novamente.");
        setSalvando(false);
        return;
      }

      if (tipoChamado === "Problema técnico") {
        let dispositivoNomeFinal = "";
        let patrimonioFinal = "";

        if (dispositivoSelecionadoId === "outro") {
          if (!dispositivoOutroNome.trim()) return alert("Preencha o nome do dispositivo.");
          dispositivoNomeFinal = dispositivoOutroNome.trim();
          patrimonioFinal = patrimonioOutro.trim();
        } else {
          const maquina = dispositivos.find(m => m.id === dispositivoSelecionadoId);
          dispositivoNomeFinal = maquina?.nome || "Dispositivo";
          patrimonioFinal = maquina?.patrimonio || "";
        }

        if (!descricao.trim()) return alert("Preencha a descrição do problema.");

        await api.post("/chamados", {
          salaId,
          usuarioId,
          tipoProblema: "Hardware",
          dispositivo: dispositivoNomeFinal,
          patrimonio: patrimonioFinal,
          descricao: descricao.trim(),
        });
        
        onSuccess("Chamado criado com sucesso!");
      }

      if (tipoChamado === "Instalação de tecnologia") {
        if (listaTecnologias.length === 0) return alert("Adicione pelo menos uma tecnologia à lista.");

        await api.post("/chamados", {
          salaId,
          usuarioId,
          tipoProblema: "Software",
          descricao: descricao.trim() || "Solicitação de Instalação",
          tecnologias: listaTecnologias,
        });

        onSuccess("Chamado criado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar chamado.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>

          <div className="modal-header-line">
            <h2 className="modal-title">Abrir chamado - {salaNome}</h2>
          </div>

          <div className="modal-body">
            <div>
              <div className="modal-label">Qual o tipo de chamado?</div>
              <select className="select" value={tipoChamado} onChange={(e) => setTipoChamado(e.target.value as TipoChamado)}>
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
                    {dispositivos.length === 0 && <option value="outro" disabled>Nenhum dispositivo cadastrado nesta sala</option>}
                    {dispositivos.map((m, idx) => (
                      <option key={m.id || idx} value={m.id}>
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
                      <input className="input" value={dispositivoOutroNome} onChange={e => setDispositivoOutroNome(e.target.value)} placeholder="Ex: Desktop" />
                    </div>
                    <div>
                      <div className="modal-label">Patrimônio <span style={{color: '#7a7a7a', fontWeight: 500}}>(Opcional)</span>:</div>
                      <input className="input" value={patrimonioOutro} onChange={e => setPatrimonioOutro(e.target.value)} placeholder="Ex: 1234567" maxLength={7} />
                    </div>
                  </div>
                )}

                <div>
                  <div className="modal-label">Descrição do problema:</div>
                  <textarea className="textarea" value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
              </>
            )}

            {tipoChamado === "Instalação de tecnologia" && (
              <>
                <div className="row-2">
                  <div>
                    <div className="modal-label">Nome da tecnologia:</div>
                    <input className="input" value={nomeTecnologia} onChange={e => setNomeTecnologia(e.target.value)} placeholder="Ex: Node" />
                  </div>
                  <div>
                    <div className="modal-label">Versão:</div>
                    <input className="input" value={versaoTecnologia} onChange={e => setVersaoTecnologia(e.target.value)} placeholder="Ex: 1.0" />
                  </div>
                </div>

                <button type="button" className="btn-adicionar-lista" onClick={adicionarTecnologia}>
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
                      {listaTecnologias.map((tec, idx) => (
                        <div className="tabela-linha" key={idx}>
                          <span>{tec.nome}</span>
                          <span>{tec.versao}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="modal-label" style={{marginTop: '12px'}}>Detalhes adicionais <span style={{ color: '#7a7a7a', fontWeight: 500 }}>(Opcional):</span></div>
                  <textarea className="textarea" style={{minHeight: '60px'}} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Necessário para as aulas da disciplina X..." />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn-modal btn-modal-light" onClick={onClose} disabled={salvando}>Cancelar</button>
            <button className="btn-modal btn-modal-primary" onClick={handleSubmit} disabled={salvando}>
              {salvando ? "Salvando..." : "Abrir chamado"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}