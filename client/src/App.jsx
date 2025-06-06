import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
import ClienteList from './pages/Clientes/ClienteList';
import ClienteForm from './pages/Clientes/ClienteForm';
import LocalidadeList from './pages/Localidades/LocalidadeList';
import LocalidadeForm from './pages/Localidades/LocalidadeForm';
import TipoLicencaList from './pages/TiposLicencas/TipoLicencaList';
import TipoLicencaForm from './pages/TiposLicencas/TipoLicencaForm';
import LicencaTaxaList from './pages/LicencasTaxas/LicencaTaxaList';
import LicencaTaxaForm from './pages/LicencasTaxas/LicencaTaxaForm';
import DocumentosPage from './pages/LicencasTaxas/DocumentosPage';
import RelatorioPage from './pages/Relatorios/RelatorioPage';
import AlertasPage from './pages/Alertas/AlertasPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Clientes */}
          <Route path="/clientes" element={<ClienteList />} />
          <Route path="/clientes/novo" element={<ClienteForm />} />
          <Route path="/clientes/:id" element={<ClienteForm />} />
          
          {/* Localidades */}
          <Route path="/localidades" element={<LocalidadeList />} />
          <Route path="/localidades/nova" element={<LocalidadeForm />} />
          <Route path="/localidades/:id" element={<LocalidadeForm />} />
          
          {/* Tipos de Licenças */}
          <Route path="/tipos-licencas" element={<TipoLicencaList />} />
          <Route path="/tipos-licencas/novo" element={<TipoLicencaForm />} />
          <Route path="/tipos-licencas/:id" element={<TipoLicencaForm />} />
          
          {/* Licenças e Taxas */}
          <Route path="/licencas-taxas" element={<LicencaTaxaList />} />
          <Route path="/licencas-taxas/nova" element={<LicencaTaxaForm />} />
          <Route path="/licencas-taxas/:id" element={<LicencaTaxaForm />} />
          <Route path="/licencas-taxas/:id/documentos" element={<DocumentosPage />} />
          
          {/* Relatórios */}
          <Route path="/relatorios" element={<RelatorioPage />} />
          
          {/* Alertas */}
          <Route path="/alertas" element={<AlertasPage />} />
          
          {/* Rota padrão - redireciona para o dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

