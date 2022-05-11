/*
 hash路由本质是 hanhchange 事件起的作用
*/
class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = "";
  }
  route(path, callback) {
    this.routes[path] = callback || function () {};
  }
  updateView() {
    this.currentUrl = location.hash.slice(1) || "/";
    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
  }
  init() {
    window.addEventListener("load", this.updateView.bind(this), false);
    window.addEventListener("hashchange", this.updateView.bind(this), false);
  }
}


