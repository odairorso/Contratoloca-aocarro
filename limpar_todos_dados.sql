-- Script para limpar TODOS os dados de exemplo das tabelas
-- Este script remove todos os clientes e veículos inseridos automaticamente
-- Deixando as tabelas completamente vazias para cadastro manual

-- Limpar tabela de veículos
DELETE FROM veiculos;

-- Limpar tabela de clientes  
DELETE FROM clientes;

-- Verificar se as tabelas estão vazias
SELECT 'Clientes restantes:' as info, COUNT(*) as total FROM clientes;
SELECT 'Veículos restantes:' as info, COUNT(*) as total FROM veiculos;

-- Confirmar limpeza
SELECT 'Limpeza concluída! Tabelas prontas para cadastro manual.' as status;