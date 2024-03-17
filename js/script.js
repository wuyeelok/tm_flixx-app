const global = {
  currentPage: getCurrentPageHTMLFilePath(),
  API_KEY: "7afb6867335b56cd49dfc5b14c686f20",
  API_URL: "https://api.themoviedb.org/3/",
  API_POSTER_URL: "https://image.tmdb.org/t/p/w500",
  API_BACKDROP_URL: "https://image.tmdb.org/t/p/original",
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

function addCommasToNumber(number) {
  return number.toLocaleString("en-US");
}

function init() {
  const currentHTMLPage = getCurrentPageHTMLFilePath();

  switch (currentHTMLPage) {
    case "/":
    case "index.html":
      displayPopularMovies();
      break;
    case "movie-details.html":
      displayMovieDetails();
      break;
    case "search.html":
      console.log("Search");
      break;
    case "shows.html":
      displayPopularShows();
      break;
    case "tv-details.html":
      console.log("TV Details");
      break;
    default:
      console.log("Unkown Page");
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
