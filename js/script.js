const global = {
  currentPage: getCurrentPageHTMLFilePath(),
  API_KEY: "7afb6867335b56cd49dfc5b14c686f20",
  API_URL: "https://api.themoviedb.org/3/",
  API_POSTER_URL: "https://image.tmdb.org/t/p/w500/",
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
      alt="${show.original_name}"
    />
  </a>
  <div class="card-body">
    <h5 class="card-title">${show.original_name}</h5>
    <p class="card-text">
      <small class="text-muted">Aired: ${firstAirDate}</small>
    </p>
  </div>`;

    document.getElementById("popular-shows").appendChild(cardDivEle);
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

function init() {
  const currentHTMLPage = getCurrentPageHTMLFilePath();

  switch (currentHTMLPage) {
    case "/":
    case "index.html":
      console.log("home");
      displayPopularMovies();
      break;
    case "movie-details.html":
      console.log("Movie Details");
      break;
    case "search.html":
      console.log("Search");
      break;
    case "shows.html":
      console.log("Shows");
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
