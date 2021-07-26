import React from "react";
import { IconContext } from "react-icons";

import "../styles/_images.css";
import "../styles/components/tile.css";
import { TileIcon } from "./tileIcon";

function Tile(props) {
    const title = (props.name[0].toUpperCase() + props.name.substring(1)).replace("_", " ");
    return(
        <div class="tileContainer">
            <TileIcon icon={props.icon} color={props.color} />
            <div className="tileTitle">
                <p>{title}</p>
            </div>
        </div>
    );
}

export default Tile;