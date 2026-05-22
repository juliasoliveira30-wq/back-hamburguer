// routes/pedidos.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

router.get('/erro-teste', (req, res) => {
    throw new Error('Teste de Erro :(');
});

// GET - listar pedidos
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST - criar pedido
router.post('/', async (req, res) => {
    const { cliente_nome, cliente_endereco, itens, total } = req.body;

    if (!cliente_nome || !cliente_endereco || !itens || !total) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const { data, error } = await supabase
        .from('pedidos')
        .insert([{ cliente_nome, cliente_endereco, itens, total, status: 'pendente' }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

module.exports = router;