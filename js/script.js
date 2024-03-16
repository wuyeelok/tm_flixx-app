const global = {
  currentPage: window.location.pathname,
};

function highlightActiveLink(text) {
  const links = document.querySelectorAll(".nav-link");

  for (const link of links) {
    if (text === link.innerText) {
      link.classList.add("active");
      break;
    }
  }
}

function init() {
  let targetLinkText = "";

  switch (true) {
    case global.currentPage.includes("movie-details.html"):
      console.log("Movie Details");
      break;
    case global.currentPage.includes("search.html"):
      console.log("Search");
      break;
    case global.currentPage.includes("shows.html"):
      targetLinkText = "TV Shows";
      console.log("Shows");
      break;
    case global.currentPage.includes("tv-details.html"):
      console.log("TV Details");
      break;
    default:
      targetLinkText = "Movies";
      console.log("Home");
  }

  highlightActiveLink(targetLinkText);
}

document.addEventListener("DOMContentLoaded", init);
