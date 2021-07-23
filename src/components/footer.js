import React from "react";
import {RiInstagramLine, RiLinkedinLine} from "react-icons/ri";

import "../styles/components/footer.css";

export function Footer() {
    return(
        <div id="footerContainer">
            <div id="socials">
                <RiInstagramLine size={20} />
                <RiLinkedinLine size={20} />
            </div>
        </div>
    );
}