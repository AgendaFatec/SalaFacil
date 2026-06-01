import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const DashboardAdm = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen w-full bg-[#B20000] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Logo */}
            <img 
                src={logo} 
                alt="Logo do SalaFácil" 
                className="w-full max-w-[250px] mb-8 object-contain"
            />
            
            {/* Card de Boas-vindas */}
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
                <h1 className="text-3xl font-bold text-[#B20000] mb-4 font-['Roboto_Slab',serif]">
                    Área da Coordenação
                </h1>
                
                <p className="text-gray-700 text-lg mb-8 font-['Inter',sans-serif]">
                    Você fez login com sucesso como <strong>Administrador (ADM)</strong>. <br/><br/>
                    Esta página servirá como o painel principal para gerenciar o sistema em breve.
                </p>
                
                <button 
                    onClick={handleLogout}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200 font-['Inter',sans-serif]"
                >
                    Voltar ao Login
                </button>
            </div>
        </div>
    );
};

export default DashboardAdm;