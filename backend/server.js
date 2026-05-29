// ===========================
// RETÍFICA AMADOR BUENO
// Back-end: Node.js + Express
// ===========================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middlewares ----
app.use(cors());
app.use(express.json());

// Servir os arquivos do front-end estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// ---- Arquivo de persistência (simples, sem banco de dados) ----
const DB_FILE = path.join(__dirname, 'contatos.json');

function lerContatos() {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function salvarContatos(lista) {
  fs.writeFileSync(DB_FILE, JSON.stringify(lista, null, 2), 'utf-8');
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
app.post('/api/contato', (req, res) => {
  const { nome, telefone, email, servico, mensagem } = req.body;

  const erros = validar({ nome, telefone, servico });
  if (erros.length) {
    return res.status(400).json({ error: erros.join(' ') });
  }

  const novo = {
    id: Date.now(),
    nome: nome.trim(),
    telefone: telefone.trim(),
    email: (email || '').trim(),
    servico,
    mensagem: (mensagem || '').trim(),
    data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  };

  const lista = lerContatos();
  lista.push(novo);
  salvarContatos(lista);

  console.log(`[CONTATO] ${novo.data} — ${novo.nome} (${novo.servico})`);

  return res.status(201).json({ ok: true, message: 'Contato recebido com sucesso!' });
});

// GET /api/contatos - Lista todos os contatos recebidos
app.get('/api/contatos', (req, res) => {
  const lista = lerContatos();
  res.json({ total: lista.length, contatos: lista });
});

// DELETE /api/contatos/:id - Remove um contato pelo ID
app.delete('/api/contatos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let lista = lerContatos();
  const antes = lista.length;
  lista = lista.filter(c => c.id !== id);
  if (lista.length === antes) {
    return res.status(404).json({ error: 'Contato não encontrado.' });
  }
  salvarContatos(lista);
  res.json({ ok: true, message: 'Contato removido.' });
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
