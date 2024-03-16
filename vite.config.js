import htmlPurge from "vite-plugin-purgecss";
import { resolve } from "path";

export default {
  base: "/tm_flixx-app/",
  plugins: [htmlPurge()],
  build: {
    rollupOptions: {
      input: {
        404: resolve(__dirname, "404.html"),
        index: resolve(__dirname, "index.html"),
        movie_details: resolve(__dirname, "movie-details.html"),
        search: resolve(__dirname, "search.html"),
        shows: resolve(__dirname, "shows.html"),
        tv_details: resolve(__dirname, "tv-details.html"),
      },
    },
  },
};
