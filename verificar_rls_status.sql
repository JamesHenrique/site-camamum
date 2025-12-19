-- ============================================
-- VERIFICAR STATUS DE RLS E POLICIES
-- ============================================

-- 1. Verificar se RLS está ATIVO na tabela properties
SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_habilitado
FROM pg_tables
WHERE tablename = 'properties';

-- 2. Ver TODAS as policies da tabela properties
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'properties'
ORDER BY cmd, policyname;

-- 3. Testar se policies estão funcionando (contexto não autenticado)
-- Esta query deve FUNCIONAR (SELECT é público)
SELECT COUNT(*) as total_properties FROM properties;

-- 4. Ver estrutura da tabela properties
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
