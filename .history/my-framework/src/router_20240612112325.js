class Router {
  activehash = "";

  handleRouteChange(f) {
    window.addEventListener("hashchange", (e) => {
       e.newURL.split("#")[1];
      f()

    });
  }
}

export default new Router();
