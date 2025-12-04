import { createClient } from '@supabase/supabase-js';

// SUBSTITUA ESTES VALORES PELOS DO SEU PROJETO SUPABASE
// Você pode encontrá-los em Project Settings > API
const supabaseUrl = 'https://unhshvmruvlqklyczhdt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaHNodm1ydXZscWtseWN6aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODQ4MDEsImV4cCI6MjA4MDQ2MDgwMX0.ThBkHFba6Ch3knQZsr2XRN02nWBEcvvrTj2ojx9AXEM';

export const supabase = createClient(supabaseUrl, supabaseKey);