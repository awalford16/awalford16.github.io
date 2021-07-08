import React from "react";
import Tile from "./tile";
import {techSkills, status} from "../content/content";

import "../styles/components/tileGrid.css";


function TileGrid(props) {
    const headers = Object.keys(status);
    return(
        <div id="tileGridContainer">
            {props.type == "skills" ? 
                techSkills.map((data, i) => (
                    <Tile key={i} image={data.image} name={data.name} />
                ))
                : 
                headers.map((header, i) => (
                    <Tile key={i} header={status[header]} name={header} />
                ))
            }
        </div>
    );
}

export default TileGrid;