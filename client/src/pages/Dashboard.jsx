import React, { useState, useEffect } from 'react';
import { dashboardAPI, alertaAPI } from '@/lib/api';
import { Activity, AlertTriangle, FileCheck, Clock } from 'lucide-react';
import MetricCard from '@/components/Dashboard/MetricCard';
import LicencasChart from '@/components/Dashboard/LicencasChart';
import ProjecaoChart from '@/components/Dashboard/ProjecaoChart';
import AlertasTable from '@/components/Dashboard/AlertasTable';
import { formatarMoeda } from '@/lib/utils';

const Dashboard = () => {
  const [metricas, setMetricas] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        
        // Carregar métricas do dashboard
        const dadosMetricas = await dashboardAPI.obterMetricas();
        setMetricas(dadosMetricas);
        
        // Carregar alertas de vencimento
        const dadosAlertas = await alertaAPI.obterAlertasVencimento(30);
        setAlertas(dadosAlertas);
        
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setErro('Não foi possível carregar os dados do dashboard. Por favor, tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Erro</h3>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total de Licenças/Taxas"
          value={metricas?.totalLicencasTaxas || 0}
          icon={<FileCheck />}
        />
        <MetricCard
          title="Licenças a Vencer (30 dias)"
          value={metricas?.licencasAVencer30Dias || 0}
          icon={<Clock />}
          description="Licenças que vencem nos próximos 30 dias"
        />
        <MetricCard
          title="Licenças Expiradas"
          value={metricas?.licencasExpiradas || 0}
          icon={<AlertTriangle />}
          description="Licenças com data de vencimento ultrapassada"
        />
        <MetricCard
          title="Pagamentos Pendentes"
          value={formatarMoeda(metricas?.valorTotalPendente || 0)}
          icon={<Activity />}
          description={`${metricas?.pagamentosPendentes || 0} pagamentos em aberto`}
        />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LicencasChart 
          data={metricas?.licencasPorTipo || []} 
          title="Licenças por Tipo"
        />
        <ProjecaoChart 
          data={metricas?.projecaoLicenciamentos || []}
        />
      </div>
      
      {/* Tabela de alertas */}
      <div className="mb-6">
        <AlertasTable alertas={alertas} />
      </div>
    </div>
  );
};

export default Dashboard;

