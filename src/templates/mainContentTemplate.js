import React from "react";
import "../styles/base.css"
import "../styles/_images.css"
import { Footer } from "../components/footer";

function MainContentTemplate(props) {
	return (
        <div id="pageWrapper">
            <div id="imgContent">
                <img className="siteImg" src={require("../content/images/background.jpg")} alt="home" />
            </div>
            <div id="contentContainer">
                {props.children}

                <Footer />
            </div>
        </div>
	);
}

export default MainContentTemplate;