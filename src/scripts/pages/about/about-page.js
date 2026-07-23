import template from "./about-view.html?raw";

export default class AboutPage {
  async render() {
    return template;
  }

  async afterRender() {}
}
