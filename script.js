// Sua chave de API do TMDB
const API_KEY = 'ad35b0fff0222493d5bf26f453058cf9';

// Captura os elementos da página HTML
const searchInput = document.getElementById('searchInput');     // Campo de texto
const searchBtn = document.getElementById('searchBtn');         // Botão de busca
const moviesContainer = document.getElementById('moviesContainer'); // Onde os filmes serão exibidos

// Adiciona evento ao botão de busca
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim(); // Pega o texto digitado, removendo espaços

  if (query) {
    searchMovies(query); // Se houver algo digitado, busca os filmes
  }
});

// Função que busca filmes na API da TMDB com base no texto digitado
async function searchMovies(query) {
  // Monta a URL da API com a chave, o idioma e o termo de busca
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);     // Faz a requisição HTTP
    const data = await response.json();    // Converte a resposta para JSON

    displayMovies(data.results);           // Envia os dados para a função que exibe na tela
  } catch (error) {
    console.error('Erro ao buscar filmes:', error); // Exibe erro no console
  }
}

// Função que mostra os filmes encontrados na tela
function displayMovies(movies) {
  moviesContainer.innerHTML = ''; // Limpa os resultados anteriores

  // Se nenhum filme for encontrado
  if (movies.length === 0) {
    moviesContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
    return;
  }

  // Para cada filme encontrado na resposta da API
  movies.forEach(movie => {
    // Cria uma nova div para o card do filme
    const div = document.createElement('div');
    div.classList.add('movie'); // Adiciona classe CSS

    // Monta o caminho da imagem (ou usa imagem genérica se não tiver)
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : 'https://via.placeholder.com/200x300?text=Sem+Imagem';

    // Define o conteúdo do card do filme
    div.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.release_date ? movie.release_date.substring(0, 4) : 'Ano desconhecido'}</p>
        <p>${movie.overview ? movie.overview.substring(0, 100) + '...' : 'Sem descrição.'}</p>
      </div>
    `;
    
    // Adiciona evento de clique para abrir o modal com mais detalhes
    div.addEventListener('click', () => {
      openModal(movie);
    });

    // Adiciona o card na página
    moviesContainer.appendChild(div);
  });

}

// Seleciona os elementos do modal
const modal = document.getElementById('movieModal');
const closeModalBtn = document.getElementById('closeModal');
const modalPoster = document.getElementById('modalPoster');
const modalTitle = document.getElementById('modalTitle');
const modalReleaseDate = document.getElementById('modalReleaseDate');
const modalRating = document.getElementById('modalRating');
const modalOverview = document.getElementById('modalOverview');

// Fecha o modal ao clicar no "X"
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Função para abrir o modal com os detalhes do filme
function openModal(movie) {
  // Define a imagem do pôster
  modalPoster.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

  // Define os demais campos
  modalTitle.textContent = movie.title;
  modalReleaseDate.textContent = movie.release_date || 'Desconhecido';
  modalRating.textContent = movie.vote_average || 'N/A';
  modalOverview.textContent = movie.overview || 'Sem descrição.';

  // Exibe o modal
  modal.classList.remove('hidden');
}
