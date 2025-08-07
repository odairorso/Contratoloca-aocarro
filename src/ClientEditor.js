import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Edit, User, Phone, MapPin, Hash, Save, X, CheckCircle, Mail } from 'lucide-react';

const ClientEditor = ({ editingClient, setEditingClient, fetchClients }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (editingClient && editingClient.id) {
      setClientData(editingClient);
    } else {
      setClientData({
        nome: '',
        cpf: '',
        rg: '',
        endereco: '',
        bairro: '',
        telefone: ''
      });
    }
  }, [editingClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    let error;
    if (editingClient && editingClient.id) {
      // Update existing client
      const { error: updateError } = await supabase
        .from('clientes')
        .update(clientData)
        .eq('id', editingClient.id);
      error = updateError;
    } else {
      // Insert new client
      const { error: insertError } = await supabase
        .from('clientes')
        .insert([clientData]);
      error = insertError;
    }

    if (error) {
      alert('Erro ao salvar cliente: ' + error.message);
    } else {
      alert('Cliente salvo com sucesso!');
      setEditingClient(null);
      if (fetchClients) fetchClients();
    }
  };

  if (!clientData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Editar Cliente</h2>
                <p className="text-gray-600">Atualize as informações do cliente</p>
              </div>
            </div>
            <button
              onClick={() => setEditingClient(null)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleUpdateClient} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite o nome completo"
                  value={clientData.nome}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  CPF / CNPJ
                </label>
                <input
                  type="text"
                  name="cpf"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={clientData.cpf}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  value={clientData.telefone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  RG
                </label>
                <input
                  type="text"
                  name="rg"
                  placeholder="00.000.000-0"
                  value={clientData.rg}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  placeholder="Rua, Número"
                  value={clientData.endereco || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  placeholder="Centro"
                  value={clientData.bairro || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientEditor;
