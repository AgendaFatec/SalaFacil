import{ useState } from 'react';

interface Props {
  onClose: () => void;
  onConfirm: (status: string, acoes: string) => void;
}

export function ModalAlterarStatus({ onClose, onConfirm }: Props) {
  const [visualStatus, setVisualStatus] = useState('Pendente');
  const [acoes, setAcoes] = useState('');

  const statusMap: Record<string, string> = {
    'Pendente': 'ABERTO',
    'Em análise': 'EM_ATENDIMENTO',
    'Resolvido': 'RESOLVIDO'
  };

  const handleConfirm = () => {
    onConfirm(statusMap[visualStatus], acoes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-200">
        
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1.5 h-12 bg-[#005C6D] rounded-full"></div>
           <h2 className="text-4xl font-bold text-[#005C6D]">Alterar status</h2>
        </div>

        <div className="space-y-6"> {/* ADICIONADO ESPAÇAMENTO ENTRE INPUTS AQUI */}
          <div>
            <label className="block text-gray-700 font-bold mb-3">Novo status da chamada</label>
            <div className="relative">
              <select 
                value={visualStatus}
                onChange={(e) => setVisualStatus(e.target.value)}
                className="w-full appearance-none border-2 border-[#B20000] rounded-2xl px-6 py-4 text-xl font-medium focus:outline-none bg-white cursor-pointer"
              >
                <option>Pendente</option>
                <option>Em análise</option>
                <option>Resolvido</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-3">Ações realizadas (Resolução)</label>
            <textarea 
              placeholder="Descreva o que foi feito para resolver o problema..."
              value={acoes}
              onChange={(e) => setAcoes(e.target.value)}
              className="w-full min-h-[120px] border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg font-medium focus:border-[#005C6D] focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex gap-6 mt-10">
          <button 
            onClick={onClose}
            className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-xl text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 py-4 bg-[#005C6D] text-white rounded-2xl font-bold text-xl hover:bg-[#004a58] transition-all shadow-lg active:scale-95"
          >
            Alterar
          </button>
        </div>
      </div>
    </div>
  );
}