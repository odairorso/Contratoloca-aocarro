import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Car, Search, Edit, Plus, Trash2, Calendar, DollarSign, Palette, Hash, Save, X, Loader } from 'lucide-react';

const CarManagement = ({ editingCar, setEditingCar, onEditCar }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    price: '',
    color: '',
    value: '',
    renavam: ''
  });
  const [editingCarData, setEditingCarData] = useState(null);

  useEffect(() => {
    if (editingCar) {
      setEditingCarData(editingCar);
    } else {
      setEditingCarData(null);
    }
  }, [editingCar]);

  const fetchCars = async () => {
    setLoading(true);
    let query = supabase.from('veiculos').select('*');

    if (searchTerm) {
      query = query.or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar carros:', error);
    } else {
      setCars(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCars();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('veiculos').insert([newCar]);
    if (error) {
      alert('Erro ao adicionar carro: ' + error.message);
    } else {
      alert('Carro adicionado com sucesso!');
      setNewCar({ brand: '', model: '', year: '', plate: '', price: '', color: '', value: '', renavam: '' });
      fetchCars();
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      const { error } = await supabase.from('veiculos').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir carro: ' + error.message);
      } else {
        alert('Carro excluído com sucesso!');
        fetchCars();
      }
    }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('veiculos').update(editingCarData).eq('id', editingCarData.id);
    if (error) {
      alert('Erro ao atualizar carro: ' + error.message);
    } else {
      alert('Carro atualizado com sucesso!');
      setEditingCar(null);
      fetchCars();
    }
  };

  const handleSelectCar = (car) => {
    onEditCar(car);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCarData({ ...editingCarData, [name]: value });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {editingCarData ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Editar Veículo
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Atualize as informações do veículo</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCar(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateCar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Ex: Toyota"
                    value={editingCarData.brand}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    type="text"
                    name="model"
                    placeholder="Ex: Corolla"
                    value={editingCarData.model}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ano
                  </label>
                  <input
                    type="number"
                    name="year"
                    placeholder="2023"
                    value={editingCarData.year}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    name="plate"
                    placeholder="ABC-1234"
                    value={editingCarData.plate}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    RENAVAM
                  </label>
                  <input
                    type="text"
                    name="renavam"
                    placeholder="12345678901"
                    value={editingCarData.renavam}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Diária (R$)
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="150.00"
                    step="0.01"
                    value={editingCarData.price}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Cor
                  </label>
                  <input
                    type="text"
                    name="color"
                    placeholder="Branco"
                    value={editingCarData.color}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valor do Veículo (R$)
                  </label>
                  <input
                    type="number"
                    name="value"
                    placeholder="85000.00"
                    step="0.01"
                    value={editingCarData.value}
                    onChange={handleEditInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button 
                  type="submit" 
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Cadastrar Novo Veículo
                </h2>
                <p className="text-gray-500 text-sm mt-1">Adicione um novo veículo à frota</p>
              </div>
            </div>
            <form onSubmit={handleAddCar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Ex: Toyota"
                    value={newCar.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    type="text"
                    name="model"
                    placeholder="Ex: Corolla"
                    value={newCar.model}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ano
                  </label>
                  <input
                    type="number"
                    name="year"
                    placeholder="2023"
                    value={newCar.year}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    name="plate"
                    placeholder="ABC-1234"
                    value={newCar.plate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    RENAVAM
                  </label>
                  <input
                    type="text"
                    name="renavam"
                    placeholder="12345678901"
                    value={newCar.renavam}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Diária (R$)
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="150.00"
                    step="0.01"
                    value={newCar.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Cor
                  </label>
                  <input
                    type="text"
                    name="color"
                    placeholder="Branco"
                    value={newCar.color}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valor do Veículo (R$)
                  </label>
                  <input
                    type="number"
                    name="value"
                    placeholder="85000.00"
                    step="0.01"
                    value={newCar.value}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Adicionar Veículo
              </button>
            </form>
          </div>
        )}

        {/* Lista de Veículos */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Frota de Veículos
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {cars.length} veículo{cars.length !== 1 ? 's' : ''} cadastrado{cars.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-green-500 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Carregando veículos...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'Nenhum veículo encontrado' : 'Nenhum veículo cadastrado'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece adicionando um novo veículo'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  {/* Car Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{car.year}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        R$ {parseFloat(car.price || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">por dia</div>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Placa:</span>
                      <span className="font-mono font-medium">{car.plate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cor:</span>
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">{car.color}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">RENAVAM:</span>
                      <span className="font-mono text-xs">{car.renavam}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium text-blue-600">
                        R$ {parseFloat(car.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectCar(car)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Car className="w-4 h-4" />
                      <span className="text-sm">Selecionar</span>
                    </button>
                    <button
                      onClick={() => onEditCar(car)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
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
    </div>
  );
};

export default CarManagement;
