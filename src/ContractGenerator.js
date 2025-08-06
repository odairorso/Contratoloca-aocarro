import React, { useState, useEffect } from 'react';
import { Car, FileText, Send, Download, Wrench } from 'lucide-react';
import { supabase } from './supabaseClient';
import logo from './logo.jpg';

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
        Com placa ${serviceData.placa}, e com o valor de mercado aproximado em R$ ${serviceData.valorMercado}</p>
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
        <p><strong>CLÁUSULA 9ª – DA VEDAÇÃO À SUBLOCAÇÃO E EMPRÉSTIMO DO VEÍCULO</strong></p>
        <p>Será permitido o uso do veículo objeto do presente contrato, apenas do LOCATÁRIO, sendo vedada, no todo ou em parte, a sublocação, transferência, empréstimo, comodato ou cessão da locação, seja a qualquer título, sem expressa anuência da LOCADORA, sob pena de imediata rescisão, aplicação de multa e de demais penalidades contratuais e legais cabíveis.</p>
        <p><strong>Parágrafo único.</strong> Ocorrendo a utilização do veículo por terceiros com a concordância do LOCATÁRIO, este se responsabilizará por qualquer ação civil ou criminal que referida utilização possa gerar, isentando assim a LOCADORA de qualquer responsabilidade, ou ônus.</p>
        <br/>
        <p><strong>CLÁUSULA 10ª – DA MANUTENÇÃO</strong></p>
        <p>A manutenção do veículo, referente a troca das peças oriundas do desgaste natural de sua utilização, é de responsabilidade do LOCATÁRIO, sem ônus para a LOCADORA.</p>
        <p><strong>Parágrafo único.</strong> Se durante o período da manutenção o LOCATÁRIO não dispor do bem, ou de outro de categoria igual ou similar, terá desconto no aluguel, proporcional ao período de manutenção.</p>
        <br/>
        <p><strong>CLÁUSULA 11ª – DA UTILIZAÇÃO DO SEGURO</strong></p>
        <p>Ocorrendo a necessidade da utilização do seguro veicular, registrado em nome da LOCADORA, devido à perda, extravio, furto, roubo, destruição parcial ou total, ou colisão do veículo por ora locado, fica desde já estipulada indenização devida pelo LOCATÁRIO que deverá, para efeito de cobertura do valor da franquia do seguro veicular, pagar à LOCADORA o valor de R$ 3.520,00 (três mil e quinhentos e vinte reais).</p>
        <br/>
        <p><strong>CLÁUSULA 12ª – DOS DEVERES DO LOCATÁRIO</strong></p>
        <p>Sem prejuízo de outras disposições deste contrato, constituem obrigações do LOCATÁRIO:</p>
        <p>I – Pagar o aluguel e os encargos da locação, legal ou contratualmente exigíveis, no prazo estipulado;</p>
        <p>II – Usar o veículo como foi convencionado, de acordo com a sua natureza e com o objetivo a que se destina;</p>
        <p>III – cuidar e zelar do veículo como se fosse sua propriedade;</p>
        <p>IV – Restituir o veículo, no final da locação, no estado em que o recebeu, conforme o laudo de vistoria, salvo as deteriorações decorrentes do seu uso normal;</p>
        <p>V – Levar imediatamente ao conhecimento da LOCADORA o surgimento de qualquer dano, ou ocorrência, cuja reparação, e ou indenização, a esta enquadre;</p>
        <p>VI – Reparar rapidamente os danos sob sua responsabilidade;</p>
        <p>VII – não modificar a forma interna ou externa do veículo sem o consentimento prévio e por escrito da LOCADORA.</p>
        <br/>
        <p><strong>CLÁUSULA 13ª – DOS DEVERES DA LOCADORA</strong></p>
        <p>Sem prejuízo de outras disposições deste contrato, constituem obrigações da LOCADORA:</p>
        <p>I – Entregar ao LOCATÁRIO o veículo alugado em estado de servir ao uso a que se destina;</p>
        <p>II – Ser integralmente responsável pelos problemas, defeitos e vícios anteriores à locação.</p>
        <br/>
        <p><strong>CLÁUSULA 14ª – DA GARANTIA</strong></p>
        <p>O cumprimento das obrigações previstas neste contrato, inclusive o pagamento pontual do aluguel, estará garantido por caução dada em dinheiro, perfazendo o montante de R$ ${serviceData.caucao} (), entregue à LOCADORA no ato de assinatura deste contrato.</p>
        <p><strong>§ 1º.</strong> Ao final da locação, tendo sido todas as obrigações devidamente cumpridas, o LOCATÁRIO estará autorizado a levantar a respectiva soma.</p>
        <p><strong>§ 2º.</strong> A critério das partes, o valor dado como caução poderá ser revertido para o pagamento de aluguéis devidos.</p>
        <br/>
        <p><strong>CLÁUSULA 15ª – DA RESCISÃO</strong></p>
        <p>As partes poderão rescindir o contrato unilateralmente, sem apresentação de justificativa.</p>
        <p><strong>Parágrafo único.</strong> Em cumprimento ao princípio da boa-fé, as partes se comprometem a informar uma à outra qualquer fato que possa porventura intervir na relação jurídica formalizada através do presente contrato.</p>
        <br/>
        <p><strong>CLÁUSULA 16ª – DAS PENALIDADES</strong></p>
        <p>A parte que violar as obrigações previstas neste contrato se sujeitará ao pagamento de indenização e ressarcimento pelas perdas, danos, lucros cessantes, danos indiretos e quaisquer outros prejuízos patrimoniais ou morais percebidos pela outra parte em decorrência deste descumprimento, sem prejuízo de demais penalidades legais ou contratuais cabíveis.</p>
        <p><strong>§ 1º.</strong> Caso ocorra uma violação, este contrato poderá ser rescindido de pleno direito pela parte prejudicada, sem a necessidade aviso prévio.</p>
        <p><strong>§ 2º.</strong> Ocorrendo uma tolerância de uma das partes em relação ao descumprimento das cláusulas contidas neste instrumento não se configura em renúncia ou alteração da norma infringida.</p>
        <br/>
        <p><strong>CLÁUSULA 17ª – DO FORO</strong></p>
        <p>Fica desde já eleito o foro da comarca de Naviraí para serem resolvidas eventuais pendências decorrentes deste contrato.</p>
        <br/>
        <p>Por estarem assim certos e ajustados, firmam os signatários este instrumento em 02 (duas) vias de igual teor e forma.</p>
        <br/><br/>
        <p style="text-align: center;">Naviraí, ${day} de ${month} de ${year}.</p>
        <br/><br/>
        <div style="text-align: center;">
          <p>______________________________________________________</p>
          <p>LOCADORA: João Roberto dos Santos de Oliveira</p>
          <p>neste ato representando a pessoa jurídica Or dos Santos de Oliveira</p>
        </div>
        <br/><br/>
        <div style="text-align: center;">
          <p>_____________________________________________________</p>
          <p>LOCATÁRIO: ${clientData.nome}</p>
        </div>
        <br/><br/>
        <div>
          <p>TESTEMUNHAS:</p>
          <br/>
          <div className="flex flex-wrap justify-start text-left">
            <div className="w-full sm:w-2/5">
              <p className="flex items-baseline">1. <span className="flex-grow border-b border-black ml-2"></span></p>
              <p>Nome:</p>
              <p>CPF:</p>
            </div>
            <div className="w-full sm:w-2/5">
              <p className="flex items-baseline">2. <span className="flex-grow border-b border-black ml-2"></span></p>
              <p>Nome:</p>
              <p>CPF:</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return <div dangerouslySetInnerHTML={{ __html: contractHTML }} />;
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          {/* Seleção do tipo de contrato */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setContractType('venda')}
              className={`p-6 rounded-lg border-2 transition-all ${contractType === 'venda' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Venda de Veículos</h3>
              <p className="text-gray-600">Contrato para a venda de carros e outros veículos.</p>
            </button>

            <button
              onClick={() => setContractType('locadora')}
              className={`p-6 rounded-lg border-2 transition-all ${contractType === 'locadora' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
            >
              <Car className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Locação de Veículos</h3>
              <p className="text-gray-600">Contrato para aluguel de carros e veículos</p>
            </button>
          </div>

          {/* Formulário e Preview */}
          {contractType && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulário */}
              <div className="space-y-6">
                {/* Cliente */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados do Cliente</h3>
                  <div className="space-y-4">
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => {
                        const selected = clients.find(c => c.client_data.cpf === e.target.value);
                        if (selected) setClientData(selected.client_data);
                      }}
                      value={clientData.cpf || ''}
                    >
                      <option value="">{loadingClients ? 'Carregando clientes...' : 'Selecione um cliente'}</option>
                      {clients.map((client, index) => (
                        <option key={index} value={client.client_data.cpf}>
                          {client.client_data.nome} ({client.client_data.cpf})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={clientData.nome}
                      onChange={(e) => setClientData({...clientData, nome: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="CPF / CNPJ"
                        value={clientData.cpf}
                        onChange={(e) => setClientData({...clientData, cpf: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="RG / Inscrição Estadual"
                        value={clientData.rg}
                        onChange={(e) => setClientData({...clientData, rg: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Endereço"
                        value={clientData.endereco}
                        onChange={(e) => setClientData({...clientData, endereco: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={clientData.bairro}
                        onChange={(e) => setClientData({...clientData, bairro: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Telefone"
                        value={clientData.telefone}
                        onChange={(e) => setClientData({...clientData, telefone: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={clientData.email}
                        onChange={(e) => setClientData({...clientData, email: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados do serviço */}
                {contractType === 'garagem' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados do Serviço</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Veículo (marca/modelo)"
                          value={serviceData.veiculo}
                          onChange={(e) => setServiceData({...serviceData, veiculo: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Placa"
                          value={serviceData.placa}
                          onChange={(e) => setServiceData({...serviceData, placa: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <textarea
                        placeholder="Descrição dos serviços"
                        value={serviceData.servicos}
                        onChange={(e) => setServiceData({...serviceData, servicos: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Valor total (R$)"
                          value={serviceData.valor}
                          onChange={(e) => setServiceData({...serviceData, valor: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Prazo de entrega"
                          value={serviceData.prazo}
                          onChange={(e) => setServiceData({...serviceData, prazo: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <textarea
                        placeholder="Observações adicionais"
                        value={serviceData.observacoes}
                        onChange={(e) => setServiceData({...serviceData, observacoes: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                      />
                    </div>
                  </div>
                )}

                {contractType === 'locadora' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados da Locação</h3>
                    <div className="space-y-4">
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        onChange={(e) => {
                          const selected = cars.find(car => car.plate === e.target.value);
                          if (selected) {
                            setServiceData({
                              ...serviceData,
                              modelo: selected.model,
                              anoFabricacao: selected.year,
                              placa: selected.plate,
                              valorDiaria: selected.price,
                              // Adicione outros campos do carro que você queira preencher automaticamente
                            });
                          }
                        }}
                        value={serviceData.placa || ''}
                      >
                        <option value="">{loadingCars ? 'Carregando carros...' : 'Selecione um carro'}</option>
                        {cars.map((car, index) => (
                          <option key={index} value={car.plate}>
                            {car.brand} {car.model} ({car.plate})
                          </option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Modelo do veículo"
                          value={serviceData.modelo}
                          onChange={(e) => setServiceData({...serviceData, modelo: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <input
                          type="text"
                          placeholder="Ano de fabricação"
                          value={serviceData.anoFabricacao}
                          onChange={(e) => setServiceData({...serviceData, anoFabricacao: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Cor"
                          value={serviceData.cor}
                          onChange={(e) => setServiceData({...serviceData, cor: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <input
                          type="text"
                          placeholder="Placa"
                          value={serviceData.placa}
                          onChange={(e) => setServiceData({...serviceData, placa: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <input
                          type="text"
                          placeholder="RENAVAM"
                          value={serviceData.renavam}
                          onChange={(e) => setServiceData({...serviceData, renavam: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          placeholder="Data de Início"
                          value={serviceData.dataInicio}
                          onChange={(e) => setServiceData({...serviceData, dataInicio: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <input
                          type="date"
                          placeholder="Data de Fim"
                          value={serviceData.dataFim}
                          onChange={(e) => setServiceData({...serviceData, dataFim: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Valor da Diária (R$)"
                          value={serviceData.valorDiaria}
                          onChange={(e) => setServiceData({...serviceData, valorDiaria: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-100">
                          <span className="text-sm text-gray-500">Total: R$ {total} ({dias} dias)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Valor da Caução (R$)"
                          value={serviceData.caucao}
                          onChange={(e) => setServiceData({...serviceData, caucao: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <input
                          type="text"
                          placeholder="KM Inicial"
                          value={serviceData.kmInicial}
                          onChange={(e) => setServiceData({...serviceData, kmInicial: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                         <input
                          type="text"
                          placeholder="Valor de Mercado (R$)"
                          value={serviceData.valorMercado}
                          onChange={(e) => setServiceData({...serviceData, valorMercado: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <textarea
                        placeholder="Observações Adicionais"
                        value={serviceData.observacoes}
                        onChange={(e) => setServiceData({...serviceData, observacoes: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-20"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={generateContract}
                  disabled={isGenerating || !clientData.nome}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${contractType === 'garagem' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
                </button>
              </div>

              {/* Preview do contrato */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 print:border-none" id="contract-preview-container">
                <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto print:bg-white print:p-0">
                  {generatedContract ? (
                    <div>
                      <img src={logo} alt="Logo" className="w-48 mx-auto mb-4" />
                      {generatedContract}
                    </div>
                  ) : (
                    <p className="text-gray-500">O contrato gerado aparecerá aqui.</p>
                  )}
                </div>
                {generatedContract && (
                  <button
                    onClick={() => window.print()}
                    className="mt-4 w-full py-2 px-4 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all flex items-center justify-center gap-2 print:hidden"
                  >
                    <Download className="w-5 h-5" />
                    Imprimir / Salvar PDF
                  </button>
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
