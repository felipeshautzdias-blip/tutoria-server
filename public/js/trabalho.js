 // SENHAS DO SISTEMA
  const SENHA_ALUNO = "@Josetalarico1";
  const SENHA_PROFESSOR = "@Professor2026";
  const SENHA_DIRETOR = "@Diretor2026"; 

  const LISTA_MATERIAS = ["Artes", "Biologia", "Ciências", "Educação Física", "Física", "Geografia", "História", "Inglês", "Matemática", "Português", "Química"];

  function resetarBanco() {
      if(confirm("Tem certeza que deseja resetar todo o banco de dados para a configuração padrão?")) {
          localStorage.removeItem('banco_usuarios');
          inicializarBanco();
          alert("Banco de dados resetado com sucesso!");
          location.reload();
      }
  }

  function inicializarBanco() {
    let banco = localStorage.getItem('banco_usuarios');
    if (!banco) {
      const ALUNOS_DB_INICIAL = [
        {
          nome:"Ana Clara Silva",ra:"1000202400011",digito:"1",turma:"6A",
          materias: {
            "Matemática": [8.5, 7.0, 9.0, 8.0],
            "Português": [6.0, 8.0, 7.5, 9.0],
            "História": [9.0, 9.5, 8.0, 10.0]
          }
        },
        {nome:"Arthur Santos Lima",ra:"1000202400012",digito:"2",turma:"6A",materias:{}},
        {nome:"João Pedro Carvalho",ra:"1000202400021",digito:"1",turma:"6B",materias:{}},
        {nome:"Alice Monteiro",ra:"1000202400031",digito:"1",turma:"7A",materias:{}},
        {nome:"Miguel Ângelo",ra:"1000202400041",digito:"1",turma:"7B",materias:{}},
        {nome:"André Luiz Soares",ra:"1000202400051",digito:"1",turma:"8A",materias:{}},
        {nome:"Kauan Felipe",ra:"1000202400061",digito:"1",turma:"8B",materias:{}},
        {nome:"Alan Kardec",ra:"1000202400071",digito:"1",turma:"9A",materias:{}},
        {nome:"Marcos Paulo",ra:"1000202400081",digito:"1",turma:"9B",materias:{}},
        {nome:"Alice Paulino",ra:"1000202400091",digito:"1",turma:"1A",materias:{}},
        {nome:"Karen Junqueira",ra:"1000202400101",digito:"1",turma:"1B",materias:{}},
        {nome:"Ulisses Campbell",ra:"1000202400111",digito:"1",turma:"1C",materias:{}},
        {nome:"Elaine Mickely",ra:"1000202400121",digito:"1",turma:"2A",materias:{}},
        {nome:"Otaviano Costa",ra:"1000202400131",digito:"1",turma:"2B",materias:{}},
        {nome:"Alexandre Frota",ra:"1000202400141",digito:"1",turma:"3A-TECNICO",materias:{}},
        {nome:"Klebber Toledo",ra:"1000202400151",digito:"1",turma:"3B-REGULAR",materias:{}}
      ];
      localStorage.setItem('banco_usuarios', JSON.stringify(ALUNOS_DB_INICIAL));
    }
  }
  inicializarBanco();

  function obterBancoUsuarios() {
    return JSON.parse(localStorage.getItem('banco_usuarios')) || [];
  }

  // ESTADOS GLOBAIS DE SESSÃO
  const estadoAluno = { nome:"", ra:"", digito:"", turma:"", materia:"", notas:[] };
  const estadoPais = { nome:"", telefone:"", filhoSelecionado: null };
  const estadoProf = { nome:"", alunoSelecionado: null, materiaSelecionada: "" };
  const estadoDir = { nome:"", alunoSelecionado: null };

  const telas = {
    'aluno-login': document.getElementById('tela-aluno-login'),
    'aluno-materia': document.getElementById('tela-aluno-materia'),
    'aluno-boletim': document.getElementById('tela-aluno-boletim'),
    
    'pais-login': document.getElementById('tela-pais-login'),
    'pais-busca': document.getElementById('tela-pais-busca'),
    'pais-boletim': document.getElementById('tela-pais-boletim'),

    'prof-login': document.getElementById('tela-prof-login'),
    'prof-alunos': document.getElementById('tela-prof-alunos'),
    'prof-materia': document.getElementById('tela-prof-materia'),
    'prof-notas': document.getElementById('tela-prof-notas'),
    'prof-pdf': document.getElementById('tela-prof-pdf'),

    'dir-login': document.getElementById('tela-dir-login'),
    'dir-turmas': document.getElementById('tela-dir-turmas'),
    'dir-boletim': document.getElementById('tela-dir-boletim'),
    'dir-add-aluno': document.getElementById('tela-dir-add-aluno'),
    'dir-edit-aluno': document.getElementById('tela-dir-edit-aluno')
  };

  const ordemEtapas = {
    'aluno': ['aluno-login', 'aluno-materia', 'aluno-boletim'],
    'pais': ['pais-login', 'pais-busca', 'pais-boletim'],
    'prof': ['prof-login', 'prof-alunos', 'prof-materia', 'prof-notas', 'prof-pdf'],
    'dir': ['dir-login', 'dir-turmas', 'dir-boletim', 'dir-add-aluno', 'dir-edit-aluno']
  };

  let perfilAtual = 'aluno';

  function trocarPerfil(perfil) {
    perfilAtual = perfil;
    document.querySelectorAll('.profile-btn').forEach(btn => btn.classList.remove('active'));
    
    if(perfil === 'aluno') {
      document.querySelectorAll('.profile-btn')[0].classList.add('active');
      mostrarTela('aluno-login');
    } else if(perfil === 'pais') {
      document.querySelectorAll('.profile-btn')[1].classList.add('active');
      mostrarTela('pais-login');
    } else if(perfil === 'professor') {
      document.querySelectorAll('.profile-btn')[2].classList.add('active');
      mostrarTela('prof-login');
    } else if(perfil === 'diretor') {
      document.querySelectorAll('.profile-btn')[3].classList.add('active');
      mostrarTela('dir-login');
    }
  }

  function mostrarTela(nomeTela){
    Object.values(telas).forEach(t => t.classList.add('hidden'));
    if(telas[nomeTela]) telas[nomeTela].classList.remove('hidden');

    document.getElementById('steps-aluno').classList.toggle('hidden', perfilAtual !== 'aluno');
    document.getElementById('steps-pais').classList.toggle('hidden', perfilAtual !== 'pais');
    document.getElementById('steps-professor').classList.toggle('hidden', perfilAtual !== 'professor');
    document.getElementById('steps-diretor').classList.toggle('hidden', perfilAtual !== 'diretor');

    const moduloKey = perfilAtual === 'professor' ? 'prof' : (perfilAtual === 'diretor' ? 'dir' : perfilAtual);
    const etapasModulo = ordemEtapas[moduloKey] || [];
    const containerSteps = document.getElementById(`steps-${perfilAtual === 'professor' ? 'professor' : (perfilAtual === 'diretor' ? 'diretor' : perfilAtual)}`);

    if(containerSteps) {
      const tabs = containerSteps.querySelectorAll('.step-tab');
      const idxAtual = etapasModulo.indexOf(nomeTela);
      tabs.forEach(tab => {
        const idxTab = etapasModulo.indexOf(tab.dataset.step);
        tab.classList.toggle('active', idxTab === idxAtual);
        tab.classList.toggle('done', idxTab < idxAtual);
      });
    }
  }

  // ==========================================
  // 1. LÓGICA DO ALUNO
  // ==========================================
  document.getElementById('btn-login-aluno').addEventListener('click', () => {
    const turma = document.getElementById('aluno-turma-select').value;
    const nome = document.getElementById('aluno-nome').value.trim();
    const ra = document.getElementById('aluno-ra').value.trim();
    const digito = document.getElementById('aluno-digito').value.trim();
    const senha = document.getElementById('aluno-senha').value;
    const erro = document.getElementById('erro-aluno-login');
    erro.textContent = "";

    if(!turma){ erro.textContent = "Selecione sua turma."; return; }
    if(!nome){ erro.textContent = "Digite seu nome completo."; return; }
    if(!ra || !digito){ erro.textContent = "Informe o RA e o dígito."; return; }

    const banco = obterBancoUsuarios();
    const aluno = banco.find(u => u.ra === ra && u.digito === digito);

    if(!aluno){ erro.textContent = "Aluno não encontrado. Verifique o RA e dígito."; return; }
    if(aluno.turma !== turma){ erro.textContent = `Acesso negado! Este aluno pertence à turma ${aluno.turma}.`; return; }
    if(senha !== SENHA_ALUNO){ erro.textContent = "Senha incorreta."; return; }

    estadoAluno.nome = aluno.nome;
    estadoAluno.ra = ra;
    estadoAluno.digito = digito;
    estadoAluno.turma = aluno.turma;

    mostrarTela('aluno-materia');
  });

  document.getElementById('btn-ver-boletim-aluno').addEventListener('click', () => {
    const materia = document.getElementById('aluno-materia-select').value;
    const erro = document.getElementById('erro-aluno-materia');
    erro.textContent = "";

    if(!materia){ erro.textContent = "Selecione uma matéria."; return; }

    const banco = obterBancoUsuarios();
    const aluno = banco.find(u => u.ra === estadoAluno.ra);

    if(!aluno || !aluno.materias || !aluno.materias[materia]) {
        erro.textContent = "Notas ainda não lançadas para essa matéria."; return;
    }

    estadoAluno.materia = materia;
    estadoAluno.notas = aluno.materias[materia]; 

    document.getElementById('aluno-resultado-nome').textContent = `${estadoAluno.nome} (RA: ${estadoAluno.ra}-${estadoAluno.digito})`;
    document.getElementById('aluno-resultado-materia').textContent = `Matéria: ${materia}`;

    const corpo = document.getElementById('aluno-boletim-corpo');
    corpo.innerHTML = "";
    estadoAluno.notas.forEach((nota, idx) => {
      corpo.innerHTML += `<tr><td>${idx + 1}º Bimestre</td><td class="num">${nota.toFixed(1)}</td></tr>`;
    });

    const media = estadoAluno.notas.reduce((s, n) => s + n, 0) / estadoAluno.notas.length;
    document.getElementById('aluno-boletim-media').textContent = media.toFixed(2);
    
    const stamp = document.getElementById('aluno-stamp-resultado');
    const texto = document.getElementById('aluno-resultado-texto');

    if(media >= 5){
      stamp.textContent = "Aprovado"; stamp.className = "stamp ok";
      texto.textContent = `Parabéns, você atingiu a média em ${materia}!`;
    } else {
      stamp.textContent = "Reprovado"; stamp.className = "stamp rec"; 
      texto.textContent = `Sua média ficou abaixo de 5.0 em ${materia}.`;
    }

    mostrarTela('aluno-boletim');
  });

  // ==========================================
  // 2. LÓGICA DOS PAIS / RESPONSÁVEIS
  // ==========================================
  document.getElementById('btn-login-pais').addEventListener('click', () => {
    const nome = document.getElementById('pais-nome').value.trim();
    const tel = document.getElementById('pais-telefone').value.trim();
    const senha = document.getElementById('pais-senha').value;
    const erro = document.getElementById('erro-pais-login');
    erro.textContent = "";

    if(!nome){ erro.textContent = "Por favor, digite seu nome."; return; }
    if(!tel || tel.length < 8){ erro.textContent = "Informe um telefone/WhatsApp válido para contato dos professores."; return; }
    if(!senha){ erro.textContent = "Digite uma senha para acessar."; return; }

    estadoPais.nome = nome;
    estadoPais.telefone = tel;
    document.getElementById('pais-boas-vindas').textContent = `Bem-vindo(a), ${nome}. Pesquise seu filho(a) abaixo.`;

    carregarBuscaFilhos("");
    mostrarTela('pais-busca');
  });

  document.getElementById('btn-pais-buscar').addEventListener('click', () => {
    const termo = document.getElementById('pais-busca-input').value.trim();
    carregarBuscaFilhos(termo);
  });

  function carregarBuscaFilhos(termo) {
    const banco = obterBancoUsuarios();
    const corpo = document.getElementById('pais-filhos-corpo');
    corpo.innerHTML = "";

    const filtrados = banco.filter(u => 
      u.nome.toLowerCase().includes(termo.toLowerCase()) || 
      u.ra.includes(termo)
    );

    if(filtrados.length === 0) {
      corpo.innerHTML = `<tr><td colspan="4" class="vazio-tabela">Nenhum aluno encontrado com esses dados.</td></tr>`;
      return;
    }

    filtrados.forEach(aluno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aluno.turma || "S/T"}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.ra}</td>
        <td><button class="btn-selecionar" onclick="verBoletimPai('${aluno.ra}')">Ver Notas</button></td>
      `;
      corpo.appendChild(tr);
    });
  }

  function verBoletimPai(raAluno) {
    const banco = obterBancoUsuarios();
    const aluno = banco.find(u => u.ra === raAluno);
    if(!aluno) return;

    estadoPais.filhoSelecionado = aluno;
    document.getElementById('pais-filho-nome').textContent = `${aluno.nome} (${aluno.turma || "Sem Turma"}) — RA: ${aluno.ra}`;

    const corpo = document.getElementById('pais-boletim-corpo');
    corpo.innerHTML = "";

    LISTA_MATERIAS.forEach(mat => {
      const notas = (aluno.materias && aluno.materias[mat]) ? aluno.materias[mat] : [];
      const n1 = notas[0] !== undefined ? notas[0].toFixed(1) : "-";
      const n2 = notas[1] !== undefined ? notas[1].toFixed(1) : "-";
      const n3 = notas[2] !== undefined ? notas[2].toFixed(1) : "-";
      const n4 = notas[3] !== undefined ? notas[3].toFixed(1) : "-";

      let mediaFormatada = "-";
      let corMedia = "var(--ink)";

      if(notas.length === 4) {
        const media = notas.reduce((a,b)=>a+b, 0) / 4;
        mediaFormatada = media.toFixed(1);
        corMedia = media >= 5.0 ? "var(--pen-green)" : "var(--pen-red)";
      }

      corpo.innerHTML += `
        <tr>
          <td>${mat}</td>
          <td class="num">${n1}</td>
          <td class="num">${n2}</td>
          <td class="num">${n3}</td>
          <td class="num">${n4}</td>
          <td class="num" style="font-weight:bold; color:${corMedia}">${mediaFormatada}</td>
        </tr>
      `;
    });

    const mensagem = encodeURIComponent(`Olá, sou ${estadoPais.nome}, responsável pelo aluno ${aluno.nome} (${aluno.turma}). Meu telefone é ${estadoPais.telefone}. Gostaria de conversar sobre as notas do boletim.`);
    document.getElementById('link-whatsapp-prof').href = `https://api.whatsapp.com/send?text=${mensagem}`;

    mostrarTela('pais-boletim');
  }

  // ==========================================
  // 3. LÓGICA DO PROFESSOR E GERADOR DE PDF
  // ==========================================
  document.getElementById('btn-login-prof').addEventListener('click', () => {
    const nome = document.getElementById('prof-nome').value.trim();
    const senha = document.getElementById('prof-senha').value;
    const erro = document.getElementById('erro-prof-login');
    if(!nome){ erro.textContent = "Digite seu nome."; return; }
    if(senha !== SENHA_PROFESSOR){ erro.textContent = "Senha incorreta."; return; }
    
    estadoProf.nome = nome;
    document.getElementById('prof-boas-vindas').textContent = `Prof. ${nome}, selecione um aluno.`;
    carregarTabelaProf();
    mostrarTela('prof-alunos');
  });

  function carregarTabelaProf(){
    const banco = obterBancoUsuarios();
    const corpo = document.getElementById('prof-alunos-corpo');
    corpo.innerHTML = "";
    banco.forEach(aluno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${aluno.nome}</td><td>${aluno.turma || "S/T"}</td>`;
      const td = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'btn-selecionar'; btn.textContent = 'Acessar Ficha';
      btn.onclick = () => {
          estadoProf.alunoSelecionado = aluno;
          document.getElementById('prof-aluno-selecionado-texto').textContent = `Aluno: ${aluno.nome} (${aluno.ra})`;
          mostrarTela('prof-materia');
      };
      td.appendChild(btn); tr.appendChild(td);
      corpo.appendChild(tr);
    });
  }

  document.getElementById('btn-prof-materia-continuar').addEventListener('click', () => {
      const mat = document.getElementById('prof-materia-select').value;
      if(!mat) { document.getElementById('erro-prof-materia').textContent = "Selecione uma matéria."; return; }
      estadoProf.materiaSelecionada = mat;
      document.getElementById('prof-sub-notas').textContent = `${mat} | ${estadoProf.alunoSelecionado.nome}`;
      
      const notas = estadoProf.alunoSelecionado.materias ? estadoProf.alunoSelecionado.materias[mat] : null;
      ['prof-nota1','prof-nota2','prof-nota3','prof-nota4'].forEach((id, idx) => {
          document.getElementById(id).value = (notas && notas[idx] !== undefined) ? notas[idx] : "";
      });
      document.getElementById('sucesso-prof-notas').classList.add('hidden');
      document.getElementById('erro-prof-notas').textContent = "";
      mostrarTela('prof-notas');
  });

  document.getElementById('btn-salvar-notas-prof').addEventListener('click', () => {
      const ids = ['prof-nota1','prof-nota2','prof-nota3','prof-nota4'];
      const notas = [];
      const erroEl = document.getElementById('erro-prof-notas');
      const sucessoEl = document.getElementById('sucesso-prof-notas');
      erroEl.textContent = ""; sucessoEl.classList.add('hidden');

      for(const id of ids){
          const val = document.getElementById(id).value;
          if(val === ""){ erroEl.textContent = "Preencha todas as 4 notas."; return; }
          const num = parseFloat(val);
          if(isNaN(num) || num < 0 || num > 10){ erroEl.textContent = "Notas devem ser de 0 a 10."; return; }
          notas.push(num);
      }

      let banco = obterBancoUsuarios();
      const idx = banco.findIndex(u => u.ra === estadoProf.alunoSelecionado.ra);
      if(idx >= 0){
          if(!banco[idx].materias) banco[idx].materias = {};
          banco[idx].materias[estadoProf.materiaSelecionada] = notas;
          localStorage.setItem('banco_usuarios', JSON.stringify(banco));
          estadoProf.alunoSelecionado = banco[idx];
          sucessoEl.classList.remove('hidden');
      }
  });

  // FUNÇÕES DE EXPORTAÇÃO EM PDF COM TODAS AS MATÉRIAS VISÍVEIS
  function abrirOpcoesPDFProfessor() {
    const aluno = estadoProf.alunoSelecionado;
    if(!aluno) return;

    document.getElementById('pdf-prof-aluno-nome').textContent = aluno.nome;
    document.getElementById('pdf-preview-nome').textContent = aluno.nome;
    document.getElementById('pdf-preview-ra').textContent = `${aluno.ra}-${aluno.digito || '0'}`;
    document.getElementById('pdf-preview-turma').textContent = aluno.turma || "Sem Turma";

    atualizarPreviewPDF();
    mostrarTela('prof-pdf');
  }

  function atualizarPreviewPDF() {
    const aluno = estadoProf.alunoSelecionado;
    if (!aluno) return;

    const tipo = document.getElementById('select-tipo-pdf').value;
    const tabela = document.getElementById('tabela-pdf-preview');
    let html = "";

    if (tipo === "TODOS") {
      html = `
        <thead>
          <tr>
            <th>Matéria</th>
            <th class="num">1º B</th>
            <th class="num">2º B</th>
            <th class="num">3º B</th>
            <th class="num">4º B</th>
            <th class="num">Média</th>
          </tr>
        </thead>
        <tbody>
      `;

      LISTA_MATERIAS.forEach(mat => {
        const notas = (aluno.materias && aluno.materias[mat]) ? aluno.materias[mat] : [];
        
        const n1 = (notas[0] !== undefined && notas[0] !== null) ? notas[0].toFixed(1) : "N/A";
        const n2 = (notas[1] !== undefined && notas[1] !== null) ? notas[1].toFixed(1) : "N/A";
        const n3 = (notas[2] !== undefined && notas[2] !== null) ? notas[2].toFixed(1) : "N/A";
        const n4 = (notas[3] !== undefined && notas[3] !== null) ? notas[3].toFixed(1) : "N/A";

        const notasValidas = notas.filter(n => n !== undefined && n !== null);
        let media = "N/A";
        if (notasValidas.length > 0) {
          media = (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1);
        }

        html += `
          <tr>
            <td style="font-weight: 500;">${mat}</td>
            <td class="num">${n1}</td>
            <td class="num">${n2}</td>
            <td class="num">${n3}</td>
            <td class="num">${n4}</td>
            <td class="num" style="font-weight:bold;">${media}</td>
          </tr>
        `;
      });

    } else {
      const bimIndex = parseInt(tipo);
      const nomesBimestres = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];

      html = `
        <thead>
          <tr>
            <th>Matéria</th>
            <th class="num">Nota (${nomesBimestres[bimIndex]})</th>
          </tr>
        </thead>
        <tbody>
      `;

      LISTA_MATERIAS.forEach(mat => {
        const notas = (aluno.materias && aluno.materias[mat]) ? aluno.materias[mat] : [];
        const notaBimestre = (notas[bimIndex] !== undefined && notas[bimIndex] !== null) 
          ? notas[bimIndex].toFixed(1) 
          : "N/A";

        html += `
          <tr>
            <td style="font-weight: 500;">${mat}</td>
            <td class="num" style="font-weight:bold;">${notaBimestre}</td>
          </tr>
        `;
      });
    }

    html += `</tbody>`;
    tabela.innerHTML = html;
  }

  function executarDownloadPDF() {
    const elemento = document.getElementById('area-impressao-pdf');
    const aluno = estadoProf.alunoSelecionado;

    // Criar um container temporário fora da tela com largura fixa A4 para evitar cortes de layout/overflow
    const clone = elemento.cloneNode(true);
    clone.style.width = '700px';
    clone.style.padding = '20px';
    clone.style.background = '#ffffff';
    clone.style.color = '#000000';
    clone.style.boxSizing = 'border-box';

    const containerTemp = document.createElement('div');
    containerTemp.style.position = 'absolute';
    containerTemp.style.left = '-9999px';
    containerTemp.style.top = '0';
    containerTemp.style.width = '750px';
    containerTemp.appendChild(clone);
    document.body.appendChild(containerTemp);

    const configuracoes = {
      margin:       [10, 10, 10, 10],
      filename:     `Boletim_${aluno ? aluno.nome.replace(/\s+/g, '_') : 'Aluno'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 800 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(configuracoes).from(clone).save().then(() => {
      document.body.removeChild(containerTemp);
    }).catch(err => {
      console.error(err);
      if(document.body.contains(containerTemp)) document.body.removeChild(containerTemp);
    });
  }

  // ==========================================
  // 4. LÓGICA DO DIRETOR
  // ==========================================
  document.getElementById('btn-login-dir').addEventListener('click', () => {
    const nome = document.getElementById('dir-nome').value.trim();
    const senha = document.getElementById('dir-senha').value;
    const erro = document.getElementById('erro-dir-login');
    erro.textContent = "";

    if(!nome) { erro.textContent = "Digite seu usuário."; return; }
    if(senha !== SENHA_DIRETOR) { erro.textContent = "Senha incorreta."; return; }

    estadoDir.nome = nome;
    document.getElementById('dir-boas-vindas').textContent = `Bem-vindo(a), Diretor(a) ${nome}.`;
    carregarTabelaDiretor("TODAS");
    mostrarTela('dir-turmas');
  });

  document.getElementById('dir-turma-select').addEventListener('change', (e) => {
    carregarTabelaDiretor(e.target.value);
  });

  function carregarTabelaDiretor(turmaFiltro) {
    const banco = obterBancoUsuarios();
    const corpo = document.getElementById('dir-turmas-corpo');
    corpo.innerHTML = "";

    let filtrados = banco;
    if (turmaFiltro !== "TODAS") {
      filtrados = banco.filter(u => (turmaFiltro === "SEM-TURMA" ? !u.turma : u.turma === turmaFiltro));
    }

    if (filtrados.length === 0) {
      corpo.innerHTML = `<tr><td colspan="4" class="vazio-tabela">Nenhum aluno encontrado nesta turma.</td></tr>`;
      return;
    }

    filtrados.forEach(aluno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:var(--pen-blue); font-weight:bold">${aluno.turma || "S/T"}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.ra}</td>
      `;

      const tdAcoes = document.createElement('td');
      tdAcoes.className = 'acoes-cell';

      const btnVer = document.createElement('button');
      btnVer.className = 'btn-selecionar'; btnVer.textContent = 'Boletim';
      btnVer.onclick = () => abrirBoletimDir(aluno);

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn-editar'; btnEdit.textContent = 'Editar';
      btnEdit.onclick = () => abrirEditDir(aluno);

      const btnDel = document.createElement('button');
      btnDel.className = 'btn-excluir'; btnDel.textContent = 'Excluir';
      btnDel.onclick = () => excluirAluno(aluno.ra, aluno.nome);

      tdAcoes.appendChild(btnVer); tdAcoes.appendChild(btnEdit); tdAcoes.appendChild(btnDel);
      tr.appendChild(tdAcoes);
      corpo.appendChild(tr);
    });
  }

  function excluirAluno(ra, nome) {
    if(confirm(`Deseja excluir o aluno ${nome} (RA: ${ra}) do sistema?`)) {
      let banco = obterBancoUsuarios().filter(u => u.ra !== ra);
      localStorage.setItem('banco_usuarios', JSON.stringify(banco));
      carregarTabelaDiretor(document.getElementById('dir-turma-select').value);
    }
  }

  function abrirBoletimDir(aluno) {
    estadoDir.alunoSelecionado = aluno;
    document.getElementById('dir-boletim-nome').textContent = `${aluno.nome} (${aluno.turma || "Sem Turma"})`;
    const corpo = document.getElementById('dir-boletim-corpo');
    corpo.innerHTML = "";
    
    LISTA_MATERIAS.forEach(mat => {
      const notas = (aluno.materias && aluno.materias[mat]) ? aluno.materias[mat] : [];
      const n1 = notas[0] !== undefined ? notas[0].toFixed(1) : "-";
      const n2 = notas[1] !== undefined ? notas[1].toFixed(1) : "-";
      const n3 = notas[2] !== undefined ? notas[2].toFixed(1) : "-";
      const n4 = notas[3] !== undefined ? notas[3].toFixed(1) : "-";

      let media = "-"; let cor = "var(--ink)";
      if(notas.length === 4) {
        const m = notas.reduce((a,b)=>a+b, 0) / 4;
        media = m.toFixed(1);
        cor = m >= 5.0 ? "var(--pen-green)" : "var(--pen-red)";
      }

      corpo.innerHTML += `
        <tr>
          <td>${mat}</td>
          <td class="num">${n1}</td><td class="num">${n2}</td>
          <td class="num">${n3}</td><td class="num">${n4}</td>
          <td class="num" style="font-weight:bold; color:${cor}">${media}</td>
        </tr>`;
    });
    mostrarTela('dir-boletim');
  }

  document.getElementById('btn-salvar-novo-aluno').addEventListener('click', () => {
    const turma = document.getElementById('dir-novo-turma').value;
    const nome = document.getElementById('dir-novo-nome').value.trim();
    const ra = document.getElementById('dir-novo-ra').value.trim();
    const digito = document.getElementById('dir-novo-digito').value.trim();
    const erro = document.getElementById('erro-dir-novo');
    const sucesso = document.getElementById('sucesso-dir-novo');
    erro.textContent = ""; sucesso.classList.add('hidden');

    if(!turma || !nome || !ra || !digito){ erro.textContent = "Preencha todos os campos."; return; }

    let banco = obterBancoUsuarios();
    if(banco.some(u => u.ra === ra)){ erro.textContent = "Já existe aluno com este RA."; return; }

    banco.push({ nome, ra, digito, turma, materias: {} });
    localStorage.setItem('banco_usuarios', JSON.stringify(banco));

    sucesso.textContent = `Aluno ${nome} cadastrado!`;
    sucesso.classList.remove('hidden');
    document.getElementById('dir-novo-nome').value = "";
    document.getElementById('dir-novo-ra').value = "";
    document.getElementById('dir-novo-digito').value = "";
  });

  function abrirEditDir(aluno) {
    estadoDir.alunoSelecionado = aluno;
    document.getElementById('dir-edit-turma-texto').textContent = `Turma: ${aluno.turma || "Sem Turma"}`;
    document.getElementById('dir-edit-nome').value = aluno.nome;
    document.getElementById('dir-edit-ra').value = aluno.ra;
    document.getElementById('dir-edit-digito').value = aluno.digito;
    document.getElementById('erro-dir-edit').textContent = "";
    document.getElementById('sucesso-dir-edit').classList.add('hidden');
    mostrarTela('dir-edit-aluno');
  }

  document.getElementById('btn-salvar-edit-aluno').addEventListener('click', () => {
    const nome = document.getElementById('dir-edit-nome').value.trim();
    const ra = document.getElementById('dir-edit-ra').value.trim();
    const digito = document.getElementById('dir-edit-digito').value.trim();
    const erro = document.getElementById('erro-dir-edit');

    if(!nome || !ra || !digito){ erro.textContent = "Preencha todos os campos."; return; }

    let banco = obterBancoUsuarios();
    const idx = banco.findIndex(u => u.ra === estadoDir.alunoSelecionado.ra);
    if(idx >= 0) {
      banco[idx].nome = nome;
      banco[idx].ra = ra;
      banco[idx].digito = digito;
      localStorage.setItem('banco_usuarios', JSON.stringify(banco));
      document.getElementById('sucesso-dir-edit').textContent = "Dados atualizados!";
      document.getElementById('sucesso-dir-edit').classList.remove('hidden');
    }
  });


/* ===== KANBAN INTERATIVO ===== */
const KB = (() => {
  const KEY='conect_escola_kanban_v1';
  let editId=null, filter='all', draggedId=null;
  const seed=[
    {id:crypto.randomUUID(),title:'Revisar conteúdo da próxima prova',desc:'Separe 30 minutos para revisar os pontos principais.',status:'todo',priority:'high',tag:'Estudos',due:''},
    {id:crypto.randomUUID(),title:'Fazer atividade de matemática',desc:'Resolver os exercícios pendentes.',status:'doing',priority:'medium',tag:'Matemática',due:''},
    {id:crypto.randomUUID(),title:'Entregar trabalho',desc:'Trabalho finalizado e pronto para entrega.',status:'done',priority:'low',tag:'Projeto',due:''}
  ];
  function get(){try{return JSON.parse(localStorage.getItem(KEY))||seed}catch(e){return seed}}
  function saveAll(a){localStorage.setItem(KEY,JSON.stringify(a))}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function priorityLabel(p){return p==='high'?'🔥 Alta':p==='low'?'Baixa':'Média'}
  function matches(c){
    const q=document.getElementById('kb-search').value.trim().toLowerCase();
    if(q && !(`${c.title} ${c.desc} ${c.tag}`.toLowerCase().includes(q))) return false;
    if(filter==='today' && c.due!==new Date().toISOString().slice(0,10)) return false;
    if(filter==='high' && c.priority!=='high') return false;
    return true;
  }
  function card(c){
    const el=document.createElement('article'); el.className='kb-card'; el.draggable=true; el.dataset.id=c.id;
    const due=c.due?new Date(c.due+'T00:00:00').toLocaleDateString('pt-BR'):'';
    const border=c.priority==='high'?'#a8352a':c.priority==='medium'?'#cf9f4f':'#2e6b4f';
    el.style.borderLeftColor=border;
    el.innerHTML=`<div class="kb-card-title">${esc(c.title)}</div>
      ${c.desc?`<div class="kb-card-desc">${esc(c.desc)}</div>`:''}
      <div class="kb-meta"><span class="kb-tag">${esc(c.tag||'Geral')}</span><span class="kb-tag">${priorityLabel(c.priority)}</span>${due?`<span class="kb-date">📅 ${due}</span>`:''}</div>
      <div class="kb-card-actions"><button class="kb-icon" data-action="edit">✏️ Editar</button><button class="kb-icon" data-action="delete">🗑️</button></div>`;
    el.addEventListener('dragstart',e=>{draggedId=c.id;el.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',c.id)});
    el.addEventListener('dragend',()=>{draggedId=null;el.classList.remove('dragging');document.querySelectorAll('.kb-dropzone').forEach(x=>x.classList.remove('drag-over'))});
    el.addEventListener('click',e=>{const a=e.target.closest('[data-action]');if(!a)return;e.stopPropagation();if(a.dataset.action==='edit')edit(c.id);else remove(c.id)});
    return el;
  }
  function render(){
    const data=get();
    document.querySelectorAll('.kb-dropzone').forEach(z=>z.innerHTML='');
    const counts={todo:0,doing:0,done:0};
    data.forEach(c=>{counts[c.status]++;if(matches(c)){document.querySelector(`[data-status="${c.status}"]`).appendChild(card(c))}});
    Object.entries(counts).forEach(([k,v])=>document.getElementById('kb-count-'+k).textContent=v);
    document.getElementById('kb-stats').textContent=`${data.length} tarefa${data.length!==1?'s':''} • ${counts.done} concluída${counts.done!==1?'s':''}`;
  }
  function open(){document.getElementById('kanban-overlay').classList.add('open');document.getElementById('kanban-overlay').setAttribute('aria-hidden','false');render()}
  function close(){document.getElementById('kanban-overlay').classList.remove('open');document.getElementById('kanban-overlay').setAttribute('aria-hidden','true');closeModal()}
  function newCard(){editId=null;document.getElementById('kb-modal-title').textContent='Nova tarefa';['kb-title','kb-desc','kb-tag','kb-due'].forEach(id=>document.getElementById(id).value='');document.getElementById('kb-status').value='todo';document.getElementById('kb-priority').value='medium';document.getElementById('kb-modal').classList.add('open');setTimeout(()=>document.getElementById('kb-title').focus(),50)}
  function edit(id){const c=get().find(x=>x.id===id);if(!c)return;editId=id;document.getElementById('kb-modal-title').textContent='Editar tarefa';document.getElementById('kb-title').value=c.title;document.getElementById('kb-desc').value=c.desc||'';document.getElementById('kb-status').value=c.status;document.getElementById('kb-priority').value=c.priority||'medium';document.getElementById('kb-tag').value=c.tag||'';document.getElementById('kb-due').value=c.due||'';document.getElementById('kb-modal').classList.add('open')}
  function closeModal(){document.getElementById('kb-modal').classList.remove('open')}
  function save(e){e.preventDefault();const a=get();const obj={id:editId||crypto.randomUUID(),title:document.getElementById('kb-title').value.trim(),desc:document.getElementById('kb-desc').value.trim(),status:document.getElementById('kb-status').value,priority:document.getElementById('kb-priority').value,tag:document.getElementById('kb-tag').value.trim()||'Geral',due:document.getElementById('kb-due').value};const i=a.findIndex(x=>x.id===editId);if(i>=0)a[i]=obj;else a.unshift(obj);saveAll(a);closeModal();render()}
  function remove(id){const c=get().find(x=>x.id===id);if(c&&confirm(`Excluir "${c.title}"?`)){saveAll(get().filter(x=>x.id!==id));render()}}
  function setFilter(f){filter=f;render()}
  function clearDone(){if(confirm('Excluir todas as tarefas concluídas?')){saveAll(get().filter(c=>c.status!=='done'));render()}}
  document.querySelectorAll('.kb-dropzone').forEach(z=>{
    z.addEventListener('dragover',e=>{e.preventDefault();z.classList.add('drag-over')});
    z.addEventListener('dragleave',()=>z.classList.remove('drag-over'));
    z.addEventListener('drop',e=>{e.preventDefault();z.classList.remove('drag-over');const id=e.dataTransfer.getData('text/plain')||draggedId;const a=get();const c=a.find(x=>x.id===id);if(c){c.status=z.dataset.status;saveAll(a);render()}});
  });
  document.getElementById('kanban-overlay').addEventListener('click',e=>{if(e.target.id==='kanban-overlay')close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  return {open,close,newCard,edit,save,closeModal,render,setFilter,clearDone};
})();
