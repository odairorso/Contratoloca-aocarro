import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { FileText, User, Car, Phone, Mail, MapPin, Hash, Calendar, DollarSign, Loader, CheckCircle, Printer, Edit, Upload } from 'lucide-react';

const ContractGenerator = () => {
  const [contractType, setContractType] = useState('locadora');
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
    valorMercado: '',
    observacoes: ''
  });
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingCars, setLoadingCars] = useState(true);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchCars();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
    } finally {
      setLoadingCars(false);
    }
  };

  const calculateDays = () => {
    if (!serviceData.dataInicio || !serviceData.dataFim) return 0;
    const start = new Date(serviceData.dataInicio);
    const end = new Date(serviceData.dataFim);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const dailyRate = parseFloat(serviceData.valorDiaria) || 0;
    return (days * dailyRate).toFixed(2);
  };

  const dias = calculateDays();
  const total = calculateTotal();

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateContract = async () => {
    setIsGenerating(true);
    try {
      const contractElement = generateRentalContract();
      setGeneratedContract(contractElement);
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRentalContract = () => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };

    return (
      <div style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '12pt', lineHeight: '1.5' }}>
        {logo && <img src={logo} alt="Logo" style={{ maxWidth: '200px', margin: '0 auto 20px' }} />}
        <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>CONTRATO DE LOCAÇÃO DE VEÍCULO</h2>
        <br/>
        <p><strong>Entre:</strong></p>
        <p>a pessoa jurídica OR DOS SANTOS DE OLIVEIRA LTDA, inscrita sob o CNPJ n.º 17.909.442/0001-58, com sede em Av campo grande 707 centro, neste ato representada, conforme poderes especialmente conferidos, por: João Roberto dos Santos de Oliveira, na qualidade de: Administrador, CPF n.º 008.714.291-01, carteira de identidade n.º 1447272 doravante denominada LOCADORA, e:</p>
        <p><strong>{clientData.nome}</strong>, CNPJ n.º <strong>{clientData.cpf}</strong>, residente em: <strong>{clientData.endereco}</strong>, doravante denominado LOCATÁRIO.</p>
        <br/>
        <p>As partes acima identificadas têm entre si justo e acertado o presente contrato de locação de veículo, ficando desde já aceito nas cláusulas e condições abaixo descritas.</p>
        <br/>
        <p><strong>CLÁUSULA 1ª – DO OBJETO</strong></p>
        <p>Por meio deste contrato, que firmam entre si a LOCADORA e o LOCATÁRIO, regula- se a locação do veículo: <strong>{serviceData.veiculo}</strong> ano <strong>{serviceData.anoFabricacao}</strong> Com placa <strong>{serviceData.placa}</strong>, e com o valor de mercado aproximado em R$ <strong>{serviceData.valorMercado}</strong>.</p>
        <p>Parágrafo único. O presente contrato é acompanhado de um laudo de vistoria, que descreve o veículo e o seu estado de conservação no momento em que o mesmo foi entregue ao LOCATÁRIO.</p>
        <br/>
        <p><strong>CLÁUSULA 2ª – DO VALOR DO ALUGUEL</strong></p>
        <p>O valor da diária do aluguel, livremente ajustado pelas partes, é de R$ <strong>{serviceData.valorDiaria}</strong>.</p>
        <p>§ 1º. O LOCATÁRIO deverá efetuar o pagamento do valor acordado, por meio de pix, utilizando a chave 17909442000158,ou em espécie,ou cartão.</p>
        <p>§ 2º. Em caso de atraso no pagamento do aluguel, será aplicada multa de 5% (cinco por cento), sobre o valor devido, bem como juros de mora de 3% (um por cento) ao mês, mais correção monetária, apurada conforme variação do IGP-M no período.</p>
        <p>§ 3º. O LOCATÁRIO, não vindo a efetuar o pagamento do aluguel por um período de atraso superior à 7 (sete) dias, fica sujeito a ter a posse do veículo configurada como Apropriação Indébita, implicando também a possibilidade de adoção de medidas judiciais, inclusive a Busca e Apreensão do veículo e/ou lavratura de Boletim de Ocorrência, cabendo ao LOCATÁRIO ressarcir a LOCADORA das despesas oriundas da retenção indevida do bem, arcando ainda com as despesas judiciais e/ou extrajudiciais que a LOCADORA venha a ter para efetuar a busca, apreensão e efetiva reintegração da posse do veículo.</p>
        <p>§ 4º. Será de responsabilidade do LOCATÁRIO as despesas referentes à utilização do veículo.</p>
        <p>§ 5º. O valor do aluguel firmado neste contrato será reajustado a cada 12 (doze) meses, tendo como base o índice IGP. Em caso de falta deste índice, o reajuste do valor da locação terá por base a média da variação dos índices inflacionários do ano corrente ao da execução da locação.</p>
        <br/>
        <p><strong>CLÁUSULA 3ª – DO PRAZO DO ALUGUEL</strong></p>
        <p>O prazo de locação do referido veículo é de {formatDate(serviceData.dataInicio)} A {formatDate(serviceData.dataFim)} ENTREGAR ATE AS 8:00 DA MANHÃ.</p>
        <p>§ 1º. Ao final do prazo estipulado, caso as partes permaneçam inertes, a locação prorrogar-se-á automaticamente por tempo indeterminado.</p>
        <p>§ 2º. Caso a LOCADORA não queira prorrogar a locação ao terminar o prazo estipulado neste contrato, e o referido veículo não for devolvido, será cobrado o valor do aluguel proporcional aos dias de atraso acumulado de multa diária de R$ {serviceData.valorDiaria}.</p>
        <p>§ 3º. Finda a locação, o LOCATÁRIO deverá devolver o veículo nas mesmas condições em que recebeu, salvo os desgastes decorrentes do uso normal, sob pena de indenização por perdas e danos a ser apurada.</p>
        <br/>
        <p><strong>CLÁUSULA 4ª – DO COMBUSTÍVEL</strong></p>
        <p>O veículo será entregue ao LOCATÁRIO com um tanque de combustível completo, e sua quantidade será marcada no laudo de vistoria no momento da retirada.</p>
        <p>§ 1º. Ao final do prazo estipulado, o LOCATÁRIO deverá devolver o veículo à LOCADORA com o tanque de combustível completo.</p>
        <p>§ 2º. Caso não ocorra o cumprimento do parágrafo anterior, será cobrado o valor correspondente a leitura do marcador em oitavos, com base em tabela própria, e o valor do litro será informado no momento da retirada pela LOCADORA.</p>
        <p>§ 3º. Caso seja constatado a utilização de combustível adulterado, o LOCATÁRIO responderá pelo mesmo e pelos danos decorrentes de tal utilização.</p>
        <p>§ 4º. Fica desde já acordado que o LOCATÁRIO não terá direito a ressarcimento caso devolva o veículo com uma quantidade de combustível superior a que recebeu.</p>
        <br/>
        <p><strong>CLÁUSULA 5ª – DA LIMPEZA</strong></p>
        <p>O veículo será entregue ao LOCATÁRIO limpo e deverá ser devolvido à LOCADORA nas mesmas condições higiênicas que foi retirado.</p>
        <p>§ 1º. Caso o veículo seja devolvido sujo, interna ou externamente, será cobrada uma taxa de lavagem simples ou especial, dependendo do estado do veículo na devolução.</p>
        <p>§ 2º. Caso haja a necessidade de lavagem especial, será cobrada, além da taxa de lavagem, o valor mínimo de (uma) diária de locação, ou quantas diárias forem necessárias até a disponibilização do veículo para locação, limitado a 5 (cinco) diárias do veículo com base na tarifa vigente.</p>
        <br/>
        <p><strong>CLÁUSULA 6ª – DA UTILIZAÇÃO</strong></p>
        <p>§ 1º. Deverá também o LOCATÁRIO utilizar o veículo alugado sempre de acordo com os regulamentos estabelecidos pelo Conselho Nacional de Trânsito (CONTRAN) e pelo Departamento Estadual de Trânsito (DETRAN).</p>
        <p>§ 2º. A utilização do veículo de forma diferente do descrito acima estará sujeita à cobrança de multa, assim como poderá a LOCADORA dar por rescindido o presente contrato independente de qualquer notificação, e sem maiores formalidades poderá também proceder com o recolhimento do veículo sem que seja ensejada qualquer pretensão para ação indenizatória, reparatória ou compensatória pelo LOCATÁRIO.</p>
        <p>§ 3º. Qualquer modificação no veículo só poderá ser feita com a autorização expressa da LOCADORA.</p>
        <p>§ 4º. O LOCATÁRIO declara estar ciente que quaisquer danos causados, materiais ou pessoais, decorrente da utilização do veículo ora locado, será de sua responsabilidade.</p>
        <br/>
        <p><strong>CLÁUSULA 7ª RESTRIÇÃO TERRITORIAL</strong></p>
        <p>O LOCATÁRIO se compromete a utilizar o veiculo exclusivamente dentro do território nacional brasileiro,sendo expressamente proibida sua saída para qualquer outro pais.Odescumprimento desta cláusula implicará em multa de R$280,00 (Duzentos e oitenta reais ) erescisão imediata do presente contrato,sem prejuízo das demais medidas legais cabíveis.</p>
        <br/>
        <p><strong>CLÁUSULA 8ª – DAS MULTAS E INFRAÇÕES</strong></p>
        <p>As multas ou quaisquer outras infrações às leis de trânsito, cometidas durante o período da locação do veículo, serão de responsabilidade do LOCATÁRIO, devendo ser liquidadas quando da notificação pelos órgãos competentes ou no final do contrato, o que ocorrer primeiro.</p>
        <p>§ 1º. Em caso de apreensão do veículo, serão cobradas do LOCATÁRIO todas as despesas de serviço dos profissionais envolvidos para liberação do veículo alugado, assim como todas as taxas cobradas pelos órgãos competentes, e também quantas diárias forem necessárias até a disponibilização do veículo para locação.</p>
        <p>§ 2º. O LOCATÁRIO declara-se ciente e concorda que se ocorrer qualquer multa ou infração de trânsito durante a vigência deste contrato, seu nome poderá ser indicado pela LOCADORA junto ao Órgão de Trânsito autuante, na qualidade de condutor do veículo, tendo assim a pontuação recebida transferida para sua carteira de habilitação.</p>
        <p>§ 3º. A LOCADORA poderá preencher os dados relativos à "apresentação do Condutor", previsto na Resolução 404/12 do CONTRAN, caso tenha sido lavrada autuação por infrações de trânsito enquanto o veículo esteve em posse e responsabilidade do LOCATÁRIO, situação na qual a LOCADORA apresentará para o Órgão de Trânsito competente a cópia do presente contrato celebrado com o LOCATÁRIO.</p>
        <p>§ 4º. Descabe qualquer discussão sobre a procedência ou improcedência das infrações de trânsito aplicadas, e poderá o LOCATÁRIO, a seu critério e às suas expensas, recorrer das multas, junto ao Órgão de Trânsito competente, o que não o eximirá do pagamento do valor da multa, mas lhe dará o direito ao reembolso, caso o recurso seja julgado procedente.</p>
        <br/>
        <p><strong>CLÁUSULA 9ª – DA VEDAÇÃO À SUBLOCAÇÃO E EMPRÉSTIMO DO VEÍCULO</strong></p>
        <p>Será permitido o uso do veículo objeto do presente contrato, apenas do LOCATÁRIO, sendo vedada, no todo ou em parte, a sublocação, transferência, empréstimo, comodato ou cessão da locação, seja a qualquer título, sem expressa anuência da LOCADORA, sob pena de imediata rescisão, aplicação de multa e de demais penalidades contratuais e legais cabíveis.</p>
        <p>Parágrafo único. Ocorrendo a utilização do veículo por terceiros com a concordância do LOCATÁRIO, este se responsabilizará por qualquer ação civil ou criminal que referida utilização possa gerar, isentando assim a LOCADORA de qualquer responsabilidade, ou ônus.</p>
        <br/>
        <p><strong>CLÁUSULA 10ª – DA MANUTENÇÃO</strong></p>
        <p>A manutenção do veículo, referente a troca das peças oriundas do desgaste natural de sua utilização, é de responsabilidade do LOCATÁRIO, sem ônus para a LOCADORA.</p>
        <p>Parágrafo único. Se durante o período da manutenção o LOCATÁRIO não dispor do bem, ou de outro de categoria igual ou similar, terá desconto no aluguel, proporcional ao período de manutenção.</p>
        <br/>
        <p><strong>CLÁUSULA 11ª – DA UTILIZAÇÃO DO SEGURO</strong></p>
        <p>Ocorrendo a necessidade da utilização do seguro veicular, registrado em nome da LOCADORA, devido à perda, extravio, furto, roubo, destruição parcial ou total, ou colisão do veículo por ora locado, fica desde já estipulada indenização devida pelo LOCATÁRIO que deverá, para efeito de cobertura do valor da franquia do seguro veicular, pagar à LOCADORA o valor de R$ 3.520,00 (três mil e quinhentos e vinte reais).</p>
        <br/>
        <p><strong>CLÁUSULA 12ª – DOS DEVERES DA LOCATÁRIO</strong></p>
        <p>Sem prejuízo de outras disposições deste contrato, constituem obrigações do LOCATÁRIO:</p>
        <p>I – pagar o aluguel e os encargos da locação, legal ou contratualmente exigíveis, no prazo estipulado;</p>
        <p>II – usar o veículo como foi convencionado, de acordo com a sua natureza e com o objetivo a que se destina;</p>
        <p>III – cuidar e zelar do veículo como se fosse sua propriedade;</p>
        <p>IV – restituir o veículo, no final da locação, no estado em que o recebeu, conforme o laudo de vistoria, salvo as deteriorações decorrentes do seu uso normal;</p>
        <p>V – levar imediatamente ao conhecimento da LOCADORA o surgimento de qualquer dano, ou ocorrência, cuja reparação, e ou indenização, a esta enquadre;</p>
        <p>VI – reparar rapidamente os danos sob sua responsabilidade;</p>
        <p>VII – não modificar a forma interna ou externa do veículo sem o consentimento prévio e por escrito da LOCADORA.</p>
        <br/>
        <p><strong>CLÁUSULA 13ª – DOS DEVERES DA LOCADORA</strong></p>
        <p>Sem prejuízo de outras disposições deste contrato, constituem obrigações da LOCADORA:</p>
        <p>I – entregar ao LOCATÁRIO o veículo alugado em estado de servir ao uso a que se destina;</p>
        <p>II – ser integralmente responsável pelos problemas, defeitos e vícios anteriores à locação.</p>
        <br/>
        <p><strong>CLÁUSULA 14ª – DA GARANTIA</strong></p>
        <p>O cumprimento das obrigações previstas neste contrato, inclusive o pagamento pontual do aluguel, estará garantido por caução dada em dinheiro, perfazendo o montante de R$ IZENTO (), entregue à LOCADORA no ato de assinatura deste contrato.</p>
        <p>§ 1º. Ao final da locação, tendo sido todas as obrigações devidamente cumpridas, o LOCATÁRIO estará autorizado a levantar a respectiva soma.</p>
        <p>§ 2º. A critério das partes, o valor dado como caução poderá ser revertido para o pagamento de aluguéis devidos.</p>
        <br/>
        <p><strong>CLÁUSULA 15ª – DA RESCISÃO</strong></p>
        <p>As partes poderão rescindir o contrato unilateralmente, sem apresentação de justificativa.</p>
        <p>Parágrafo único. Em cumprimento ao princípio da boa-fé, as partes se comprometem a informar uma à outra qualquer fato que possa porventura intervir na relação jurídica formalizada através do presente contrato.</p>
        <br/>
        <p><strong>CLÁUSULA 16ª – DAS PENALIDADES</strong></p>
        <p>A parte que violar as obrigações previstas neste contrato se sujeitará ao pagamento de indenização e ressarcimento pelas perdas, danos, lucros cessantes, danos indiretos e quaisquer outros prejuízos patrimoniais ou morais percebidos pela outra parte em decorrência deste descumprimento, sem prejuízo de demais penalidades legais ou contratuais cabíveis.</p>
        <p>§ 1º. Caso ocorra uma violação, este contrato poderá ser rescindido de pleno direito pela parte prejudicada, sem a necessidade aviso prévio.</p>
        <p>§ 2º. Ocorrendo uma tolerância de uma das partes em relação ao descumprimento das cláusulas contidas neste instrumento não se configura em renúncia ou alteração da norma infringida.</p>
        <br/>
        <p><strong>CLÁUSULA 17ª – DO FORO</strong></p>
        <p>Fica desde já eleito o foro da comarca de Naviraí para serem resolvidas eventuais pendências decorrentes deste contrato.</p>
        <br/>
        <p>Por estarem assim certos e ajustados, firmam os signatários este instrumento em 02 (duas) vias de igual teor e forma.</p>
        <br/>
        <p>Naviraí, {new Date().toLocaleDateString('pt-BR', { day: '2-digit' })} de {new Date().toLocaleDateString('pt-BR', { month: 'long' })} de {new Date().getFullYear()}.</p>
        <br/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
              <strong>LOCADORA:</strong> João Roberto dos Santos de Oliveira<br/>
              neste ato representando a pessoa jurídica Or dos Santos de Oliveira
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
              <strong>LOCATÁRIO:</strong> {clientData.nome}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {generatedContract ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-6 print:hidden">
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
            <div className="bg-white rounded-xl p-6 border border-gray-100 print:bg-white print:p-0 print:border-none">
              {generatedContract}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Gerador de Contratos
              </h1>
              <p className="text-gray-600 text-lg">Crie contratos profissionais de forma rápida e eficiente</p>
            </div>
            <div className="grid xl:grid-cols-2 gap-8">
              <div className="space-y-6">
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
                          const selected = clients.find(c => c.cpf === e.target.value);
                          if (selected) setClientData(selected);
                        }}
                        value={clientData.cpf || ''}
                      >
                        <option value="">{loadingClients ? 'Carregando clientes...' : 'Selecione um cliente existente'}</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.cpf}>
                            {client.nome} ({client.cpf})
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
                          const selected = cars.find(car => car.placa === e.target.value);
                          if (selected) {
                            setServiceData({
                              ...serviceData,
                              ...selected
                            });
                          }
                        }}
                        value={serviceData.placa || ''}
                      >
                        <option value="">{loadingCars ? 'Carregando veículos...' : 'Selecione um veículo existente'}</option>
                        {cars.map((car) => (
                          <option key={car.id} value={car.placa}>
                            {car.veiculo} {car.modelo} ({car.placa})
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
                  </div>
                </div>
                <div className="col-span-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Logo (Opcional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <button
                    onClick={generateContract}
                    disabled={isGenerating || !clientData.nome}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractGenerator;
