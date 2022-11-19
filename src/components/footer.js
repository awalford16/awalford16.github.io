import React from "react";
import { RiGithubLine, RiInstagramLine, RiLinkedinLine } from "react-icons/ri";
import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi"

import "../styles/components/footer.css";

export function Footer() {
    return (
        <div id="footerContainer">
            <div id="socials">
                <a href="https://www.linkedin.com/in/adam-walford-411047169/" className="footerLink">
                    <RiLinkedinLine size={25} />
                </a>
                <a href="https://github.com/awalford16" className="footerLink">
                    <RiGithubLine size={25} />
                </a>
            </div>
        </div>
    );
}