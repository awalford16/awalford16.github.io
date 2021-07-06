import React from "react";
import "../styles/_images.css"
import TileGrid from "../components/tileGrid";
import MainContentTemplate from "../templates/mainContentTemplate";

function Skills() {
	return (
        <MainContentTemplate title="Skills">
            <article>
                <h2>Technical Skills</h2>
                <TileGrid type="skills" />
            </article>

            <article>
                <h2>Soft Skills</h2>
                
            </article>
		</MainContentTemplate>
	);
}

export default Skills;