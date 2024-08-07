class Router {
  activehash = "";

  handleRouteChange() {
    window.addEventListener("hashchange", (e) => {
      this.activehash = e.newURL.split("#")[1];

      
    });
  }
}

export default new Router();
