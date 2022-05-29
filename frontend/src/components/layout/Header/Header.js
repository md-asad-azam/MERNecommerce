import React from 'react';
import { ReactNavbar } from "overlay-navbar"
import logo from "../../../images/Logo.jpg"


const options = {
  burgerColor: "orange",
  logo: logo,
  logoWidth: "10vmax",
  logoHoverSize: "10px",
  logoHoverColor: "var(--dark-yellow)",

  navColor1: "rgba(0,0,0,0.8)",
  navColor2: "rgba(0,0,0,0.85)",
  navColor3: "rgba(0,0,0,0.875)",
  navColor4: "rgba(0,0,0,0.9)",

  link1Color: "white",
  link1Size: "1.8vmax",
  link1Family: "Verdana",
  link1ColorHover: "var(--dark-yellow)",

  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",

  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",

  nav1justifyContent: "center",

  link1Margin: "2.5vmax",

  searchIcon: false,
  cartIconMargin: "10",
  profileIconUrl: "/login",
  cartIconUrl: "/cart",
  cartIconColorHover: "var(--dark-yellow)",
  profileIconColorHover: "var(--dark-yellow)"
}

const Header = () => {
  return <ReactNavbar {...options} />;
}

export default Header;

