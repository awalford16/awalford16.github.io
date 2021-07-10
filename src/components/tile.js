import React from "react";

import "../styles/_images.css";
import "../styles/components/tile.css";

function Tile(props) {
    return(
        <div class="tileContainer">
            <div class="tileHeaderContainer">
                {props.header == undefined ? (
                    <img class="tileImg" src={require(`../content/images/${props.image}`)} alt={props.name} /> 
                ) : (
                    <h2>{props.header}</h2>
                )}
            </div>
            <div>
                <h4>{props.name}</h4>
            </div>
        </div>
    );
}

export default Tile;