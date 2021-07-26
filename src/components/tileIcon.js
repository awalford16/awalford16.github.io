import React from "react";
import {IconContext} from "react-icons";

import "../styles/components/tile.css";

export function TileIcon(props) {
    return(
        <div class="tileIconContainer">
            <IconContext.Provider value={{ color: `#fff`, size: 20}}>
                <i style={{ backgroundColor: `${props.color ? props.color : '#F2A154'}`}}>{props.icon}</i>
            </IconContext.Provider>
        </div>
    );
}