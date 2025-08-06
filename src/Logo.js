import React from 'react';

const Logo = ({ className = "w-48 h-auto", showFullLogo = false }) => {
  if (showFullLogo) {
    return (
      <svg
        className={className}
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <defs>
          <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        
        {/* Yellow section */}
        <polygon points="0,0 450,0 400,400 0,400" fill="url(#yellowGrad)" />
        
        {/* Blue section */}
        <polygon points="400,0 800,0 800,400 350,400" fill="url(#blueGrad)" />
        
        {/* Red diagonal */}
        <polygon points="400,0 450,0 400,400 350,400" fill="#DC2626" />
        
        {/* Oliveira logo circle */}
        <circle cx="80" cy="80" r="35" fill="#1E3A8A" stroke="#FFD700" strokeWidth="3" />
        <text x="80" y="70" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold">OLIVEIRA</text>
        <text x="80" y="85" textAnchor="middle" fill="#FFD700" fontSize="8">VEÍCULOS</text>
        
        {/* Main title */}
        <text x="30" y="130" fill="#1E3A8A" fontSize="36" fontWeight="bold">OLIVEIRA</text>
        <text x="30" y="165" fill="#1E3A8A" fontSize="36" fontWeight="bold">VEÍCULOS</text>
        
        {/* Subtitle */}
        <text x="30" y="190" fill="#1E3A8A" fontSize="12" fontWeight="bold">COMPRA • VENDA • TROCA • CONSIGNAÇÃO</text>
        <text x="30" y="210" fill="#1E3A8A" fontSize="14" fontWeight="bold">LOCAÇÃO DE VEÍCULOS</text>
        
        {/* Contact info */}
        <text x="30" y="240" fill="#1E3A8A" fontSize="14" fontWeight="bold">👤 João Roberto</text>
        <text x="30" y="260" fill="#059669" fontSize="14" fontWeight="bold">📞 6799622.9840</text>
        <text x="30" y="280" fill="#059669" fontSize="14" fontWeight="bold">📞 673461.9864</text>
        <text x="30" y="300" fill="#059669" fontSize="14" fontWeight="bold">✉️ veiculos.oliveira@gmail.com</text>
        
        {/* Right side - Rental info */}
        <text x="480" y="60" fill="#FFD700" fontSize="28" fontWeight="bold" fontStyle="italic">Oliveira</text>
        <text x="480" y="100" fill="#FFD700" fontSize="24" fontWeight="bold">ALUGUEL DE CARRO</text>
        
        <text x="480" y="140" fill="white" fontSize="16" fontWeight="bold">SEMANAL E MENSAL</text>
        <text x="480" y="165" fill="white" fontSize="12">*** FAÇA UM ORÇAMENTO</text>
        
        {/* Features */}
        <text x="500" y="190" fill="white" fontSize="12">▶ LIMPO E ABASTECIDO</text>
        <text x="500" y="210" fill="white" fontSize="12">▶ VEÍCULO COMPLETO</text>
        <text x="500" y="230" fill="white" fontSize="12">▶ RÁDIO/BLUETOOTH</text>
        
        <text x="480" y="270" fill="white" fontSize="18" fontWeight="bold">DIÁRIA A PARTIR DE:</text>
        <text x="480" y="300" fill="#FFD700" fontSize="24" fontWeight="bold" fontStyle="italic">R$ 280,00</text>
        
        {/* Car silhouettes */}
        <ellipse cx="650" cy="200" rx="80" ry="60" fill="rgba(255,255,255,0.1)" />
        
        {/* Email at bottom */}
        <text x="30" y="370" fill="#1E3A8A" fontSize="18" fontWeight="bold">veiculos.oliveira@gmail.com</text>
      </svg>
    );
  }
  
  // Simple logo version for header
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="simpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="url(#simpleGrad)" stroke="#DC2626" strokeWidth="3" />
      <text x="50" y="40" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OLIVEIRA</text>
      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VEÍCULOS</text>
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="6">LOCAÇÃO</text>
    </svg>
  );
};

export default Logo;