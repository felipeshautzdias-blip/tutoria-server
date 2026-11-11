const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'alunos.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

app.use(express.json({ limit: '5mb' }));

// express.static já serve automaticamente:
//   /            -> public/index.html   (a "loja de apps")
//   /tutoria.html -> public/tutoria.html (o sistema de tutoria)
// Sistemas futuros: basta colocar o .html deles em /public e criar um card em index.html
app.use(express.static(path.join(__dirname, 'public')));

// ===== Endpoint específico do sistema de Tutoria (mantido por compatibilidade) =====
app.get('/api/alunos', (req, res) => {
  try {
    const dados = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(dados));
  } catch (e) {
    console.error('Erro ao ler dados:', e);
    res.status(500).json({ erro: 'Falha ao ler os dados.' });
  }
});

app.put('/api/alunos', (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ erro: 'Formato inválido: esperado um array de alunos.' });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
    res.status(500).json({ erro: 'Falha ao salvar os dados.' });
  }
});

// ===== Endpoint GENÉRICO para qualquer outro app (Anthony, futuros sistemas, etc.) =====
// Cada app usa sua própria "chave" (ex: devloper-tech-projects) e guarda o que quiser ali.
// GET  /api/store/:chave  -> devolve o JSON salvo (ou [] se ainda não existir)
// PUT  /api/store/:chave  -> substitui o JSON salvo pelo corpo da requisição
const CHAVE_VALIDA = /^[a-zA-Z0-9_-]+$/;

function caminhoDaChave(chave) {
  return path.join(DATA_DIR, `${chave}.json`);
}

app.get('/api/store/:chave', (req, res) => {
  const { chave } = req.params;
  if (!CHAVE_VALIDA.test(chave)) {
    return res.status(400).json({ erro: 'Chave inválida.' });
  }
  const arquivo = caminhoDaChave(chave);
  try {
    if (!fs.existsSync(arquivo)) {
      return res.json([]);
    }
    const dados = fs.readFileSync(arquivo, 'utf8');
    res.json(JSON.parse(dados));
  } catch (e) {
    console.error(`Erro ao ler ${chave}:`, e);
    res.status(500).json({ erro: 'Falha ao ler os dados.' });
  }
});

app.put('/api/store/:chave', (req, res) => {
  const { chave } = req.params;
  if (!CHAVE_VALIDA.test(chave)) {
    return res.status(400).json({ erro: 'Chave inválida.' });
  }
  try {
    fs.writeFileSync(caminhoDaChave(chave), JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error(`Erro ao salvar ${chave}:`, e);
    res.status(500).json({ erro: 'Falha ao salvar os dados.' });
  }
});

// Qualquer rota desconhecida volta pra "loja de apps" em vez de dar erro cru
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
