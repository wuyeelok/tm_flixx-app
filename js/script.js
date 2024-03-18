// import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import Swiper from "../lib/swiper-bundle.min.mjs";

const global = {
  currentPage: getCurrentPageHTMLFilePath(),
  API_KEY: "7afb6867335b56cd49dfc5b14c686f20",
  API_URL: "https://api.themoviedb.org/3/",
  API_POSTER_URL: "https://image.tmdb.org/t/p/w500",
  API_BACKDROP_URL: "https://image.tmdb.org/t/p/original",
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  for (let i = 0; i < results.length; i++) {
    const movie = results[i];

    const releaseDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(movie.release_date));

    const cardDivEle = document.createElement("div");
    cardDivEle.classList.add("card");

    let imageSrc = "images/no-image.jpg";

    if (movie.poster_path) {
      imageSrc = `${global.API_POSTER_URL}${movie.poster_path}`;
    }

    cardDivEle.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      <img
        src="${imageSrc}"
        class="card-img-top"
        alt="${movie.title}"
      />
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${releaseDate}</small>
      </p>
    </div>
  `;

    document.getElementById("popular-movies").appendChild(cardDivEle);
  }
}

async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const cardDivEle = document.createElement("div");
    cardDivEle.classList.add("card");

    let imageSrc = "images/no-image.jpg";
    if (show.poster_path) {
      imageSrc = `${global.API_POSTER_URL}${show.poster_path}`;
    }

    const firstAirDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(show.first_air_date));

    cardDivEle.innerHTML = `<a href="tv-details.html?id=${show.id}">
    <img
      src="${imageSrc}"
      class="card-img-top"
      alt="${show.name}"
    />
  </a>
  <div class="card-body">
    <h5 class="card-title">${show.name}</h5>
    <p class="card-text">
      <small class="text-muted">Aired: ${firstAirDate}</small>
    </p>
  </div>`;

    document.getElementById("popular-shows").appendChild(cardDivEle);
  });
}

async function displayMovieDetails() {
  const urlParamObj = new URLSearchParams(window.location.search);
  const movieId = urlParamObj.get("id");

  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  if (movie.backdrop_path) {
    displayBackgroundImage("movie", movie.backdrop_path);
  }

  let imageSrc = "images/no-image.jpg";
  if (movie.poster_path) {
    imageSrc = `${global.API_POSTER_URL}${movie.poster_path}`;
  }

  const releaseDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(movie.release_date));

  const genres = movie.genres.map((genre) => `<li>${genre.name}</li>`).join("");

  let homepageURL = "#";
  if (movie.homepage) {
    homepageURL = movie.homepage;
  }

  const movieDetailsTopEle = document.createElement("div");
  movieDetailsTopEle.classList.add("details-top");
  movieDetailsTopEle.innerHTML = `<div>
  <img
    src="${imageSrc}"
    class="card-img-top"
    alt="${movie.title}"
  />
</div>
<div>
  <h2>${movie.title}</h2>
  <p>
    <i class="fas fa-star text-primary"></i>
    ${movie.vote_average.toFixed(1)} / 10
  </p>
  <p class="text-muted">Release Date: ${releaseDate}</p>
  <p>${movie.overview}</p>
  <h5>Genres</h5>
  <ul class="list-group">
    ${genres}
  </ul>
  <a href="${homepageURL}" target="_blank" class="btn">Visit Movie Homepage</a>
</div>`;
  document.getElementById("movie-details").appendChild(movieDetailsTopEle);

  const prodCompaniesNames = movie.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ");

  const movieDetailsBottomEle = document.createElement("div");
  movieDetailsBottomEle.classList.add("details-bottom");
  movieDetailsBottomEle.innerHTML = `<h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${prodCompaniesNames}</div>`;
  document.getElementById("movie-details").appendChild(movieDetailsBottomEle);
}

async function displayShowDetails() {
  const urlParamObj = new URLSearchParams(window.location.search);
  const showId = urlParamObj.get("id");

  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  if (show.backdrop_path) {
    displayBackgroundImage("tv", show.backdrop_path);
  }

  let imageSrc = "images/no-image.jpg";
  if (show.poster_path) {
    imageSrc = `${global.API_POSTER_URL}${show.poster_path}`;
  }

  const lastAirDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(show.last_air_date));

  const genres = show.genres.map((genre) => `<li>${genre.name}</li>`).join("");

  let homepageURL = "#";
  if (show.homepage) {
    homepageURL = show.homepage;
  }

  const showDetailsTopEle = document.createElement("div");
  showDetailsTopEle.classList.add("details-top");
  showDetailsTopEle.innerHTML = `<div>
  <img
    src="${imageSrc}"
    class="card-img-top"
    alt="${show.name}"
  />
</div>
<div>
  <h2>${show.name}</h2>
  <p>
    <i class="fas fa-star text-primary"></i>
    ${show.vote_average.toFixed(1)} / 10
  </p>
  <p class="text-muted">Last Air Date: ${lastAirDate}</p>
  <p>${show.overview}</p>
  <h5>Genres</h5>
  <ul class="list-group">${genres}</ul>
  <a href="${homepageURL}" target="_blank" class="btn">Visit Show Homepage</a>
</div>`;
  document.getElementById("show-details").appendChild(showDetailsTopEle);

  const prodCompaniesNames = show.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ");

  const showDetailsBottomEle = document.createElement("div");
  showDetailsBottomEle.classList.add("details-bottom");
  showDetailsBottomEle.innerHTML = `<h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
    </li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${prodCompaniesNames}</div>`;
  document.getElementById("show-details").appendChild(showDetailsBottomEle);
}

function displayBackgroundImage(type, backdroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(${global.API_BACKDROP_URL}${backdroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.2";

  if (type === "movie") {
    document.getElementById("movie-details").appendChild(overlayDiv);
  } else if (type === "tv") {
    document.getElementById("show-details").appendChild(overlayDiv);
  }
}

function displaySearchResults(data) {
  data.results.forEach((searchResult) => {
    const div = document.createElement("div");
    div.classList.add("card");

    let detailsHref = "";
    let releaseDate = "";
    let title = "";
    if (global.search.type === "movie") {
      detailsHref = `./movie-details.html?id=${searchResult.id}`;
      releaseDate = new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(searchResult.release_date));
      title = searchResult.title;
    } else if (global.search.type === "tv") {
      detailsHref = `./tv-details.html?id=${searchResult.id}`;
      releaseDate = new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(searchResult.first_air_date));
      title = searchResult.name;
    }

    const imageSrc = searchResult.poster_path
      ? `${global.API_POSTER_URL}${searchResult.poster_path}`
      : "images/no-image.jpg";

    div.innerHTML = `
    <a href="${detailsHref}">
      <img src="${imageSrc}" class="card-img-top" alt="${title}" />
    </a>
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${releaseDate}</small>
      </p>
    </div>
    `;

    document.getElementById("search-results").appendChild(div);
  });
}

async function search() {
  const urlParams = new URLSearchParams(window.location.search);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (urlParams.get("type") === "movie") {
    document.getElementById("movie").checked = true;
  } else if (urlParams.get("type") === "tv") {
    document.getElementById("tv").checked = true;
  }

  if (global.search.term !== "" && global.search.term !== null) {
    const data = await searchAPIData();
    console.log(data);
    if (data.total_results > 0) {
      global.search.page = data.page;
      global.search.totalPages = data.total_results;
      displaySearchResults(data);
    } else {
      showAlert("No search result, please try other search.");
    }
  } else {
    showAlert("Please enter a search!");
  }
}

async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  for (const movie of results) {
    const slideEle = document.createElement("div");
    slideEle.classList.add("swiper-slide");

    const imageSrc = movie.poster_path
      ? `${global.API_POSTER_URL}${movie.poster_path}`
      : "./images/no-image.jpg";

    slideEle.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="${imageSrc}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
    `;
    document.querySelector(".swiper-wrapper").appendChild(slideEle);
  }

  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      deplay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Get data from TMDB API
