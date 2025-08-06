import React, { useState } from 'react';
import ContractGenerator from './ContractGenerator';
import ClientList from './ClientList';
import CarManagement from './CarManagement';
import ClientEditor from './ClientEditor';
import logo from './logo.jpg';
import './App.css';

function App() {
  const [page, setPage] = useState('generator');
  const [editingClient, setEditingClient] = useState(null);
  const [editingCar, setEditingCar] = useState(null);

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setPage('cars');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <h1 className="ml-4 text-2xl font-bold text-gray-800">OLIVEIRA VEÍCULOS</h1>
          </div>
          <nav>
            <button
              onClick={() => setPage('generator')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${page === 'generator' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Gerador de Contratos
            </button>
            <button
              onClick={() => setPage('clients')}
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${page === 'clients' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Lista de Clientes
            </button>
            <button
              onClick={() => setPage('cars')}
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${page === 'cars' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Gestão de Carros
            </button>
          </nav>
        </div>
      </header>
      <main>
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
      </main>
    </div>
  );
}

export default App;