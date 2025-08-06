-- Script SQL para criar e popular as tabelas necessárias no Supabase
-- Execute estes comandos no SQL Editor do seu Supabase

-- 1. Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(20),
    endereco TEXT,
    bairro VARCHAR(100),
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de veículos
CREATE TABLE IF NOT EXISTS public.veiculos (
    id BIGSERIAL PRIMARY KEY,
    veiculo VARCHAR(100) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(100),
    "anoFabricacao" VARCHAR(4),
    cor VARCHAR(50),
    renavam VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS (Row Level Security) - opcional
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas para permitir acesso público (ajuste conforme necessário)
CREATE POLICY "Enable read access for all users" ON public.clientes
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.clientes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.clientes
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.clientes
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.veiculos
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.veiculos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.veiculos
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.veiculos
    FOR DELETE USING (true);

-- 5. Inserir dados de exemplo para clientes
INSERT INTO public.clientes (nome, cpf, rg, endereco, bairro, telefone) VALUES
('João Silva Santos', '123.456.789-00', '12.345.678-9', 'Rua das Flores, 123', 'Centro', '(67) 99999-1234'),
('Maria Oliveira Costa', '987.654.321-00', '98.765.432-1', 'Av. Principal, 456', 'Jardim América', '(67) 88888-5678'),
('Carlos Eduardo Lima', '456.789.123-00', '45.678.912-3', 'Rua do Comércio, 789', 'Vila Nova', '(67) 77777-9012'),
('Ana Paula Ferreira', '321.654.987-00', '32.165.498-7', 'Rua da Paz, 321', 'Bela Vista', '(67) 66666-3456'),
('Roberto Almeida', '654.321.987-00', '65.432.198-7', 'Av. Brasil, 654', 'Centro', '(67) 55555-7890')
ON CONFLICT DO NOTHING;

-- 6. Inserir dados de exemplo para veículos
INSERT INTO public.veiculos (veiculo, placa, modelo, "anoFabricacao", cor, renavam) VALUES
('Honda Civic', 'ABC-1234', 'Civic EXL', '2020', 'Prata', '12345678901'),
('Toyota Corolla', 'DEF-5678', 'Corolla XEI', '2021', 'Branco', '23456789012'),
('Volkswagen Jetta', 'GHI-9012', 'Jetta TSI', '2019', 'Preto', '34567890123'),
('Chevrolet Onix', 'JKL-3456', 'Onix Plus', '2022', 'Azul', '45678901234'),
('Ford Ka', 'MNO-7890', 'Ka SE', '2020', 'Vermelho', '56789012345'),
('Hyundai HB20', 'PQR-1357', 'HB20 Comfort', '2021', 'Cinza', '67890123456'),
('Nissan Versa', 'STU-2468', 'Versa SL', '2022', 'Branco', '78901234567')
ON CONFLICT (placa) DO NOTHING;

-- 7. Verificar se os dados foram inseridos
SELECT 'Clientes cadastrados:' as info, COUNT(*) as total FROM public.clientes
UNION ALL
SELECT 'Veículos cadastrados:' as info, COUNT(*) as total FROM public.veiculos;

-- Fim do script
-- Após executar este script, seus dropdowns no sistema devem funcionar corretamente!