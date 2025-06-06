import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            &copy; {currentYear} Sistema de Controle de Taxas e Alvarás. Todos os direitos reservados.
          </div>
          <div className="text-sm text-gray-600 mt-2 md:mt-0">
            Versão 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

