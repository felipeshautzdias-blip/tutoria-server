const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'alunos.json');

// ===== Configuração da sincronização com o GitHub =====
// Essas variáveis são configuradas no painel do Render (Environment),
// NUNCA escritas direto no código.
const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_OWNER = process.env.GITHUB_OWNER;       // ex: "seu-usuario"
const GH_REPO = process.env.GITHUB_REPO;         // ex: "tutoria-server"
const GH_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GH_DATA_PATH = 'data';                     // pasta dentro do repo onde os JSON ficam
const GH_ENABLED = !!(GH_TOKEN && GH_OWNER && GH_REPO);

if (!GH_ENABLED) {
  console.warn('[github-sync] Variáveis GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO não configuradas. Rodando SEM backup automático no GitHub.');
}

function githubApiUrl(repoPath) {
  return `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}`;
}

function githubHeaders() {
  return {
    'Authorization': `Bearer ${GH_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'tutoria-server',
  };
}

// Busca o sha atual do arquivo no GitHub (necessário pra sobrescrever). null se o arquivo não existe ainda.
async function githubGetSha(repoPath) {
