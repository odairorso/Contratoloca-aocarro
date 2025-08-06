import React, { useState, useEffect } from 'react';
import { Car, FileText, Send, Download, Wrench, User, Calendar, DollarSign, MapPin, Phone, Mail, Hash, Palette, Clock, Loader, CheckCircle, AlertCircle, Printer, Edit } from 'lucide-react';
import { supabase } from './supabaseClient';
import LogoSVG from './LogoSVG';

const ContractGenerator = () => {
  const [contractType, setContractType] = useState('');
  const [clientData, setClientData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    endereco: '',
    bairro: '',
    telefone: '',
    email: ''
  });
  const [serviceData, setServiceData] = useState({
    veiculo: '',
    placa: '',
    servicos: '',
    valor: '',
    prazo: '',
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

  // New states for clients and cars
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingCars, setLoadingCars] = useState(true);

  // Fetch clients from Supabase
  const fetchClients = async () => {
    setLoadingClients(true);
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
    setLoadingClients(false);
  };

  // Fetch cars from Supabase
  const fetchCars = async () => {
    setLoadingCars(true);
    const { data, error } = await supabase.from('cars').select('*');

    if (error) {
      console.error('Erro ao buscar carros:', error);
    } else {
      setCars(data);
    }
    setLoadingCars(false);
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchClients();
    fetchCars();
  }, []);

  const calcularValorTotal = () => {
    if (serviceData.dataInicio && serviceData.dataFim && serviceData.valorDiaria) {
      const inicio = new Date(serviceData.dataInicio);
      const fim = new Date(serviceData.dataFim);
      const diffTime = Math.abs(fim - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const valorTotal = diffDays * parseFloat(String(serviceData.valorDiaria).replace(',', '.') || '0');
      return { dias: diffDays, total: valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) };
    }
    return { dias: 0, total: '0,00' };
  };

  const { dias, total } = calcularValorTotal();
  const [generatedContract, setGeneratedContract] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContract = async () => {
    setIsGenerating(true);
    try {
      const contractElement = contractType === 'garagem' ? generateGarageContract() : generateRentalContract();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGeneratedContract(contractElement);

      // Salvar no Supabase
      const { error } = await supabase.from('contracts').insert([
        {
          contract_type: contractType,
          client_data: clientData,
          service_data: serviceData,
          contract_text: contractElement.props.dangerouslySetInnerHTML.__html // Salvando o HTML do contrato
        }
      ]);
      if (error) alert('Erro ao salvar: ' + error.message);
      else alert('Contrato salvo com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGarageContract = () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS AUTOMOTIVOS - EXEMPLO\n\nData: ${hoje}`;
  };

  const generateRentalContract = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = today.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
    const year = today.getFullYear();

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };

    const contractHTML = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
        <h2 style="text-align: center; font-weight: bold;">CONTRATO DE LOCAÇÃO DE VEÍCULO</h2>
        <br/>
        <p><strong>Entre:</strong></p>
        <p>a pessoa jurídica OR DOS SANTOS DE OLIVEIRA LTDA, inscrita sob o CNPJ n.º 17.909.442/0001-58, com sede em Av campo grande 707, bairro centro, neste ato representada, conforme poderes especialmente conferidos, por: João Roberto dos Santos de Oliveira, na qualidade de: Administrador, CPF n.º 008.714.291-01, carteira de identidade n.º 1447272, doravante denominada <strong>LOCADORA</strong>,</p>
        <br/>
        <p><strong>e:</strong></p>
        <p>${clientData.nome}, CNPJ n.º ${clientData.cpf}, residente em: ${clientData.endereco}, bairro ${clientData.bairro}, doravante denominado <strong>LOCATÁRIO</strong>.</p>
        <br/>
        <p>As partes acima identificadas têm entre si justo e acertado o presente contrato de locação de veículo, ficando desde já aceito nas cláusulas e condições abaixo descritas.</p>
        <br/>
        <p><strong>CLÁUSULA 1ª – DO OBJETO</strong></p>
        <p>Por meio deste contrato, que firmam entre si a LOCADORA e o LOCATÁRIO, regula-se a locação do veículo:<br/>
        ${serviceData.modelo} ano ${serviceData.anoFabricacao}<br/>
        Com placa ${serviceData.placa}, RENAVAM ${serviceData.renavam}, e com o valor de mercado aproximado em R$ ${serviceData.valorMercado}</p>
        <p><strong>Parágrafo único.</strong> O presente contrato é acompanhado de um laudo de vistoria, que descreve o veículo e o seu estado de conservação no momento em que o mesmo foi entregue ao LOCATÁRIO.</p>
        <br/>
        <p><strong>CLÁUSULA 2ª – DO VALOR DO ALUGUEL</strong></p>
        <p>O valor da diária do aluguel, livremente ajustado pelas partes, é de R$ ${serviceData.valorDiaria}. O valor total da locação é de R$ ${total} para o período de ${dias} dias.</p>
        <p><strong>§ 1º.</strong> O LOCATÁRIO deverá efetuar o pagamento do valor acordado, por meio de pix, utilizando a chave 17909442000158, ou em espécie, ou cartão.</p>
        <p><strong>§ 2º.</strong> Em caso de atraso no pagamento do aluguel, será aplicada multa de 5% (cinco por cento), sobre o valor devido, bem como juros de mora de 3% (um por cento) ao mês, mais correção monetária, apurada conforme variação do IGP-M no período.</p>
        <p><strong>§ 3º.</strong> O LOCATÁRIO, não vindo a efetuar o pagamento do aluguel por um período de atraso superior à 7 (sete) dias, fica sujeito a ter a posse do veículo configurada como Apropriação Indébita, implicando também a possibilidade de adoção de medidas judiciais, inclusive a Busca e Apreensão do veículo e/ou lavratura de Boletim de Ocorrência, cabendo ao LOCATÁRIO ressarcir a LOCADORA das despesas oriundas da retenção indevida do bem, arcando ainda com as despesas judiciais e/ou extrajudiciais que a LOCADORA venha a ter para efetuar a busca, apreensão e efetiva reintegração da posse do veículo.</p>
        <p><strong>§ 4º.</strong> Será de responsabilidade do LOCATÁRIO as despesas referentes à utilização do veículo.</p>
        <p><strong>§ 5º.</strong> O valor do aluguel firmado neste contrato será reajustado a cada 12 (doze) meses, tendo como base o índice IGP. Em caso de falta deste índice, o reajuste do valor da locação terá por base a média da variação dos índices inflacionários do ano corrente ao da execução da locação.</p>
        <br/>
        <p><strong>CLÁUSULA 3ª – DO PRAZO DO ALUGUEL</strong></p>
        <p>O prazo de locação do referido veículo é de ${formatDate(serviceData.dataInicio)} A ${formatDate(serviceData.dataFim)} ENTREGAR ATE AS 8:00 DA MANHÃ.</p>
        <p><strong>§ 1º.</strong> Ao final do prazo estipulado, caso as partes permaneçam inertes, a locação prorrogar-se-á automaticamente por tempo indeterminado.</p>
        <p><strong>§ 2º.</strong> Caso a LOCADORA não queira prorrogar a locação ao terminar o prazo estipulado neste contrato, e o referido veículo não for devolvido, será cobrado o valor do aluguel proporcional aos dias de atraso acumulado de multa diária de R$ ${serviceData.valorDiaria}.</p>
        <p><strong>§ 3º.</strong> Finda a locação, o LOCATÁRIO deverá devolver o veículo nas mesmas condições em que recebeu, salvo os desgastes decorrentes do uso normal, sob pena de indenização por perdas e danos a ser apurada.</p>
        <br/>
        <p><strong>CLÁUSULA 4ª – DO COMBUSTÍVEL</strong></p>
        <p>O veículo será entregue ao LOCATÁRIO com um tanque de combustível completo, e sua quantidade será marcada no laudo de vistoria no momento da retirada.</p>
        <p><strong>§ 1º.</strong> Ao final do prazo estipulado, o LOCATÁRIO deverá devolver o veículo à LOCADORA com o tanque de combustível completo.</p>
        <p><strong>§ 2º.</strong> Caso não ocorra o cumprimento do parágrafo anterior, será cobrado o valor correspondente a leitura do marcador em oitavos, com base em tabela própria, e o valor do litro será informado no momento da retirada pela LOCADORA.</p>
        <p><strong>§ 3º.</strong> Caso seja constatado a utilização de combustível adulterado, o LOCATÁRIO responderá pelo mesmo e pelos danos decorrentes de tal utilização.</p>
        <p><strong>§ 4º.</strong> Fica desde já acordado que o LOCATÁRIO não terá direito a ressarcimento caso devolva o veículo com uma quantidade de combustível superior a que recebeu.</p>
        <br/>
        <p><strong>CLÁUSULA 5ª – DA LIMPEZA</strong></p>
        <p>O veículo será entregue ao LOCATÁRIO limpo e deverá ser devolvido à LOCADORA nas mesmas condições higiênicas que foi retirado.</p>
        <p><strong>§ 1º.</strong> Caso o veículo seja devolvido sujo, interna ou externamente, será cobrada uma taxa de lavagem simples ou especial, dependendo do estado do veículo na devolução.</p>
        <p><strong>§ 2º.</strong> Caso haja a necessidade de lavagem especial, será cobrada, além da taxa de lavagem, o valor mínimo de (uma) diária de locação, ou quantas diárias forem necessárias até a disponibilização do veículo para locação, limitado a 5 (cinco) diárias do veículo com base na tarifa vigente.</p>
        <br/>
        <p><strong>CLÁUSULA 6ª – DA UTILIZAÇÃO</strong></p>
        <p><strong>§ 1º.</strong> Deverá também o LOCATÁRIO utilizar o veículo alugado sempre de acordo com os regulamentos estabelecidos pelo Conselho Nacional de Trânsito (CONTRAN) e pelo Departamento Estadual de Trânsito (DETRAN).</p>
        <p><strong>§ 2º.</strong> A utilização do veículo de forma diferente do descrito acima estará sujeita à cobrança de multa, assim como poderá a LOCADORA dar por rescindido o presente contrato independente de qualquer notificação, e sem maiores formalidades poderá também proceder com o recolhimento do veículo sem que seja ensejada qualquer pretensão para ação indenizatória, reparatória ou compensatória pelo LOCATÁRIO.</p>
        <p><strong>§ 3º.</strong> Qualquer modificação no veículo só poderá ser feita com a autorização expressa da LOCADORA.</p>
        <p><strong>§ 4º.</strong> O LOCATÁRIO declara estar ciente que quaisquer danos causados, materiais ou pessoais, decorrente da utilização do veículo ora locado, será de sua responsabilidade.</p>
        <br/>
        <p><strong>CLÁUSULA 7ª RESTRIÇÃO TERRITORIAL</strong></p>
        <p>O LOCATÁRIO se compromete a utilizar o veículo exclusivamente dentro do território nacional brasileiro, sendo expressamente proibida sua saída para qualquer outro País. Descumprimento desta cláusula implicará em multa de R$280,00 (Duzentos e oitenta reais) rescisão imediata do presente contrato, sem prejuízo das demais medidas legais cabíveis.</p>
        <br/>
        <p><strong>CLÁUSULA 8ª – DAS MULTAS E INFRAÇÕES</strong></p>
        <p>As multas ou quaisquer outras infrações às leis de trânsito, cometidas durante o período da locação do veículo, serão de responsabilidade do LOCATÁRIO, devendo ser liquidadas quando da notificação pelos órgãos competentes ou no final do contrato, o que ocorrer primeiro.</p>
        <p><strong>§ 1º.</strong> Em caso de apreensão do veículo, serão cobradas do Locatário todas as despesas de serviço dos profissionais envolvidos para liberação do veículo alugado, assim como todas as taxas cobradas pelos órgãos competentes, e também quantas diárias forem necessárias até a disponibilização do veículo para locação.</p>
        <p><strong>§ 2º.</strong> O LOCATÁRIO declara-se ciente e concorda que se ocorrer qualquer multa ou infração de trânsito durante a vigência deste contrato, seu nome poderá ser indicado pela LOCADORA junto ao Órgão de Trânsito autuante, na qualidade de condutor do veículo, tendo assim a pontuação recebida transferida para sua carteira de habilitação.</p>
        <p><strong>§ 3º.</strong> A LOCADORA poderá preencher os dados relativos à "apresentação do Condutor", previsto na Resolução 404/12 do CONTRAN, caso tenha sido lavrada autuação por infrações de trânsito enquanto o veículo esteve em posse e responsabilidade do LOCATÁRIO, situação na qual a LOCADORA apresentará para o Órgão de Trânsito competente a cópia do presente contrato celebrado com o LOCATÁRIO.</p>
        <p><strong>§ 4º.</strong> Descabe qualquer discussão sobre a procedência ou improcedência das infrações de trânsito aplicadas, e poderá o LOCATÁRIO, a seu critério e às suas expensas, recorrer das multas, junto ao Órgão de Trânsito competente, o que não o eximirá do pagamento do valor da multa, mas lhe dará o direito ao reembolso, caso o recurso seja julgado procedente.</p>
        <br/>
        <p><strong>CLÁUSULA 9ª – DAS OBRIGAÇÕES DO LOCATÁRIO</strong></p>
        <p>Constituem obrigações do LOCATÁRIO:</p>
        <p>I – Pagar pontualmente o aluguel;</p>
        <p>II – Servir-se do veículo para o uso convencionado ou presumido, compatível com a natureza deste e com as circunstâncias;</p>
        <p>III – Zelar pelo veículo como se fosse seu;</p>
        <p>IV – Restituir o veículo, no final da locação, no estado em que o recebeu, conforme o laudo de vistoria, salvo as deteriorações decorrentes do seu uso normal;</p>
        <p>V – Levar imediatamente ao conhecimento da LOCADORA o surgimento de qualquer dano, ou ocorrência, cuja reparação, e ou indenização, a esta enquadre;</p>
        <p>VI – Reparar rapidamente os danos sob sua responsabilidade;</p>
        <p>VII – não modificar a forma interna ou externa do veículo sem o consentimento prévio e por escrito da LOCADORA.</p>
        <br/>
        <p><strong>CLÁUSULA 10ª – DAS OBRIGAÇÕES DA LOCADORA</strong></p>
        <p>Constituem obrigações da LOCADORA:</p>
        <p>I – Entregar ao LOCATÁRIO o veículo em estado de servir ao uso a que se destina;</p>
        <p>II – Manter o LOCATÁRIO no uso pacífico do veículo durante o tempo do contrato;</p>
        <p>III – Responder pelos vícios ou defeitos anteriores à locação.</p>
        <br/>
        <p><strong>CLÁUSULA 11ª – DA CAUÇÃO</strong></p>
        <p>Para garantir o cumprimento das obrigações assumidas neste contrato, o LOCATÁRIO oferece em caução a quantia de R$ ${serviceData.caucao}, que será devolvida ao final do contrato, desde que cumpridas todas as obrigações contratuais.</p>
        <p><strong>Parágrafo único.</strong> A caução poderá ser utilizada pela LOCADORA para cobrir eventuais danos ao veículo, multas de trânsito, ou qualquer outro débito decorrente do uso do veículo durante o período de locação.</p>
        <br/>
        <p><strong>CLÁUSULA 12ª – DA RESCISÃO</strong></p>
        <p>O presente contrato poderá ser rescindido:</p>
        <p>I – Por acordo entre as partes;</p>
        <p>II – Por inadimplemento de qualquer das cláusulas contratuais;</p>
        <p>III – Por necessidade de reparos no veículo que impeçam seu uso por mais de 15 (quinze) dias;</p>
        <p>IV – Por sinistro que resulte em perda total do veículo.</p>
        <br/>
        <p><strong>CLÁUSULA 13ª – DO FORO</strong></p>
        <p>As partes elegem o foro da comarca de Campo Grande/MS para dirimir quaisquer questões oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.</p>
        <br/>
        <p>E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma, juntamente com 2 (duas) testemunhas.</p>
        <br/>
        <p>Campo Grande/MS, ${day} de ${month} de ${year}.</p>
        <br/>
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>LOCADORA</strong><br/>
              OR DOS SANTOS DE OLIVEIRA LTDA<br/>
              CNPJ: 17.909.442/0001-58
            </div>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid black; padding-top: 5px;">
              <strong>LOCATÁRIO</strong><br/>
              ${clientData.nome}<br/>
              CPF: ${clientData.cpf}
            </div>
          </div>
        </div>
        <br/>
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
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
                onClick={() => setContractType('venda')}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  contractType === 'venda' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
              >
                <div className={`p-4 rounded-2xl mb-4 mx-auto w-fit ${
                  contractType === 'venda' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <FileText className={`w-8 h-8 ${
                    contractType === 'venda' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Venda de Veículos</h3>
                <p className="text-gray-600 text-sm">Contrato para a venda de carros e outros veículos</p>
                {contractType === 'venda' && (
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
            <>
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
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="cliente@email.com"
                            value={clientData.email}
                            onChange={(e) => setClientData({...clientData, email: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dados do serviço */}
                  {contractType === 'garagem' && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                          <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Dados do Serviço</h3>
                          <p className="text-gray-600 text-sm">Informações sobre o serviço prestado</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Veículo
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Honda Civic 2020"
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
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Descrição dos Serviços</label>
                          <textarea
                            placeholder="Descreva detalhadamente os serviços a serem realizados..."
                            value={serviceData.servicos}
                            onChange={(e) => setServiceData({...serviceData, servicos: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm h-24 resize-none"
                          />
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Valor Total (R$)
                            </label>
                            <input
                              type="number"
                              placeholder="1500.00"
                              step="0.01"
                              value={serviceData.valor}
                              onChange={(e) => setServiceData({...serviceData, valor: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Prazo de Entrega
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: 5 dias úteis"
                              value={serviceData.prazo}
                              onChange={(e) => setServiceData({...serviceData, prazo: e.target.value})}
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

                  {contractType === 'locadora' && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Dados do Veículo</h3>
                          <p className="text-gray-600 text-sm">Informações sobre o veículo a ser locado</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            onChange={(e) => {
                              const selected = cars.find(car => car.plate === e.target.value);
                              if (selected) {
                                setServiceData({
                                  ...serviceData,
                                  placa: selected.plate,
                                  modelo: selected.model,
                                  anoFabricacao: selected.year,
                                  cor: selected.color,
                                  renavam: selected.renavam,
                                  valorMercado: selected.market_value
                                });
                              }
                            }}
                            value={serviceData.placa || ''}
                          >
                            <option value="">{loadingCars ? 'Carregando veículos...' : 'Selecione um veículo cadastrado'}</option>
                            {cars.map((car, index) => (
                              <option key={index} value={car.plate}>
                                {car.model} {car.year} - {car.plate}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Modelo
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Honda Civic"
                              value={serviceData.modelo}
                              onChange={(e) => setServiceData({...serviceData, modelo: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Ano de Fabricação</label>
                            <input
                              type="number"
                              placeholder="2020"
                              value={serviceData.anoFabricacao}
                              onChange={(e) => setServiceData({...serviceData, anoFabricacao: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
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
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Palette className="w-4 h-4" />
                              Cor
                            </label>
                            <input
                              type="text"
                              placeholder="Branco"
                              value={serviceData.cor}
                              onChange={(e) => setServiceData({...serviceData, cor: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono"
                            />
                          </div>
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