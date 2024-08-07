class Router {
  activehash = "";

  handleRouteChange() {
    window.addEventListener("hashchange", (e) => {
       this.activehash = e.n
    });
  }
}

export default new Router();
