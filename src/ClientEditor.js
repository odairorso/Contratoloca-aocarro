import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Edit } from 'lucide-react';

const ClientEditor = ({ editingClient, setEditingClient, fetchClients }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (editingClient) {
      setClientData(editingClient.client_data);
    }
  }, [editingClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('contracts')
      .update({ client_data: clientData })
      .eq('id', editingClient.id);

    if (error) {
      alert('Erro ao atualizar cliente: ' + error.message);
    } else {
      alert('Cliente atualizado com sucesso!');
      setEditingClient(null);
      fetchClients();
    }
  };

  if (!clientData) return null;

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Edit className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Editar Cliente</h2>
        </div>
        <form onSubmit={handleUpdateClient}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={clientData.nome}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF / CNPJ"
              value={clientData.cpf}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={clientData.telefone}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={clientData.email}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => setEditingClient(null)}
              className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientEditor;
