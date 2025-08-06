import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Users, Edit, Trash2, Phone, Mail, CreditCard, Search, UserCheck, Loader, UserPlus } from 'lucide-react';

const ClientList = ({ onSelectClient, onEditClient, onAddClient }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar clientes:', error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client => 
      (client.nome && client.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.cpf && client.cpf.includes(searchTerm)) ||
      (client.telefone && client.telefone.includes(searchTerm)) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir cliente: ' + error.message);
      } else {
        alert('Cliente excluído com sucesso!');
        fetchClients();
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Lista de Clientes
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={onAddClient}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Novo Cliente</span>
              </button>
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Carregando clientes...</p>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-12">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece criando um novo contrato'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                {/* Client Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {client.nome}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="font-mono">{client.cpf}</span>
                        </div>
                        {client.telefone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span>{client.telefone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-purple-500" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onSelectClient(client)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span className="text-sm">Selecionar</span>
                  </button>
                  <button
                    onClick={() => onEditClient(client)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
