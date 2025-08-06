-- Script para excluir todos os veiculos de exemplo criados automaticamente
-- Execute este comando no SQL Editor do seu Supabase

-- Excluir veiculos especificos que foram inseridos automaticamente
DELETE FROM public.veiculos WHERE placa IN (
    'ABC-1234',
    'DEF-5678',
    'GHI-9012',
    'JKL-3456',
    'MNO-7890',
    'PQR-1357',
    'STU-2468'
);

-- Verificar quantos veiculos restaram apos a limpeza
SELECT 'Veiculos restantes:' as info, COUNT(*) as total FROM public.veiculos;

-- Listar os veiculos que permaneceram (seus dados originais)
SELECT veiculo, placa, modelo, "anoFabricacao", cor 
FROM public.veiculos 
ORDER BY created_at;

-- Fim do script de limpeza