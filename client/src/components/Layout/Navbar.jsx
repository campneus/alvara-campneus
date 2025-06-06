import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  FileText, 
  ClipboardList, 
  BarChart2, 
  Bell
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/clientes', icon: <Users size={20} />, label: 'Clientes' },
    { path: '/localidades', icon: <MapPin size={20} />, label: 'Localidades' },
    { path: '/tipos-licencas', icon: <FileText size={20} />, label: 'Tipos de Licenças' },
    { path: '/licencas-taxas', icon: <ClipboardList size={20} />, label: 'Licenças e Taxas' },
    { path: '/relatorios', icon: <BarChart2 size={20} />, label: 'Relatórios' },
    { path: '/alertas', icon: <Bell size={20} />, label: 'Alertas' }
  ];

  return (
    <nav className="bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Sistema de Alvarás</h1>
      </div>
      <div className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

