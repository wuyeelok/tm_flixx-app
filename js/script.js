const global = {
  currentPage: window.location.pathname,
};

function init() {
  switch (true) {
    case global.currentPage.includes("movie-details.html"):
      console.log("Movie Details");
      break;
    case global.currentPage.includes("search.html"):
      console.log("Search");
      break;
    case global.currentPage.includes("shows.html"):
      console.log("Shows");
      break;
    case global.currentPage.includes("tv-details.html"):
      console.log("TV Details");
      break;
    default:
      console.log("Home");
  }
}

document.addEventListener("DOMContentLoaded", init);
