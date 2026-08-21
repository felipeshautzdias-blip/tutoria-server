const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'alunos.json');

// Garante que a pasta/arquivo de dados existam
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Retorna a lista completa de alunos
app.get('/api/alunos', (req, res) => {
  try {
    const dados = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(dados));
  } catch (e) {
    console.error('Erro ao ler dados:', e);
    res.status(500).json({ erro: 'Falha ao ler os dados.' });
  }
});

// Substitui a lista completa de alunos (é assim que o site salva hoje)
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

// Qualquer outra rota cai no site (fallback simples)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tutoria.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
