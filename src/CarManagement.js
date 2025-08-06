import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Car, Search } from 'lucide-react';

const CarManagement = ({ onEditCar }) => {
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
    value: ''
  });

  const fetchCars = async () => {
    setLoading(true);
    let query = supabase.from('cars').select('*');

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
    const { data, error } = await supabase.from('cars').insert([newCar]);
    if (error) {
      alert('Erro ao adicionar carro: ' + error.message);
    } else {
      alert('Carro adicionado com sucesso!');
      setNewCar({ brand: '', model: '', year: '', plate: '', price: '', color: '', value: '' });
      fetchCars();
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir carro: ' + error.message);
      } else {
        alert('Carro excluído com sucesso!');
        fetchCars();
      }
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Cadastrar Novo Carro</h2>
        </div>
        <form onSubmit={handleAddCar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="brand"
              placeholder="Marca"
              value={newCar.brand}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="model"
              placeholder="Modelo"
              value={newCar.model}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="year"
              placeholder="Ano"
              value={newCar.year}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="plate"
              placeholder="Placa"
              value={newCar.plate}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Preço da Diária"
              value={newCar.price}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="color"
              placeholder="Cor"
              value={newCar.color}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="value"
              placeholder="Valor do Veículo"
              value={newCar.value}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Adicionar Carro
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Lista de Carros</h2>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por marca ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        {loading ? (
          <p>Carregando carros...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modelo</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ano</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Placa</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Diária (R$)</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cor</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">{car.brand}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{car.model}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{car.year}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{car.plate}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{car.price}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{car.color}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{car.value}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onEditCar(car)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
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

export default CarManagement;
