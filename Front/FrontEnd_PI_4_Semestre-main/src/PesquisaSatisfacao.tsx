import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.svg";

type Profile = "professor" | "coordenador" | "ti";

interface Question {
  id: string;
  label: string;
  desc: string;
}

interface ProfileData {
  label: string;
  icon: string;
  focus: string;
  questions: Question[];
}

const profiles: Record<Profile, ProfileData> = {
  professor: {
    label: "Professor",
    icon: "👨‍🏫",
    focus:
      "Agilidade para reservar, clareza visual e facilidade para encontrar os recursos necessários para dar aula.",
    questions: [
      {
        id: "sat_geral",
        label: "Satisfação Geral",
        desc: "De 0 a 10, qual é o seu nível de satisfação geral com a plataforma SalaFácil?",
      },
      {
        id: "reserva",
        label: "Processo de Reserva",
        desc: "De 0 a 10, o quão fácil e intuitivo é o processo de agendar uma sala ou laboratório?",
      },
      {
        id: "recursos",
        label: "Clareza de Recursos",
        desc: "De 0 a 10, o quão claro é visualizar os softwares e hardwares disponíveis nas salas antes de realizar sua reserva?",
      },
      {
        id: "suporte",
        label: "Suporte (se aplicável)",
        desc: "De 0 a 10, como você avalia a facilidade de reportar um problema técnico em uma sala através do sistema?",
      },
    ],
  },
  coordenador: {
    label: "Coordenador",
    icon: "📊",
    focus:
      "Visão macro, monitoramento da ocupação da unidade e transparência para organização acadêmica.",
    questions: [
      {
        id: "sat_geral",
        label: "Satisfação Geral",
        desc: "De 0 a 10, qual é o seu nível de satisfação geral com o SalaFácil para auxiliar na gestão acadêmica?",
      },
      {
        id: "monitoramento",
        label: "Monitoramento",
        desc: "De 0 a 10, o quão fácil é acompanhar o mapa de ocupação e a rotina de reservas da sua unidade?",
      },
      {
        id: "confiabilidade",
        label: "Confiabilidade",
        desc: "De 0 a 10, o quão precisas e atualizadas você considera as informações de disponibilidade de salas apresentadas pelo sistema?",
      },
      {
        id: "apoio",
        label: "Apoio Operacional",
        desc: "De 0 a 10, o quanto o sistema reduziu a burocracia ou o tempo gasto na alocação de espaços para os professores?",
      },
    ],
  },
  ti: {
    label: "Equipe de TI",
    icon: "💻",
    focus:
      "Gestão de inventário, agilidade na atualização de status (Ativa/Manutenção) e recebimento de chamados.",
    questions: [
      {
        id: "sat_geral",
        label: "Satisfação Geral",
        desc: "De 0 a 10, qual é o seu nível de satisfação geral com o Painel do Técnico no SalaFácil?",
      },
      {
        id: "inventario",
        label: "Gestão de Inventário",
        desc: "De 0 a 10, o quão ágil e prático é o processo de atualizar as informações de hardware e tecnologias das salas?",
      },
      {
        id: "status",
        label: "Atualização de Status",
        desc: "De 0 a 10, o quão fácil é alternar o status de uma sala entre Ativa e Em Manutenção no sistema?",
      },
      {
        id: "chamados",
        label: "Recepção de Chamados (se aplicável)",
        desc: "De 0 a 10, como você avalia a organização e a clareza dos alertas/chamados técnicos recebidos pelo sistema?",
      },
    ],
  },
};

const SCORES = Array.from({ length: 11 }, (_, i) => i);

interface PesquisaSatisfacaoProps {
  profileType: "professor" | "coordenador" | "ti";
}

