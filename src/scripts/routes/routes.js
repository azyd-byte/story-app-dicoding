import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import AddPage from "../pages/add/add-page";
import FavoritesPage from "../pages/favorites/favorites-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/favorites": new FavoritesPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add": new AddPage(),
};

export default routes;
