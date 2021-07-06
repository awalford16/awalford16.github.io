import React from "react";
import "../styles/base.css"
import "../styles/_images.css"

function MainContentTemplate(props) {
	return (
        <div id="pageWrapper">
            <div id="imgContent">
                <img className="siteImg" src={require("../content/images/background.jpg")} alt="home" />
            </div>
            <div id="contentContainer">
                <h1>{props.title}</h1>
                {props.children}
            </div>
        </div>
	);
}

export default MainContentTemplate;