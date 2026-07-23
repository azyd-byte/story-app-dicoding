import { register } from "../../data/api";
import Swal from "sweetalert2";

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async onRegister({ name, email, password }) {
    if (!name || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Tidak Lengkap",
        text: "Nama wajib diisi.",
        confirmButtonColor: "var(--primary)",
      }).then(() => {
        this.view.focusField("name");
      });
      return;
    }

    if (!email || !email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Tidak Lengkap",
        text: "Email wajib diisi.",
        confirmButtonColor: "var(--primary)",
      }).then(() => {
        this.view.focusField("email");
      });
      return;
    }

    if (!password || password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Password Lemah",
        text: "Password minimal harus memiliki panjang 8 karakter.",
        confirmButtonColor: "var(--primary)",
      }).then(() => {
        this.view.focusField("password");
      });
      return;
    }

    Swal.fire({
      title: "Memproses Registrasi",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!result.error) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil!",
          text: "Akun Anda telah berhasil dibuat. Silakan login.",
          timer: 1500,
          showConfirmButton: false,
        });
        
        setTimeout(() => {
          location.hash = "/login";
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text: result.message || "Gagal membuat akun. Silakan coba lagi.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Kesalahan Jaringan",
        text: "Terjadi kesalahan jaringan atau server tidak merespons. Coba lagi.",
        confirmButtonColor: "#ef4444",
      });
    }
  }
}
