import RegisterPresenter from "./register-presenter";

const template = `
<section class="container" aria-labelledby="register-title">
  <div class="form-card">
    <h1 id="register-title">Buat Akun Baru</h1>
    <p style="margin-bottom: 24px;">Daftar sekarang untuk bergabung dan membagikan momen Anda.</p>

    <form id="registerForm" novalidate>
      <fieldset>
        <legend class="sr-only">Formulir pendaftaran akun</legend>

        <div>
          <label for="name">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Masukkan nama lengkap"
            required
            aria-required="true"
            autocomplete="name"
          />
        </div>

        <div>
          <label for="email">Alamat Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="nama@email.com"
            required
            aria-required="true"
            autocomplete="email"
          />
        </div>

        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Minimal 8 karakter"
            required
            aria-required="true"
            minlength="8"
            aria-describedby="passwordHelp"
            autocomplete="new-password"
          />
          <small id="passwordHelp" style="display: block; margin-top: 4px; color: var(--text-muted);">
            Password harus memiliki panjang minimal 8 karakter.
          </small>
        </div>

        <button type="submit">Daftar Sekarang</button>
      </fieldset>

      <!-- area pesan (dibaca screen reader) -->
      <p id="registerMessage" aria-live="polite"></p>
    </form>
  </div>
</section>
`;

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
