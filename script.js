// Sua chave de API do TMDB
const API_KEY = 'ad35b0fff0222493d5bf26f453058cf9';

// Captura os elementos da página HTML
const searchInput = document.getElementById('searchInput');     // Campo de texto
const searchBtn = document.getElementById('searchBtn');         // Botão de busca
// Botão favoritos
const toggleFavoritesBtn = document.getElementById('toggleFavoritesBtn');
let showOnlyFavorites = false;
const moviesContainer = document.getElementById('moviesContainer'); // Onde os filmes serão exibidos
let lastSearchQuery = ''; //Para salvar a busca

// Adiciona evento ao botão de busca
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim(); // Pega o texto digitado, removendo espaços

  if (query) {
    lastSearchQuery = query;
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

  //Botão favoritos
  if (showOnlyFavorites) {
    const favorites = getFavorites();
    movies = movies.filter(movie => favorites.includes(movie.id));
  }

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
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : 'https://via.placeholder.com/200x300?text=Sem+Imagem';

    // Define o conteúdo do card do filme
    // HTML do card do filme
    div.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.release_date ? movie.release_date.substring(0, 4) : 'Ano desconhecido'}</p>
        <p>${movie.overview ? movie.overview.substring(0, 100) + '...' : 'Sem descrição.'}</p>
        <button class="favorite-btn" data-id="${movie.id}">
          <svg class="icon-heart" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6c-1.6-1.5-4.2-1.4-5.8.1L12 7.7 9 4.7C7.4 3.2 4.8 3.1 3.2 4.6c-1.6 1.5-1.7 4.1-.1 5.7l3.5 3.6L12 21l5.4-7.1 3.5-3.6c1.5-1.5 1.5-4.1-.1-5.7z"></path>
          </svg>
        </button>
      </div>
    `;

    // Adiciona evento de clique para abrir o modal com mais detalhes
    div.addEventListener('click', () => {
      openModal(movie);
    });

    // Evento: favorito
    const favoriteBtn = div.querySelector('.favorite-btn');
    if (isFavorited(movie.id)) {
      favoriteBtn.classList.add('favorited');
    }

    favoriteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Não abre o modal ao clicar no coração
      let favorites = getFavorites();

      if (favorites.includes(movie.id)) {
        favorites = favorites.filter(id => id !== movie.id);
        favoriteBtn.classList.remove('favorited');
      } else {
        favorites.push(movie.id);
        favoriteBtn.classList.add('favorited', 'animate');
        // Remove a animação após a execução para permitir nova animação no futuro
        setTimeout(() => {
        favoriteBtn.classList.remove('animate');
        }, 400); // tempo igual à duração da animação
      }

      saveFavorites(favorites);
    });

    // Adiciona o card na página
    moviesContainer.appendChild(div);
  });

}

// Recupera os favoritos do localStorage
function getFavorites() {
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
}

// Salva os favoritos no localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Verifica se o filme está entre os favoritos
function isFavorited(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
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

toggleFavoritesBtn.addEventListener('click', () => {
  showOnlyFavorites = !showOnlyFavorites;

  // Atualiza texto do botão
  toggleFavoritesBtn.textContent = showOnlyFavorites
    ? 'Voltar'
    : 'Favoritos';

  // Rebusca os filmes com base no termo atual
  const query = searchInput.value.trim();
  
  if (showOnlyFavorites) {
  fetchFavoriteMovies(); // mostra todos os favoritos
  } else if (lastSearchQuery) {
  searchInput.value = lastSearchQuery;
  searchMovies(lastSearchQuery);
  } else {
  moviesContainer.innerHTML = '<p>Digite algo na busca para ver filmes.</p>';
  }
});

async function fetchFavoriteMovies() {
  const favorites = getFavorites();

  // Busca os detalhes de cada filme pelo ID
  const moviePromises = favorites.map(id => 
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`)
      .then(res => res.json())
  );

  try {
    const movies = await Promise.all(moviePromises);
    displayMovies(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes favoritos:', error);
  }
}

