class Router {
  activehash = "";

  handleRouteChange() {
    window.addEventListener("hashchange", (e) => {
       this.activehash = e.newURL.
    });
  }
}

export default new Router();
