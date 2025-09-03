-- Adicionar campos de endereço separados à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN street TEXT,
ADD COLUMN house_number TEXT,
ADD COLUMN complement TEXT,
ADD COLUMN neighborhood TEXT,
ADD COLUMN city TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN state TEXT;

-- Remover o campo antigo de endereço
ALTER TABLE public.profiles DROP COLUMN IF EXISTS address;