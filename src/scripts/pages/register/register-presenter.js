import { register } from "../../data/api";

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async onRegister({ name, email, password }) {
    if (!name || !name.trim()) {
      this.view.showMessage("Nama wajib diisi.");
      this.view.focusField("name");
      return;
    }

    if (!email || !email.trim()) {
      this.view.showMessage("Email wajib diisi.");
      this.view.focusField("email");
      return;
    }

    if (!password || password.length < 8) {
      this.view.showMessage("Password minimal 8 karakter.");
      this.view.focusField("password");
      return;
    }

    this.view.showMessage("Memproses registrasi...");

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!result.error) {
        this.view.showMessage("Register berhasil! Silakan login.");
        setTimeout(() => {
          location.hash = "/login";
        }, 1000);
      } else {
        this.view.showMessage(result.message);
      }
    } catch (error) {
      console.error(error);
      this.view.showMessage("Terjadi kesalahan jaringan. Coba lagi.");
    }
  }
}
