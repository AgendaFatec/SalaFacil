import CriarUsuario from "../pages/adm/criarUsuarios";

interface ModalProps {
    onClose: () => void;
    onUserCreated: () => void; 
}

export function ModalCriarUsuario({ onClose, onUserCreated }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400">✕</button>
        <CriarUsuario onSuccess={() => {
            onUserCreated(); // Atualiza a tabela na tela de gestão
            onClose();       // Fecha a modal
        }} />
      </div>
    </div>
  );
}