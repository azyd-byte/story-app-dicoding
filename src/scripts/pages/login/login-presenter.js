import { login } from "../../data/api";
import Swal from "sweetalert2";

export default class LoginPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async onLogin({ email, password }) {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Input Tidak Lengkap",
        text: "Email dan password harus diisi.",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    Swal.fire({
      title: "Memproses Login",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await login({ email, password });

      if (!result.error) {
        localStorage.setItem("token", result.loginResult.token);
        
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: "Selamat datang kembali!",
          timer: 1200,
          showConfirmButton: false,
        });

        setTimeout(() => {
          location.hash = "/";
        }, 1200);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: result.message || "Email atau password salah.",
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
