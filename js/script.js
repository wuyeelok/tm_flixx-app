const global = {
  currentPage: window.location.pathname,
};

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
  const currentHTMLPage = getCurrentPageHTMLFilePath();

  let targetLinkText = "";

  switch (currentHTMLPage) {
    case "/":
    case "index.html":
      console.log("home");
      break;
    case "movie-details.html":
      console.log("Movie Details");
      break;
    case "search.html":
      console.log("Search");
      break;
    case "shows.html":
      targetLinkText = "TV Shows";
      console.log("Shows");
      break;
    case "tv-details.html":
      console.log("TV Details");
      break;
    default:
      targetLinkText = "Movies";
      console.log("Unkown Page");
  }

  highlightActiveLink(targetLinkText);
}

document.addEventListener("DOMContentLoaded", init);
