import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';
import {IconClipboard} from '@tabler/icons-react'
interface FrequenciaCount {
  salaNome: string;
  total: number;
}

export default function FrequenciaSalas() {
  const [dados, setDados] = useState<FrequenciaCount[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    api.get<FrequenciaCount[]>("/agendamentos/frequencia")
      .then(setDados)
      .catch(console.error);
  }, []);

  const totalGeral = dados.reduce((acc, curr) => acc + curr.total, 0);
  const salaDestaque = [...dados].sort((a, b) => b.total - a.total)[0]?.salaNome || "---";

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen font-['Inter']">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#005C6D] font-['Roboto_Slab']">Dashboard de Frequência</h1>
        <p className="text-gray-500">Visão geral de ocupação por ambiente</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#B20000]">
          <p className="text-xs font-bold text-gray-400 uppercase">Total de Reservas</p>
          <h2 className="text-3xl font-black text-gray-800">{totalGeral}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#005C6D]">
          <p className="text-xs font-bold text-gray-400 uppercase">Sala mais Utilizada</p>
          <h2 className="text-xl font-bold text-gray-800 truncate">{salaDestaque}</h2>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-[#005C6D] text-white font-bold py-4 px-6 rounded-2xl hover:bg-[#004a57] transition shadow-lg flex flex-col items-center justify-center gap-2"
        >
          <IconClipboard size={28} />
          <span>Ver Relatório Detalhado</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-700">Reservas por Sala</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados}>
                <XAxis dataKey="salaNome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                   {dados.map((_, index) => <Cell key={index} fill={index % 2 === 0 ? '#005C6D' : '#B20000'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-700">Distribuição Percentual</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dados} dataKey="total" nameKey="salaNome" outerRadius={100} label>
                  {dados.map((_, index) => <Cell key={index} fill={index % 2 === 0 ? '#005C6D' : '#B20000'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#005C6D]">Relatório Analítico</h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 text-2xl hover:text-black">✕</button>
            </div>
            <table className="w-full text-left">
              <thead className="border-b">
                <tr className="text-gray-400 text-xs uppercase"><th className="pb-3">Sala</th><th className="pb-3 text-right">Total</th></tr>
              </thead>
              <tbody>
                {dados.map((d, i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="py-3 font-bold text-gray-700">{d.salaNome}</td>
                    <td className="py-3 text-right font-mono">{d.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}