import React from "react";
import "../styles/base.css"
import "../styles/_images.css"
import RouterSideNav from '../navigation/navbar';

function CenterContentTemplate(props) {
    return (
        <div id="pageWrapper">
            <RouterSideNav />
            <div id="contentContainer">
                {props.children}
            </div>
        </div>
    );
}

export default CenterContentTemplate;