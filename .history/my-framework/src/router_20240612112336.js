class Router {
  activehash = "";

  handleRouteChange(f) {
    window.addEventListener("hashchange", (e) => {
      const hash = e.newURL.split("#")[1];
      f()

    });
  }
}

export default new Router();
