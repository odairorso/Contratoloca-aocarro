import React, { useState } from 'react';
import ContractGenerator from './ContractGenerator';
import ClientList from './ClientList';
import CarManagement from './CarManagement';
import ClientEditor from './ClientEditor';
import logo from './logo.jpg';
import { FileText, Users, Car, Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [page, setPage] = useState('generator');
  const [editingClient, setEditingClient] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setPage('cars');
  };

  const menuItems = [
    { id: 'generator', label: 'Contratos', icon: FileText },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'cars', label: 'Veículos', icon: Car }
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={logo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shadow-md" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  OLIVEIRA VEÍCULOS
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Sistema de Gestão</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      page === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        page === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Main Content */}
      <main className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          {page === 'generator' && <ContractGenerator editingClient={editingClient} setEditingClient={setEditingClient} />}
          {page === 'clients' && (
            <>
              {editingClient ? (
                <ClientEditor editingClient={editingClient} setEditingClient={setEditingClient} />
              ) : (
                <ClientList onSelectClient={() => {}} onEditClient={handleEditClient} />
              )}
            </>
          )}
          {page === 'cars' && <CarManagement editingCar={editingCar} setEditingCar={setEditingCar} onEditCar={handleEditCar} />}
        </div>
      </main>
    </div>
  );
}

export default App;