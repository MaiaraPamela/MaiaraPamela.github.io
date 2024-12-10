// Variável para armazenar as histórias
let historias = JSON.parse(localStorage.getItem('historias')) || [];

// Variável para contar capítulos
let chapterCount = 1;

/**
 * Adiciona um novo capítulo à página de criação/edição
 */
function addChapter() {
  chapterCount++;
  const newChapter = `
    <div class="chapter-container" id="chapter-${chapterCount}">
      <label for="capitulo-titulo-${chapterCount}">Título do Capítulo ${chapterCount}</label>
      <input type="text" class="form-control" id="capitulo-titulo-${chapterCount}" placeholder="Digite o título do capítulo ${chapterCount}" required>
      <label for="capitulo-${chapterCount}">Conteúdo do Capítulo ${chapterCount}</label>
      <textarea class="form-control" id="capitulo-${chapterCount}" rows="4" placeholder="Escreva o capítulo ${chapterCount}" required></textarea>
      <button type="button" class="btn btn-danger" onclick="removeChapter(${chapterCount})" title="Apagar este capítulo">Apagar Capítulo</button>
    </div>
  `;
  document.getElementById('capitulos-section').insertAdjacentHTML('beforeend', newChapter);
}

/**
 * Remove um capítulo específico
 * @param {number} chapterNumber Número do capítulo a ser removido
 */
function removeChapter(chapterNumber) {
  const chapterElement = document.getElementById(`chapter-${chapterNumber}`);
  if (chapterElement) {
    chapterElement.remove();
    chapterCount--;
  }
}

/**
 * Salva uma nova história no localStorage
 * @param {Event} event Evento de submissão do formulário
 */
function salvarNovaHistoria(event) {
  event.preventDefault();

  const historia = {
    id: Date.now(), // Gera um ID único baseado no timestamp
    capa: document.getElementById('capa').value,
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    capitulos: [],
    tags: document.getElementById('tags').value.split(','),
  };

  for (let i = 1; i <= chapterCount; i++) {
    const tituloCapitulo = document.getElementById(`capitulo-titulo-${i}`).value;
    const conteudoCapitulo = document.getElementById(`capitulo-${i}`).value;

    historia.capitulos.push({ titulo: tituloCapitulo, conteudo: conteudoCapitulo });
  }

  historias.push(historia);
  localStorage.setItem('historias', JSON.stringify(historias));
  alert('História publicada com sucesso!');
  window.location.href = 'minhasobras.html';
}

/**
 * Carrega as histórias armazenadas no localStorage
 */
function carregarHistoriasDoStorage() {
  const data = localStorage.getItem('historias');
  historias = data ? JSON.parse(data) : [];
}

/**
 * Exibe as histórias na página de "Minhas Obras"
 */
function exibirHistorias() {
  const lista = document.getElementById('lista-historias');
  lista.innerHTML = '';

  if (historias.length === 0) {
    lista.innerHTML = '<p>Você ainda não tem histórias criadas.</p>';
    return;
  }

  historias.forEach((historia) => {
    const card = document.createElement('div');
    card.className = 'story-card';

    card.innerHTML = `
      <h4>Título: ${historia.titulo}</h4>
      <p class="story-status">Status: ${historia.capitulos.length > 0 ? 'Publicada' : 'Rascunho'}</p>
      <p>${historia.descricao}</p>
      <button class="btn btn-edit" onclick="verHistoria(${historia.id})">Ir à história</button>
      <button class="btn btn-edit" onclick="editarHistoria(${historia.id})">Editar</button>
      <button class="btn btn-delete btn-secondary" onclick="excluirHistoria(${historia.id})">Excluir</button>
    `;

    lista.appendChild(card);
  });
}

/**
 * Redireciona para a página de visualização de uma história
 * @param {number} id ID da história a ser visualizada
 */
function verHistoria(id) {
  const historiaSelecionada = historias.find((historia) => historia.id === id);
  if (historiaSelecionada) {
    localStorage.setItem('historiaAtual', JSON.stringify(historiaSelecionada));
    window.location.href = 'ver_historia.html';
  } else {
    alert('História não encontrada!');
  }
}

/**
 * Redireciona para a página de edição de uma história
 * @param {number} id ID da história a ser editada
 */
function editarHistoria(id) {
  const historiaSelecionada = historias.find((historia) => historia.id === id);
  if (historiaSelecionada) {
    localStorage.setItem('historiaEditada', JSON.stringify(historiaSelecionada));
    window.location.href = 'editar_historia.html';
  } else {
    alert('História não encontrada!');
  }
}

/**
 * Exclui uma história pelo ID
 * @param {number} id ID da história a ser excluída
 */
function excluirHistoria(id) {
  if (confirm('Tem certeza de que deseja excluir esta história?')) {
    historias = historias.filter((historia) => historia.id !== id);
    localStorage.setItem('historias', JSON.stringify(historias));
    alert('História excluída com sucesso!');
    exibirHistorias(); // Atualiza a lista na página
  }
}

/**
 * Carrega os detalhes de uma história para a visualização
 */
function carregarHistoriaAtual() {
  const historia = JSON.parse(localStorage.getItem('historiaAtual'));

  if (historia) {
    document.getElementById('titulo').textContent = `Título: ${historia.titulo}`;
    document.getElementById('descricao').textContent = historia.descricao;

    const capitulosContainer = document.getElementById('capitulos');
    historia.capitulos.forEach((capitulo, index) => {
      const chapterDiv = document.createElement('div');
      chapterDiv.className = 'chapter';
      chapterDiv.innerHTML = `
        <h4>Capítulo ${index + 1}: ${capitulo.titulo}</h4>
        <p>${capitulo.conteudo}</p>
      `;
      capitulosContainer.appendChild(chapterDiv);
    });
  } else {
    document.querySelector('.container').innerHTML = '<p>História não encontrada.</p>';
  }
}
