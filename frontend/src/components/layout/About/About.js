import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from "@mui/icons-material/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/md_asad_azam/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/mdasadazamecommercecloud/image/upload/v1653491388/avatars/1653491331291_u2pxjx.jpg"
              alt="Founder"
            />
            <Typography>Md Asad Azam</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This website is made for one of my friends who happens to be a young entrepreneur.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="mailto:mdasadazamlucky@gmail.com"
              target="blank"
            >
              <EmailIcon className="emailSvgIcon" />
            </a>

            <a href="https://www.instagram.com/md_asad_azam/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;