class Router {
  constructor() {
    this.activehash = "";
  }

  handleRouteChange(callback) {
    window.addEventListener("hashchange", (e) => {
      const hash = e.newURL.split("#")[1];
      callback(hash);
    });
  }
}

export default new Router();
