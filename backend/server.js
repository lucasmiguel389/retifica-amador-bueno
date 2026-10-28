// ===========================
// RETÍFICA AMADOR BUENO
// Back-end: Node.js + Express + PostgreSQL
// ===========================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middlewares ----
app.use(cors());
app.use('/admin.html', protegerAdmin);
app.use(express.json());

// Servir os arquivos do front-end estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// ---- Conexão com o PostgreSQL ----
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// ---- Proteção por senha (área do admin) ----
function protegerAdmin(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, codigo] = cabecalho.split(' ');

  if (tipo === 'Basic' && codigo) {
    const texto = Buffer.from(codigo, 'base64').toString();
    const separador = texto.indexOf(':');
    const usuario = texto.slice(0, separador);
    const senha = texto.slice(separador + 1);

    if (usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASSWORD) {
      return next();
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="Area restrita"');
  return res.status(401).send('Acesso restrito.');
}

// ---- Validação ----
function validar(dados) {
  const erros = [];
  if (!dados.nome || dados.nome.length < 2) erros.push('Nome inválido.');
  if (!dados.telefone || dados.telefone.replace(/\D/g, '').length < 10) erros.push('Telefone inválido.');
  if (!dados.servico) erros.push('Serviço não selecionado.');
  return erros;
}

// ============================
// ROTAS
// ============================

// POST /api/contato - Recebe o formulário
app.post('/api/contato', async (req, res) => {
  const { nome, telefone, email, servico, mensagem } = req.body;

  const erros = validar({ nome, telefone, servico });
  if (erros.length) {
    return res.status(400).json({ error: erros.join(' ') });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO contatos (nome, telefone, email, servico, mensagem)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nome.trim(), telefone.trim(), (email || '').trim(), servico, (mensagem || '').trim()]
    );

    const novo = resultado.rows[0];
    console.log(`[CONTATO] ${novo.criado_em} — ${novo.nome} (${novo.servico})`);

    return res.status(201).json({ ok: true, message: 'Contato recebido com sucesso!' });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ error: 'Erro ao salvar o contato.' });
  }
});

// GET /api/contatos - Lista todos os contatos recebidos
app.get('/api/contatos', protegerAdmin, async (req, res) => {
  try {
    const resultado = await pool.query(
  `SELECT id, nome, telefone, email, servico, mensagem,
          TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS data
   FROM contatos
   ORDER BY criado_em DESC`
);
    res.json({ total: resultado.rows.length, contatos: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ error: 'Erro ao buscar contatos.' });
  }
});

// DELETE /api/contatos/:id - Remove um contato pelo ID
app.delete('/api/contatos/:id', protegerAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const resultado = await pool.query('DELETE FROM contatos WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }

    res.json({ ok: true, message: 'Contato removido.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ error: 'Erro ao remover contato.' });
  }
});

// Fallback: retorna o index.html para qualquer rota não reconhecida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ---- Inicializa ----
app.listen(PORT, () => {
  console.log(`\n🔧 Retífica Amador Bueno — Servidor rodando!`);
  console.log(`   Acesse: http://localhost:${PORT}\n`);
});

