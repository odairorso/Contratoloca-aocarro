import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Users } from 'lucide-react';

const ClientList = ({ onSelectClient, onEditClient }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contracts')
      .select('id, client_data');

    if (error) {
      console.error('Erro ao buscar clientes:', error);
    } else {
      const uniqueClients = data.reduce((acc, current) => {
        const clientExists = acc.find(item => item.client_data.cpf === current.client_data.cpf);
        if (!clientExists) {
          acc.push(current);
        }
        return acc;
      }, []);
      setClients(uniqueClients);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      const { error } = await supabase.from('contracts').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir cliente: ' + error.message);
      } else {
        alert('Cliente excluído com sucesso!');
        fetchClients();
      }
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Lista de Clientes</h2>
        </div>
        {loading ? (
          <p>Carregando clientes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CPF / CNPJ</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Telefone</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">{client.client_data.nome}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{client.client_data.cpf}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{client.client_data.telefone}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{client.client_data.email}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onSelectClient(client.client_data)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Selecionar
                      </button>
                      <button
                        onClick={() => onEditClient(client)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
