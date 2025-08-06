import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LogoSVG from './LogoSVG';
import {
  FileText,
  User,
  Car,
  MapPin,
  Phone,
  Hash,
  DollarSign,
  Calendar,
  Printer,
  Edit,
  CheckCircle,
  Loader
} from 'lucide-react';

const ContractGenerator = () => {
  const [contractType, setContractType] = useState('');
  const [clientData, setClientData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    endereco: '',
    bairro: '',
    telefone: ''
  });
  const [serviceData, setServiceData] = useState({
    veiculo: '',
    placa: '',
    modelo: '',
    anoFabricacao: '',
    cor: '',
    renavam: '',
    dataInicio: '',
    dataFim: '',
    valorDiaria: '',
    caucao: '',
    kmInicial: '',
    observacoes: '',
    valorMercado: ''
  });
  const [generatedContract, setGeneratedContract] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchCars();
  }, []);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      console.log('🔍 Iniciando busca de clientes no Supabase...');
      
      // Primeiro tenta buscar da tabela 'clientes'
      let { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Se não encontrar na tabela 'clientes', tenta 'contracts'
      if (error && error.code === 'PGRST205') {
        console.log('📋 Tabela "clientes" não encontrada, tentando "contracts"...');
        const contractsResult = await supabase
          .from('contracts')
          .select('*')
          .order('created_at', { ascending: false });
        data = contractsResult.data;
        error = contractsResult.error;
      }
      
      if (error) {
        console.error('❌ Erro do Supabase ao buscar clientes:', error);
        throw error;
      }
      
      console.log('📊 Total de registros encontrados na tabela contracts:', data?.length || 0);
      console.log('📋 Dados completos da tabela contracts:', data);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Nenhum dado encontrado na tabela contracts. Verifique se existem contratos cadastrados.');
        setClients([]);
        return;
      }
      
      // Extrair clientes únicos dos contratos
      const uniqueClients = [];
      const clientNames = new Set();
      
      data.forEach(contract => {
        console.log('🔍 Analisando contrato:', contract);
        if (contract.nome && !clientNames.has(contract.nome)) {
          clientNames.add(contract.nome);
          uniqueClients.push({
            nome: contract.nome,
            cpf: contract.cpf,
            rg: contract.rg,
            endereco: contract.endereco,
            bairro: contract.bairro,
            telefone: contract.telefone
          });
          console.log('✅ Cliente adicionado:', contract.nome);
        }
      });
      
      console.log('👥 Total de clientes únicos extraídos:', uniqueClients.length);
      console.log('👥 Lista de clientes únicos:', uniqueClients);
      setClients(uniqueClients);
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error.message || error);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchCars = async () => {
    setLoadingCars(true);
    try {
      console.log('🚗 Iniciando busca de carros no Supabase...');
      
      // Primeiro tenta buscar da tabela 'veiculos'
      let { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Se não encontrar na tabela 'veiculos', tenta 'carros'
      if (error && error.code === 'PGRST205') {
        console.log('🚗 Tabela "veiculos" não encontrada, tentando "carros"...');
        const carrosResult = await supabase
          .from('carros')
          .select('*')
          .order('created_at', { ascending: false });
        data = carrosResult.data;
        error = carrosResult.error;
      }
      
      // Se ainda não encontrar, tenta 'contracts'
      if (error && error.code === 'PGRST205') {
        console.log('🚗 Tabela "carros" não encontrada, tentando "contracts"...');
        const contractsResult = await supabase
          .from('contracts')
          .select('*')
          .order('created_at', { ascending: false });
        data = contractsResult.data;
        error = contractsResult.error;
      }
      
      if (error) {
        console.error('❌ Erro do Supabase ao buscar carros:', error);
        throw error;
      }
      
      console.log('🚗 Total de registros encontrados na tabela contracts para carros:', data?.length || 0);
      console.log('🚗 Dados completos da tabela contracts para carros:', data);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Nenhum dado encontrado na tabela contracts para carros. Verifique se existem contratos cadastrados.');
        setCars([]);
        return;
      }
      
      // Extrair carros únicos dos contratos
      const uniqueCars = [];
      const carPlates = new Set();
      
      data.forEach(contract => {
        console.log('🔍 Analisando contrato para carro:', contract);
        if (contract.placa && !carPlates.has(contract.placa)) {
          carPlates.add(contract.placa);
          uniqueCars.push({
            placa: contract.placa,
            veiculo: contract.veiculo,
            modelo: contract.modelo,
            anoFabricacao: contract.anoFabricacao,
            cor: contract.cor,
            renavam: contract.renavam,
            valorMercado: contract.valorMercado
          });
          console.log('✅ Carro adicionado:', contract.placa, '-', contract.veiculo);
        }
      });
      
      console.log('🚗 Total de carros únicos extraídos:', uniqueCars.length);
      console.log('🚗 Lista de carros únicos:', uniqueCars);
      setCars(uniqueCars);
    } catch (error) {
      console.error('❌ Erro ao buscar carros:', error.message || error);
      setCars([]);
    } finally {
      setLoadingCars(false);
    }
  };

  const calculateDays = () => {
    if (!serviceData.dataInicio || !serviceData.dataFim) return 0;
    const start = new Date(serviceData.dataInicio);
    const end = new Date(serviceData.dataFim);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const dailyRate = parseFloat(serviceData.valorDiaria) || 0;
    return (days * dailyRate).toFixed(2);
  };

  const dias = calculateDays();
  const total = calculateTotal();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const generateGarageContract = () => {
    const contractHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #2563eb;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GARAGEM</h2>
        
        <p><strong>CONTRATADA:</strong> OR DOS SANTOS DE OLIVEIRA LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 123.456.789/0001-00, com sede na Rua das Flores, 123, Centro, Campo Grande/MS.</p>
        <br/>
        <p><strong>CONTRATANTE:</strong> ${clientData.nome}, portador do CPF nº ${clientData.cpf}, RG nº ${clientData.rg}, residente e domiciliado na ${clientData.endereco}, ${clientData.bairro}, telefone ${clientData.telefone}.</p>
        <br/>
        <p><strong>CLÁUSULA 1ª – DO OBJETO</strong></p>
        <p>O presente contrato tem por objeto a prestação de serviços de garagem para o veículo <strong>${serviceData.veiculo}</strong>, placa <strong>${serviceData.placa}</strong>, modelo <strong>${serviceData.modelo}</strong>, ano <strong>${serviceData.anoFabricacao}</strong>, cor <strong>${serviceData.cor}</strong>, RENAVAM <strong>${serviceData.renavam}</strong>.</p>
        <br/>
        <p><strong>CLÁUSULA 2ª – DO VALOR E FORMA DE PAGAMENTO</strong></p>
        <p>O valor mensal dos serviços de garagem é de R$ <strong>${serviceData.valorDiaria}</strong>, a ser pago até o dia 10 de cada mês.</p>
        <br/>
        <p><strong>CLÁUSULA 3ª – DAS RESPONSABILIDADES</strong></p>
        <p>A CONTRATADA se responsabiliza pela guarda e conservação do veículo, não se responsabilizando por objetos deixados no interior do mesmo.</p>
        <br/>
        <p><strong>CLÁUSULA 4ª – DO PRAZO</strong></p>
        <p>O presente contrato terá vigência por prazo indeterminado, podendo ser rescindido por qualquer das partes mediante aviso prévio de 30 (trinta) dias.</p>
        <br/>
        <p><strong>CLÁUSULA 5ª – DO FORO</strong></p>
        <p>As partes elegem o foro da comarca de Campo Grande/MS para dirimir quaisquer questões oriundas do presente contrato.</p>
        <br/>
        <p>E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma.</p>
        <br/>
        <p>Campo Grande/MS, ${new Date().toLocaleDateString('pt-BR')}</p>
        <br/>
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>CONTRATADA</strong><br/>
              OR DOS SANTOS DE OLIVEIRA LTDA<br/>
              João Roberto dos Santos de Oliveira
            </div>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>CONTRATANTE</strong><br/>
              ${clientData.nome}
            </div>
          </div>
        </div>
        ${serviceData.observacoes ? `<br/><p><strong>OBSERVAÇÕES ADICIONAIS:</strong></p><p>${serviceData.observacoes}</p>` : ''}
      </div>
    `;

    return <div dangerouslySetInnerHTML={{ __html: contractHTML }} />;
  };

  const generateRentalContract = () => {
    const contractHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #059669;">CONTRATO DE LOCAÇÃO DE VEÍCULO</h2>
        
        <p><strong>LOCADORA:</strong> OR DOS SANTOS DE OLIVEIRA LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 123.456.789/0001-00, com sede na Rua das Flores, 123, Centro, Campo Grande/MS.</p>
        <br/>
        <p><strong>LOCATÁRIO:</strong> ${clientData.nome}, portador do CPF nº ${clientData.cpf}, RG nº ${clientData.rg}, residente e domiciliado na ${clientData.endereco}, ${clientData.bairro}, telefone ${clientData.telefone}.</p>
        <br/>
        <p><strong>CLÁUSULA 1ª – DO OBJETO</strong></p>
        <p>O presente contrato tem por objeto a locação do veículo <strong>${serviceData.veiculo}</strong>, placa <strong>${serviceData.placa}</strong>, modelo <strong>${serviceData.modelo}</strong>, ano <strong>${serviceData.anoFabricacao}</strong>, cor <strong>${serviceData.cor}</strong>, RENAVAM <strong>${serviceData.renavam}</strong>, com valor de mercado de R$ <strong>${serviceData.valorMercado}</strong>.</p>
        <br/>
        <p><strong>CLÁUSULA 2ª – DO PRAZO</strong></p>
        <p>O prazo de locação será de <strong>${dias} dia${dias !== 1 ? 's' : ''}</strong>, com início em <strong>${formatDate(serviceData.dataInicio)}</strong> e término em <strong>${formatDate(serviceData.dataFim)}</strong>.</p>
        <br/>
        <p><strong>CLÁUSULA 3ª – DO VALOR E FORMA DE PAGAMENTO</strong></p>
        <p>O valor da locação é de R$ <strong>${serviceData.valorDiaria}</strong> por dia, totalizando R$ <strong>${total}</strong> pelo período contratado. O pagamento deverá ser efetuado no ato da retirada do veículo.</p>
        <br/>
        <p><strong>CLÁUSULA 4ª – DA CAUÇÃO</strong></p>
        <p>O LOCATÁRIO prestará caução no valor de R$ <strong>${serviceData.caucao}</strong>, que será devolvida ao final do contrato, deduzidas eventuais despesas com danos, multas ou outras pendências.</p>
        <br/>
        <p><strong>CLÁUSULA 5ª – DA QUILOMETRAGEM</strong></p>
        <p>O veículo será entregue com <strong>${serviceData.kmInicial}</strong> km rodados. A quilometragem final será verificada na devolução.</p>
        <br/>
        <p><strong>CLÁUSULA 6ª – DAS RESPONSABILIDADES DO LOCATÁRIO</strong></p>
        <p>O LOCATÁRIO se responsabiliza por:</p>
        <p>I – Utilizar o veículo com cuidado e diligência;</p>
        <p>II – Arcar com multas de trânsito cometidas durante o período de locação;</p>
        <p>III – Comunicar imediatamente qualquer sinistro ou avaria;</p>
        <p>IV – Devolver o veículo nas mesmas condições em que o recebeu.</p>
        <br/>
        <p><strong>CLÁUSULA 7ª – DAS RESPONSABILIDADES DA LOCADORA</strong></p>
        <p>A LOCADORA se responsabiliza por:</p>
        <p>I – Entregar o veículo em perfeitas condições de uso;</p>
        <p>II – Manter a documentação do veículo em dia;</p>
        <p>III – Prestar assistência em caso de pane mecânica.</p>
        <br/>
        <p><strong>CLÁUSULA 8ª – DAS PROIBIÇÕES</strong></p>
        <p>É vedado ao LOCATÁRIO:</p>
        <p>I – Sublocar o veículo;</p>
        <p>II – Utilizar o veículo para fins ilícitos;</p>
        <p>III – Transportar cargas perigosas;</p>
        <p>IV – Conduzir o veículo sob efeito de álcool ou drogas.</p>
        <br/>
        <p><strong>CLÁUSULA 9ª – DOS DANOS</strong></p>
        <p>Eventuais danos causados ao veículo durante o período de locação serão de responsabilidade do LOCATÁRIO, que deverá arcar com os custos de reparo.</p>
        <br/>
        <p><strong>CLÁUSULA 10ª – DA RESCISÃO</strong></p>
        <p>O presente contrato poderá ser rescindido:</p>
        <p>I – Por acordo entre as partes;</p>
        <p>II – Por inadimplemento de qualquer das cláusulas contratuais;</p>
        <p>III – Por necessidade de reparos no veículo que impeçam seu uso por mais de 15 (quinze) dias;</p>
        <p>IV – Por sinistro que resulte em perda total do veículo.</p>
        <br/>
        <p><strong>CLÁUSULA 11ª – DO FORO</strong></p>
        <p>As partes elegem o foro da comarca de Campo Grande/MS para dirimir quaisquer questões oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.</p>
        <br/>
        <p>E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma, juntamente com 2 (duas) testemunhas.</p>
        <br/>
        <p>Campo Grande/MS, ${new Date().toLocaleDateString('pt-BR')}</p>
        <br/>
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>LOCADORA</strong><br/>
              OR DOS SANTOS DE OLIVEIRA LTDA<br/>
              João Roberto dos Santos de Oliveira
            </div>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>LOCATÁRIO</strong><br/>
              ${clientData.nome}
            </div>
          </div>
        </div>
        <br/>
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>TESTEMUNHA 1</strong><br/>
              Nome: _________________________<br/>
              CPF: __________________________
            </div>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>TESTEMUNHA 2</strong><br/>
              Nome: _________________________<br/>
              CPF: __________________________
            </div>
          </div>
        </div>
        ${serviceData.observacoes ? `<br/><p><strong>OBSERVAÇÕES ADICIONAIS:</strong></p><p>${serviceData.observacoes}</p>` : ''}
      </div>
    `;

    return <div dangerouslySetInnerHTML={{ __html: contractHTML }} />;
  };

  const generateContract = () => {
    if (!clientData.nome) {
      alert('Por favor, preencha pelo menos o nome do cliente.');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      let contract;
      if (contractType === 'garagem') {
        contract = generateGarageContract();
      } else if (contractType === 'locadora') {
        contract = generateRentalContract();
      }
      
      setGeneratedContract(contract);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Gerador de Contratos
          </h1>
          <p className="text-gray-600 text-lg">Crie contratos profissionais de forma rápida e eficiente</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 mb-6">
          {/* Seleção do tipo de contrato */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Tipo de Contrato
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setContractType('garagem')}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  contractType === 'garagem' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
              >
                <div className={`p-4 rounded-2xl mb-4 mx-auto w-fit ${
                  contractType === 'garagem' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <FileText className={`w-8 h-8 ${
                    contractType === 'garagem' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Serviços de Garagem</h3>
                <p className="text-gray-600 text-sm">Contrato para prestação de serviços de garagem</p>
                {contractType === 'garagem' && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-blue-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Selecionado</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setContractType('locadora')}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  contractType === 'locadora' 
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'
                }`}
              >
                <div className={`p-4 rounded-2xl mb-4 mx-auto w-fit ${
                  contractType === 'locadora' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gray-100 group-hover:bg-green-100'
                }`}>
                  <Car className={`w-8 h-8 ${
                    contractType === 'locadora' ? 'text-white' : 'text-gray-600 group-hover:text-green-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Locação de Veículos</h3>
                <p className="text-gray-600 text-sm">Contrato para aluguel de carros e veículos</p>
                {contractType === 'locadora' && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Selecionado</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Formulário e Preview */}
          {contractType && (
              <div className="grid xl:grid-cols-2 gap-8">
                {/* Formulário */}
                <div className="space-y-6">
                  {/* Cliente */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Dados do Cliente</h3>
                        <p className="text-gray-600 text-sm">Informações pessoais do contratante</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          onChange={(e) => {
                            const selected = clients.find(c => c.client_data.cpf === e.target.value);
                            if (selected) setClientData(selected.client_data);
                          }}
                          value={clientData.cpf || ''}
                        >
                          <option value="">{loadingClients ? 'Carregando clientes...' : 'Selecione um cliente existente'}</option>
                          {clients.map((client, index) => (
                            <option key={index} value={client.client_data.cpf}>
                              {client.client_data.nome} ({client.client_data.cpf})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                        <input
                          type="text"
                          placeholder="Ex: João Silva Santos"
                          value={clientData.nome}
                          onChange={(e) => setClientData({...clientData, nome: e.target.value})}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            CPF / CNPJ
                          </label>
                          <input
                            type="text"
                            placeholder="000.000.000-00"
                            value={clientData.cpf}
                            onChange={(e) => setClientData({...clientData, cpf: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">RG / Inscrição Estadual</label>
                          <input
                            type="text"
                            placeholder="00.000.000-0"
                            value={clientData.rg}
                            onChange={(e) => setClientData({...clientData, rg: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Endereço
                          </label>
                          <input
                            type="text"
                            placeholder="Rua, número"
                            value={clientData.endereco}
                            onChange={(e) => setClientData({...clientData, endereco: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Bairro</label>
                          <input
                            type="text"
                            placeholder="Centro"
                            value={clientData.bairro}
                            onChange={(e) => setClientData({...clientData, bairro: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telefone
                          </label>
                          <input
                            type="text"
                            placeholder="(67) 99999-9999"
                            value={clientData.telefone}
                            onChange={(e) => setClientData({...clientData, telefone: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dados do Serviço - Garagem */}
                  {contractType === 'garagem' && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Dados do Veículo</h3>
                          <p className="text-gray-600 text-sm">Informações do veículo para garagem</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            onChange={(e) => {
                              const selected = cars.find(c => c.car_data.placa === e.target.value);
                              if (selected) {
                                setServiceData({
                                  ...serviceData,
                                  veiculo: selected.car_data.veiculo,
                                  placa: selected.car_data.placa,
                                  modelo: selected.car_data.modelo,
                                  anoFabricacao: selected.car_data.anoFabricacao,
                                  cor: selected.car_data.cor,
                                  renavam: selected.car_data.renavam
                                });
                              }
                            }}
                            value={serviceData.placa || ''}
                          >
                            <option value="">{loadingCars ? 'Carregando veículos...' : 'Selecione um veículo existente'}</option>
                            {cars.map((car, index) => (
                              <option key={index} value={car.car_data?.placa || ''}>
                                {car.car_data?.veiculo || 'Veículo'} - {car.car_data?.placa || 'Placa'}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Veículo
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Honda Civic"
                              value={serviceData.veiculo}
                              onChange={(e) => setServiceData({...serviceData, veiculo: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Placa</label>
                            <input
                              type="text"
                              placeholder="ABC-1234"
                              value={serviceData.placa}
                              onChange={(e) => setServiceData({...serviceData, placa: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Modelo</label>
                            <input
                              type="text"
                              placeholder="Civic"
                              value={serviceData.modelo}
                              onChange={(e) => setServiceData({...serviceData, modelo: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Ano</label>
                            <input
                              type="text"
                              placeholder="2020"
                              value={serviceData.anoFabricacao}
                              onChange={(e) => setServiceData({...serviceData, anoFabricacao: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cor</label>
                            <input
                              type="text"
                              placeholder="Prata"
                              value={serviceData.cor}
                              onChange={(e) => setServiceData({...serviceData, cor: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              RENAVAM
                            </label>
                            <input
                              type="text"
                              placeholder="12345678901"
                              value={serviceData.renavam}
                              onChange={(e) => setServiceData({...serviceData, renavam: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Valor Mensal (R$)
                            </label>
                            <input
                              type="number"
                              placeholder="300.00"
                              step="0.01"
                              value={serviceData.valorDiaria}
                              onChange={(e) => setServiceData({...serviceData, valorDiaria: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                          <textarea
                            placeholder="Informações extras sobre o serviço..."
                            value={serviceData.observacoes}
                            onChange={(e) => setServiceData({...serviceData, observacoes: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm h-20 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dados do Serviço - Locadora */}
                  {contractType === 'locadora' && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Dados da Locação</h3>
                          <p className="text-gray-600 text-sm">Informações do veículo e período de locação</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            onChange={(e) => {
                              const selected = cars.find(c => c.car_data.placa === e.target.value);
                              if (selected) {
                                setServiceData({
                                  ...serviceData,
                                  veiculo: selected.car_data.veiculo,
                                  placa: selected.car_data.placa,
                                  modelo: selected.car_data.modelo,
                                  anoFabricacao: selected.car_data.anoFabricacao,
                                  cor: selected.car_data.cor,
                                  renavam: selected.car_data.renavam
                                });
                              }
                            }}
                            value={serviceData.placa || ''}
                          >
                            <option value="">{loadingCars ? 'Carregando veículos...' : 'Selecione um veículo existente'}</option>
                            {cars.map((car, index) => (
                              <option key={index} value={car.car_data?.placa || ''}>
                                {car.car_data?.veiculo || 'Veículo'} - {car.car_data?.placa || 'Placa'}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Veículo
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Honda Civic"
                              value={serviceData.veiculo}
                              onChange={(e) => setServiceData({...serviceData, veiculo: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Placa</label>
                            <input
                              type="text"
                              placeholder="ABC-1234"
                              value={serviceData.placa}
                              onChange={(e) => setServiceData({...serviceData, placa: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Modelo</label>
                            <input
                              type="text"
                              placeholder="Civic"
                              value={serviceData.modelo}
                              onChange={(e) => setServiceData({...serviceData, modelo: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Ano</label>
                            <input
                              type="text"
                              placeholder="2020"
                              value={serviceData.anoFabricacao}
                              onChange={(e) => setServiceData({...serviceData, anoFabricacao: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cor</label>
                            <input
                              type="text"
                              placeholder="Prata"
                              value={serviceData.cor}
                              onChange={(e) => setServiceData({...serviceData, cor: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              RENAVAM
                            </label>
                            <input
                              type="text"
                              placeholder="12345678901"
                              value={serviceData.renavam}
                              onChange={(e) => setServiceData({...serviceData, renavam: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Data de Início
                            </label>
                            <input
                              type="date"
                              value={serviceData.dataInicio}
                              onChange={(e) => setServiceData({...serviceData, dataInicio: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Data de Fim
                            </label>
                            <input
                              type="date"
                              value={serviceData.dataFim}
                              onChange={(e) => setServiceData({...serviceData, dataFim: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Valor da Diária (R$)
                            </label>
                            <input
                              type="number"
                              placeholder="150.00"
                              step="0.01"
                              value={serviceData.valorDiaria}
                              onChange={(e) => setServiceData({...serviceData, valorDiaria: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Valor Total</label>
                            <div className="p-3 border border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                              <div className="text-lg font-bold text-green-600">R$ {total}</div>
                              <div className="text-sm text-gray-600">{dias} dia{dias !== 1 ? 's' : ''} de locação</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Caução (R$)
                            </label>
                            <input
                              type="number"
                              placeholder="500.00"
                              step="0.01"
                              value={serviceData.caucao}
                              onChange={(e) => setServiceData({...serviceData, caucao: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">KM Inicial</label>
                            <input
                              type="number"
                              placeholder="50000"
                              value={serviceData.kmInicial}
                              onChange={(e) => setServiceData({...serviceData, kmInicial: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Valor de Mercado (R$)
                            </label>
                            <input
                              type="number"
                              placeholder="85000.00"
                              step="0.01"
                              value={serviceData.valorMercado}
                              onChange={(e) => setServiceData({...serviceData, valorMercado: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                          <textarea
                            placeholder="Informações extras sobre a locação..."
                            value={serviceData.observacoes}
                            onChange={(e) => setServiceData({...serviceData, observacoes: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm h-20 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={generateContract}
                    disabled={isGenerating || !clientData.nome}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3 ${
                      contractType === 'garagem' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Gerando Contrato...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Gerar Contrato
                      </>
                    )}
                  </button>
                </div>

                {/* Preview do Contrato */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 print:border-none print:bg-white" id="contract-preview-container">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Preview do Contrato</h3>
                      <p className="text-gray-600 text-sm">Visualização em tempo real</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-gray-100 overflow-y-auto max-h-96 print:bg-white print:p-0 print:border-none print:max-h-none">
                    {generatedContract ? (
                      <div>
                        <LogoSVG showFullLogo={true} className="w-48 mx-auto mb-4" />
                        {generatedContract}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">Aguardando Geração</h4>
                        <p className="text-gray-500">Preencha os dados e clique em "Gerar Contrato"</p>
                      </div>
                    )}
                  </div>
                  
                  {generatedContract && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 print:hidden">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Printer className="w-5 h-5" />
                        Imprimir / Salvar PDF
                      </button>
                      <button
                        onClick={() => setGeneratedContract(null)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Edit className="w-5 h-5" />
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;
