import { useState } from 'react';
import { api } from '../../services/api';
// import usuarioIcon from '../../assets/usuario.svg';
// import logo from '../../assets/logo.svg';

import type { TipoUser } from '../../interfaces/userProfile';

interface CriarUsuarioProps {
    onSuccess: () => void; // Chamado quando o usuário for criado com sucesso
}

const CriarUsuario = ({ onSuccess }: CriarUsuarioProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [tipoUser, setTipoUser] = useState<TipoUser>('DOCENTE');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleCreateUser = async () => {
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            await api.post('/Coordenacao/Criar_Usuario', {
                email: email.trim().toLowerCase(),
                tipoUser: tipoUser
            });
            onSuccess(); // Fecha o modal e atualiza a lista de usuários no pai
        } catch (error: any) {
            setErrorMsg(error.response?.data?.msg || "Erro ao processar criação.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-4">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Novo Usuário</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">E-mail Institucional</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 h-12 rounded-lg border border-gray-200 outline-none focus:border-[#B20000]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nível de Acesso</label>
                    <div className="flex gap-2">
                        {(['DOCENTE', 'ADM', 'TI'] as TipoUser[]).map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setTipoUser(role)}
                                className={`flex-1 py-2 rounded-lg font-bold text-sm ${tipoUser === role ? 'bg-[#B20000] text-white' : 'bg-gray-100'}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}

                <button 
                    onClick={handleCreateUser}
                    disabled={isSubmitting || !email}
                    className="w-full py-3 bg-[#005C6D] text-white font-bold rounded-lg"
                >
                    {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar Convite'}
                </button>
            </div>
        </div>
    );
};

export default CriarUsuario;

// import { useState } from 'react';
// import { api } from '../../services/api';
// import usuarioIcon from '../../assets/usuario.svg';
// import logo from '../../assets/logo.svg';

// import { useNavigate } from 'react-router-dom';
// // import type { CreateUserData } from '../../interfaces/userProfile';
// // type TipoUser = 'DOCENTE' | 'TI' | 'ADM';
// import type{ TipoUser } from '../../interfaces/userProfile';



// const CriarUsuario = () => {
//     const navigate = useNavigate();
    
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [creationSuccess, setCreationSuccess] = useState(false);
//     const [email, setEmail] = useState('');
//     const [tipoUser, setTipoUser] = useState<TipoUser>('DOCENTE');
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);

//     const handleCreateUser = async () => {
//         setIsSubmitting(true);
//         setErrorMsg(null);

//         try {
//             await api.post('/Coordenacao/Criar_Usuario', {
//                 email: email.trim().toLowerCase(),
//                 tipoUser: tipoUser
//             });

//             setCreationSuccess(true);
//         } catch (error: any) {
//             const msg = error.response?.data?.msg || "Erro ao processar criação. Se fodeu XD";
//             setErrorMsg(msg);
//             setIsSubmitting(false);
//         }
//     };

//     const handleBack = () => {
//         navigate('/dashboard-adm', { replace: true });
//     };

//     const handleNewCreation = () => {
//         setCreationSuccess(false);
//         setEmail('');
//         setIsSubmitting(false);
//     };

//     const renderContent = () => {
//         if (creationSuccess) {
//             return (
//                 <div className="flex flex-col items-center animate-fadeIn">
//                     <div className="text-center mb-8 font-['Roboto_Slab',serif]">
//                         <h2 className="text-3xl md:text-4xl text-[#B20000] font-bold">
//                             Convite enviado!
//                         </h2>
//                         <p className="text-lg mt-4 text-gray-600 font-['Inter',sans-serif]">
//                             O e-mail para <strong className="text-gray-800">{email}</strong> foi disparado.
//                         </p>
//                     </div>
                    
//                     <button 
//                         onClick={handleNewCreation}
//                         className="w-full max-w-sm bg-green-600 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-green-700 transition-all active:scale-95 mb-4"
//                     >
//                         Criar novo usuário
//                     </button>

//                     <button 
//                         onClick={handleBack}
//                         className="text-[#B20000] font-semibold hover:underline transition-all"
//                     >
//                         Voltar ao painel
//                     </button>
//                 </div>
//             );
//         }

//         return (
//             <div className="w-full max-w-lg animate-fadeIn">
//                 <div className="mb-8 text-center lg:text-left">
//                     <h2 className="text-3xl font-bold text-gray-800 font-['Roboto_Slab',serif]">
//                         Novo Usuário
//                     </h2>
//                     <p className="text-gray-500 mt-2">Preencha os dados para enviar o convite.</p>
//                 </div>

//                 <div className="space-y-6">
//                     <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">E-mail Institucional</label>
//                         <input
//                             type="email"
//                             placeholder="exemplo@fatec.sp.gov.br"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full px-5 h-14 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#B20000] outline-none transition-all text-gray-800 shadow-sm"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nível de Acesso</label>
//                         <div className="flex gap-3">
//                             {(['DOCENTE', 'ADM', 'TI'] as TipoUser[]).map((role) => (
//                                 <button
//                                     key={role}
//                                     type="button"
//                                     onClick={() => setTipoUser(role)}
//                                     className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
//                                         tipoUser === role 
//                                         ? 'bg-[#B20000] text-white border-[#B20000] shadow-md' 
//                                         : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
//                                     }`}
//                                 >
//                                     {role}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {errorMsg && (
//                         <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
//                             {errorMsg}
//                         </div>
//                     )}

//                     <button 
//                         onClick={handleCreateUser}
//                         disabled={isSubmitting || !email}
//                         className={`w-full h-14 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
//                             isSubmitting || !email
//                             ? 'bg-gray-300 cursor-not-allowed' 
//                             : 'bg-[#00525C] hover:bg-[#003d45] active:scale-95'
//                         }`}
//                     >
//                         {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar Convite'}
//                     </button>

//                     <button 
//                         onClick={handleBack}
//                         className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
//                     >
//                         Cancelar
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-6">
//             <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">
                
//                 {/* Lado Esquerdo - Branding */}
//                 <div className="flex flex-col items-center lg:items-start lg:w-1/2">
//                     <img 
//                         src={logo} 
//                         alt="Logo SalaFácil" 
//                         className="w-full max-w-[200px] md:max-w-xs mb-8 object-contain"
//                     />
//                     <div className="inline-flex items-center gap-3 bg-[#B20000]/10 px-6 py-3 rounded-2xl border border-[#B20000]/20">
//                         <img src={usuarioIcon} className="w-6 h-6" alt="" style={{ filter: 'invert(13%) sepia(94%) saturate(7473%) hue-rotate(356%) brightness(89%) contrast(106%)' }} />
//                         <span className="text-[#B20000] font-['Roboto_Slab',serif] text-2xl font-bold tracking-tight">Criação de Usuários</span>
//                     </div>
//                     <p className="mt-6 text-gray-500 text-center lg:text-left max-w-sm font-['Inter',sans-serif]">
//                         Gerencie o acesso da sua unidade de forma rápida e segura.
//                     </p>
//                 </div>

//                 {/* Linha Divisória (apenas desktop) */}
//                 <div className="hidden lg:block w-px h-80 bg-gray-200"></div>

//                 {/* Lado Direito - Conteúdo Dinâmico */}
//                 <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
//                     {renderContent()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CriarUsuario;