const PesquisaSatisfacao = ({ profileType }: PesquisaSatisfacaoProps) => {
  const navigate = useNavigate();
  const currentProfile: Profile = profileType;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openComment, setOpenComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [highlightMissing, setHighlightMissing] = useState<string | null>(null);

  useEffect(() => {
    const surveyKey = `pesquisa_viewed_${profileType}`;
    localStorage.setItem(
      surveyKey,
      JSON.stringify({ viewed: true, timestamp: Date.now() }),
    );
  }, [profileType]);

  const profile = profiles[currentProfile];
  const answeredCount = profile.questions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;
  const progress = Math.round((answeredCount / profile.questions.length) * 100);

  function handleScore(qid: string, val: number) {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
    if (highlightMissing === qid) setHighlightMissing(null);
  }

  function handleSubmit() {
    const unanswered = profile.questions.find(
      (q) => answers[q.id] === undefined,
    );
    if (unanswered) {
      setHighlightMissing(unanswered.id);
      document
        .getElementById(`question-${unanswered.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    console.log({ profile: currentProfile, answers, openComment });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-[#B20000] flex flex-col items-center justify-center p-6">
        <img
          src={logo}
          alt="Logo do SalaFácil"
          className="w-full max-w-55 mb-10 object-contain"
        />
        <div className="bg-white rounded-lg shadow-xl p-10 max-w-55 w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-[#B20000]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#B20000] mb-3 font-['Roboto_Slab',serif]">
            Obrigado pelo seu feedback!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed font-['Inter',sans-serif]">
            Suas respostas foram registradas com sucesso e contribuirão para
            melhorar o SalaFácil.
          </p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="mt-8 bg-[#B20000] text-white px-8 py-3 rounded-md font-semibold font-['Inter',sans-serif] hover:bg-red-800 transition-colors duration-200"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#B20000] flex flex-col items-center py-10 px-4 overflow-hidden">
      <img
        src={logo}
        alt="Logo do SalaFácil"
        className="w-full max-w-55 mb-10 object-contain"
      />
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-normal text-white tracking-[-0.02em] font-['Roboto_Slab',serif]">
            Pesquisa de Satisfação
          </h1>
          <p className="text-white/70 text-sm mt-2 font-['Inter',sans-serif]">
            Sua opinião nos ajuda a melhorar a plataforma para toda a
            comunidade.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-medium font-['Inter',sans-serif]">
                Progresso da Pesquisa
              </p>
              <p className="text-white font-semibold text-base tracking-wide">
                A barra abaixo mostra o andamento atual
              </p>
            </div>
            <span className="text-white/70 text-sm font-['Inter',sans-serif]">
              {progress}%
            </span>
          </div>

          <div className="text-white/60 text-xs font-['Inter',sans-serif] mb-4">
            {answeredCount} de {profile.questions.length} respondidas
          </div>

          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="w-full h-px bg-white/20 mb-5" />

        {profile.questions.map((q, qi) => (
          <div
            key={`${currentProfile}-${q.id}`}
            id={`question-${q.id}`}
            className={`bg-white rounded-lg shadow-md p-5 mb-4 transition-all duration-200 ${
              highlightMissing === q.id
                ? "ring-2 ring-offset-2 ring-offset-[#B20000] ring-white"
                : ""
            }`}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 font-['Inter',sans-serif]">
              {String(qi + 1).padStart(2, "0")} / {profile.questions.length}
            </p>
            <p className="text-base font-bold text-[#B20000] mb-1 font-['Roboto_Slab',serif]">
              {q.label}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 font-['Inter',sans-serif]">
              {q.desc}
            </p>

            <div className="flex gap-1.5 flex-wrap">
              {SCORES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleScore(q.id, s)}
                  className={`w-9 h-9 rounded-md text-sm font-semibold font-['Inter',sans-serif] transition-all duration-150 ${
                    answers[q.id] === s
                      ? s <= 3
                        ? "bg-red-800 border border-red-800 text-white"
                        : s <= 6
                          ? "bg-amber-500 border border-amber-500 text-white"
                          : "bg-[#B20000] border border-[#B20000] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#B20000] hover:text-[#B20000]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-['Inter',sans-serif]">
              <span>Muito insatisfeito</span>
              <span>Muito satisfeito</span>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-lg shadow-md p-5 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 font-['Inter',sans-serif]">
            Resposta livre
          </p>
          <p className="text-base font-bold text-[#B20000] mb-1 font-['Roboto_Slab',serif]">
            Como você descreveria sua experiência com o SalaFácil?
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 font-['Inter',sans-serif]">
            Conte com suas próprias palavras o que você pensa sobre o sistema —
            pontos positivos, dificuldades encontradas ou sugestões de melhoria.
          </p>
          <textarea
            value={openComment}
            onChange={(e) => setOpenComment(e.target.value)}
            placeholder="Escreva aqui sua experiência..."
            rows={4}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 font-['Inter',sans-serif] resize-y outline-none focus:border-[#B20000] focus:ring-1 focus:ring-[#B20000] transition-colors placeholder:text-gray-300"
          />
          <p className="text-xs text-gray-400 mt-1.5 font-['Inter',sans-serif]">
            Opcional
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="
            flex items-center justify-center w-full
            bg-white text-[#B20000] font-semibold font-['Inter',sans-serif]
            text-lg tracking-[-0.02em] whitespace-nowrap
            h-12 rounded-md shadow-lg
            transition-all duration-200 ease-in-out
            hover:scale-105 hover:bg-gray-100 active:scale-95
            mb-10
          "
        >
          Enviar avaliação
        </button>
      </div>
    </div>
  );
};

export default PesquisaSatisfacao;