async function fetchAPIData(endpoint) {
  showSpinner();

  const response = await fetch(
    `${global.API_URL}${endpoint}?api_key=${global.API_KEY}&language=en-US`
  );

  try {
    if (!response.ok || response.status !== 200) {
      throw new Error("Something is wrong");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    hideSpinner();
  }
}

async function searchAPIData() {
  showSpinner();

  let type = "movie";
  if (global.search.type) {
    type = global.search.type;
  }

  const response = await fetch(
    `${global.API_URL}search/${type}?language=en-US&api_key=${global.API_KEY}&query=${global.search.term}`
  );
  try {
    if (!response.ok) {
      throw new Error("Can not get search result");
    }
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.add("show");
}

function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.remove("show");
}

function getCurrentPageHTMLFilePath() {
  const fullPathname = window.location.pathname;
  const lastSlashIndex = fullPathname.lastIndexOf("/");

  if (fullPathname.length === lastSlashIndex + 1) {
    return "/";
  } else {
    const currentPath = window.location.pathname.slice(lastSlashIndex + 1);
    return currentPath;
  }
}

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");

  for (const link of links) {
    const href = link.getAttribute("href");

    let hrefHTML;

    const lastSlashIndex = href.lastIndexOf("/");
    if (lastSlashIndex === -1) {
      hrefHTML = href;
    } else if (href.length === lastSlashIndex + 1) {
      hrefHTML = "/";
    } else {
      hrefHTML = href.slice(lastSlashIndex + 1);
    }

    if (
      hrefHTML === getCurrentPageHTMLFilePath() ||
      (hrefHTML === "/" && getCurrentPageHTMLFilePath() === "index.html") ||
      (hrefHTML === "index.html" && getCurrentPageHTMLFilePath() === "/")
    ) {
      link.classList.add("active");
      break;
    }
  }
}

function showAlert(message, className) {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.innerText = message;

  const alertDiv = document.getElementById("alert");
  alertDiv.appendChild(alertEl);
  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function addCommasToNumber(number) {
  return number.toLocaleString("en-US");
}

function init() {
  const currentHTMLPage = getCurrentPageHTMLFilePath();

  switch (currentHTMLPage) {
    case "/":
    case "index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "movie-details.html":
      displayMovieDetails();
      break;
    case "search.html":
      search();
      break;
    case "shows.html":
      displayPopularShows();
      break;
    case "tv-details.html":
      displayShowDetails();
      break;
    default:
      console.log("Unkown Page");
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
