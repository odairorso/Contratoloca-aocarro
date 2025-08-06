import React from 'react';

const LogoSVG = ({ className = '', showFullLogo = false }) => {
  if (showFullLogo) {
    return (
      <svg 
        className={className} 
        viewBox="0 0 800 400" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background amarelo */}
        <rect x="0" y="0" width="400" height="400" fill="#FFD700"/>
        
        {/* Background azul */}
        <polygon points="400,0 800,0 800,400 500,400" fill="#1E3A8A"/>
        
        {/* Logo circular */}
        <circle cx="80" cy="80" r="35" fill="#1E3A8A" stroke="#FFD700" strokeWidth="3"/>
        <text x="80" y="70" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold">OLIVEIRA</text>
        <text x="80" y="85" textAnchor="middle" fill="#FFD700" fontSize="10">VEÍCULOS</text>
        
        {/* Título principal */}
        <text x="50" y="140" fill="#1E3A8A" fontSize="28" fontWeight="bold">OLIVEIRA</text>
        <text x="50" y="170" fill="#1E3A8A" fontSize="28" fontWeight="bold">VEÍCULOS</text>
        
        {/* Subtítulo */}
        <text x="50" y="195" fill="#1E3A8A" fontSize="12" fontWeight="bold">COMPRA • VENDA • TROCA • CONSIGNAÇÃO</text>
        <text x="50" y="215" fill="#1E3A8A" fontSize="14" fontWeight="bold">LOCAÇÃO DE VEÍCULOS</text>
        
        {/* Informações de contato */}
        <text x="50" y="245" fill="#1E3A8A" fontSize="12">👤 João Roberto</text>
        <text x="50" y="265" fill="#1E3A8A" fontSize="12">📞 6799622.9840</text>
        <text x="50" y="285" fill="#1E3A8A" fontSize="12">📞 673461.9864</text>
        <text x="50" y="305" fill="#1E3A8A" fontSize="12">✉️ veiculos.oliveira@gmail.com</text>
        
        {/* Lado direito - Título */}
        <text x="520" y="80" fill="#FFD700" fontSize="32" fontWeight="bold">Oliveira</text>
        <text x="520" y="120" fill="#FFD700" fontSize="24" fontWeight="bold">ALUGUEL DE CARRO</text>
        
        {/* Período de locação */}
        <text x="520" y="160" fill="#FFD700" fontSize="18" fontWeight="bold">SEMANAL E MENSAL</text>
        
        {/* Orçamento */}
        <text x="520" y="190" fill="#FFD700" fontSize="14">*** FAÇA UM ORÇAMENTO</text>
        
        {/* Serviços */}
        <text x="520" y="220" fill="#FFD700" fontSize="12">▶ LIMPO E ABASTECIDO</text>
        <text x="520" y="240" fill="#FFD700" fontSize="12">▶ VEÍCULO COMPLETO</text>
        <text x="520" y="260" fill="#FFD700" fontSize="12">▶ RÁDIO/BLUETOOTH</text>
        
        {/* Preço */}
        <text x="520" y="300" fill="#FFD700" fontSize="16" fontWeight="bold">DIÁRIA A PARTIR DE:</text>
        <text x="520" y="330" fill="#FFD700" fontSize="24" fontWeight="bold">R$ 280,00</text>
        
        {/* Carros decorativos */}
        <rect x="650" y="150" width="80" height="40" rx="20" fill="#4A5568" opacity="0.8"/>
        <rect x="680" y="320" width="80" height="40" rx="20" fill="#4A5568" opacity="0.8"/>
      </svg>
    );
  }

  // Logo simples para uso em contratos
  return (
    <svg 
      className={className} 
      viewBox="0 0 300 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect x="0" y="0" width="300" height="100" fill="#FFD700" rx="10"/>
      
      {/* Logo circular */}
      <circle cx="40" cy="50" r="25" fill="#1E3A8A" stroke="#FFD700" strokeWidth="2"/>
      <text x="40" y="45" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold">OLIVEIRA</text>
      <text x="40" y="55" textAnchor="middle" fill="#FFD700" fontSize="6">VEÍCULOS</text>
      
      {/* Texto principal */}
      <text x="80" y="35" fill="#1E3A8A" fontSize="18" fontWeight="bold">OLIVEIRA VEÍCULOS</text>
      <text x="80" y="55" fill="#1E3A8A" fontSize="10">LOCAÇÃO DE VEÍCULOS</text>
      <text x="80" y="70" fill="#1E3A8A" fontSize="8">veiculos.oliveira@gmail.com</text>
      <text x="80" y="85" fill="#1E3A8A" fontSize="8">📞 (67) 99622-9840</text>
    </svg>
  );
};

export default LogoSVG;