const template = `
<section class="container" aria-labelledby="about-title">
  <h1 id="about-title">Tentang Aplikasi</h1>

  <article>
    <p>
      Aplikasi ini merupakan platform berbagi cerita berbasis lokasi.
      Pengguna dapat menambahkan cerita dengan gambar dan lokasi yang akan
      ditampilkan pada peta digital.
    </p>

    <h2 id="fitur-title">Fitur Utama</h2>
    <ul aria-labelledby="fitur-title">
      <li>Melihat daftar story dari pengguna lain</li>
      <li>Menampilkan lokasi story di peta interaktif</li>
      <li>Menambahkan story baru dengan foto dan lokasi</li>
      <li>Mengambil foto langsung dari kamera</li>
    </ul>

    <h2 id="tech-title">Teknologi</h2>
    <p aria-labelledby="tech-title">
      Aplikasi ini dibangun menggunakan JavaScript, Web API seperti 
      <span lang="en">Geolocation</span> dan 
      <span lang="en">Camera</span>, serta Leaflet untuk peta digital.
    </p>

    <h2 id="author-title">Pengembang</h2>
    <p aria-labelledby="author-title">
      Dibuat oleh: Zayadi
    </p>
    <p style="margin-top: 12px;">
      <a 
        href="https://www.linkedin.com/in/a-zayadi/" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Profil LinkedIn Zayadi"
        title="Profil LinkedIn Zayadi"
        style="display: inline-flex; align-items: center; gap: 8px; color: #0a66c2; text-decoration: none; font-weight: 600;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg>
        <span>LinkedIn</span>
      </a>
    </p>
  </article>
</section>
`;

export default class AboutPage {
  async render() {
    return template;
  }

  async afterRender() {}
}
