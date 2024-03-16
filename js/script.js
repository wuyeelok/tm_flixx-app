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
      break;
    case "movie-details.html":
      console.log("Movie Details");
      break;
    case "search.html":
      console.log("Search");
      break;
    case "shows.html":
      console.log("Shows");
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
