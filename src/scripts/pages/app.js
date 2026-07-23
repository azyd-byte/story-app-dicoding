import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    if (this.currentPage?.stopCamera) {
      this.currentPage.stopCamera();
    }

    const url = getActiveRoute();
    const page = routes[url] || routes["/"] || routes["/login"];
    if (!page) return;

    this.currentPage = page;

    try {
      if (!document.startViewTransition) {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        return;
      }

      const transition = document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });

      await transition.finished;
    } catch (error) {
      console.warn("ViewTransition error or render error, fallback render:", error);
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default class AppWrapper extends App {}
