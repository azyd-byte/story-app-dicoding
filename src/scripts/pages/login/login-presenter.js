import { login } from "../../data/api";

export default class LoginPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async onLogin({ email, password }) {
    if (!email || !password) {
      this.view.showMessage("Email dan password harus diisi.");
      return;
    }

    this.view.showMessage("Memproses login...");

    try {
      const result = await login({ email, password });

      if (!result.error) {
        localStorage.setItem("token", result.loginResult.token);
        location.hash = "/";
      } else {
        this.view.showMessage(result.message);
      }
    } catch (error) {
      console.error(error);
      this.view.showMessage("Terjadi kesalahan jaringan. Coba lagi.");
    }
  }
}
