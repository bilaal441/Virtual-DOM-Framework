class Router {
  activehash = "";

  handleRouteChange(f) {
    window.addEventListener("hashchange", (e) => {
      this.activehash = e.newURL.split("#")[1];
      f

    });
  }
}

export default new Router();
