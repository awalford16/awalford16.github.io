import React from "react";
import { IconContext } from "react-icons";

import "../styles/_images.css";
import "../styles/components/tile.css";

function Tile(props) {
    const title = (props.name[0].toUpperCase() + props.name.substring(1)).replace("_", " ");
    return(
        <div class="tileContainer">
            <div class="tileHeaderContainer">
                <IconContext.Provider value={{ color: `#fff`, size: 20}}>
                    <i style={{ backgroundColor: `${props.color ? props.color : '#F2A154'}`}}>{props.icon}</i>
                </IconContext.Provider>
            </div>
            <div className="tileTitle">
                <p>{title}</p>
            </div>
        </div>
    );
}

export default Tile;