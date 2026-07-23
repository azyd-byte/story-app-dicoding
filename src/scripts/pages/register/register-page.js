import template from "./register-view.html?raw";
import RegisterPresenter from "./register-presenter";

export default class RegisterPage {
  async render() {
    return template;
  }

  async afterRender() {
    this.presenter = new RegisterPresenter({ view: this });

    const form = document.querySelector("#registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      await this.presenter.onRegister({ name, email, password });
    });
  }

  showMessage(message) {
    const messageEl = document.querySelector("#registerMessage");
    if (messageEl) {
      messageEl.textContent = message;
    }
  }

  focusField(fieldId) {
    const el = document.querySelector(`#${fieldId}`);
    if (el) {
      el.focus();
    }
  }
}
