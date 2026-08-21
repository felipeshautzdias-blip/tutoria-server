// Service worker mínimo — necessário para o navegador permitir "instalar" o site como app.
// Não faz cache agressivo para sempre pegar os dados mais recentes do servidor.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', () => {}); // deixa passar direto pra rede
