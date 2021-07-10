import React from "react";
import Tile from "./tile";

import "../styles/components/tileGrid.css";


function TileGrid(props) {
    const keys = Object.keys(props.tileMap);
    return(
        <div id="tileGridContainer">
            {
                keys.map((data, i) => (
                    <Tile key={i} icon={props.tileMap[data].icon} color={props.tileMap[data].color} name={data} />
                ))
            }
        </div>
    );
}

export default TileGrid;