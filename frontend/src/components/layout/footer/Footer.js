import React from 'react'
import {
    RiTelegramLine,
    RiInstagramLine,
    RiWhatsappLine,
    RiLinkedinBoxLine
} from 'react-icons/ri'
import "./Footer.css"
const Footer = ({ name }) => {
    return (
        <footer id="footer">
            <div className="left">
                {/* <h1>Follow Us</h1> */}
                <div className='links'>
                    <a className="link" target="_blank" href="https://www.instagram.com/md_asad_azam/"><RiInstagramLine /></a>
                    <a className="link" target="_blank" href="https://api.whatsapp.com/send?phone=+917488369528"><RiWhatsappLine /></a>
                    <a className="link" target="_blank" href="https://t.me/md_asad_azam"><RiTelegramLine /></a>
                    <a className="link" target="_blank" href="https://www.linkedin.com/in/md-asad-azam/"><RiLinkedinBoxLine /></a>
                </div>
            </div>

            <div className="right">
                <div className="container">
                    <p>High Quality is our first priority</p>
                    <p className='copyrigth'>Copyright 2022 &copy;
                        <a href='https://www.instagram.com/md_asad_azam/'>{name}</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer