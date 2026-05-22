// routers/produtos.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Rota de teste de erro — mantida igual
router.get('/erro-teste', (req, res) => {
    throw new Error('Teste de Erro :(');
});

// GET /api/produtos?categoriaId=1
router.get('/', async (req, res, next) => {
    try {
        const { categoriaId } = req.query;

        let query = supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (categoriaId) {
            query = query.eq('categoriaid', categoriaId); // campo no banco é minúsculo
        }

        const { data, error } = await query;
        if (error) throw error;

        res.json(data);
    } catch (error) {
        next(error);
    }
});

// POST /api/produtos
router.post('/', async (req, res, next) => {
    try {
        const { nome, preco, descricao, imagem, categoriaid } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({ erro: 'nome e preco são obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('produtos')
            .insert([{ nome, preco, descricao, imagem, categoriaid }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
});

// PUT /api/produtos/:id  ← era '/;id' (bug de digitação)
router.put('/:id', async (req, res, next) => {
    try {
        const { nome, preco, descricao, imagem, categoriaid } = req.body;

        const { data, error } = await supabase
            .from('produtos')
            .update({ nome, preco, descricao, imagem, categoriaid })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ erro: 'Produto não encontrado.' });

        res.json(data);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/produtos/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;