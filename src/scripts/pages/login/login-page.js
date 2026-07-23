import template from "./login-view.html?raw";
import LoginPresenter from "./login-presenter";

const EYE_OPEN_SVG = `<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_OFF_SVG = `<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;

export default class LoginPage {
  async render() {
    return template;
  }

  async afterRender() {
    this.presenter = new LoginPresenter({ view: this });

    const form = document.querySelector("#loginForm");
    const passwordInput = document.querySelector("#password");
    const togglePasswordBtn = document.querySelector("#togglePassword");

    if (togglePasswordBtn && passwordInput) {
      togglePasswordBtn.addEventListener("click", () => {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        togglePasswordBtn.innerHTML = isPassword ? EYE_OFF_SVG : EYE_OPEN_SVG;
        togglePasswordBtn.setAttribute(
          "aria-label",
          isPassword ? "Sembunyikan password" : "Tampilkan password"
        );
      });
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      await this.presenter.onLogin({ email, password });
    });
  }

  showMessage(message) {
    const messageEl = document.querySelector("#loginMessage");
    if (messageEl) {
      messageEl.textContent = message;
    }
  }
}
