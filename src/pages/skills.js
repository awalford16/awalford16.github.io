import React from "react";
import "../styles/_images.css"
import TileGrid from "../components/tileGrid";
import MainContentTemplate from "../templates/mainContentTemplate";
import { skillsMap, toolsMap } from "../content/content";

function Skills() {
	return (
        <MainContentTemplate title="Skills">
            <article>
                <h2>Soft Skills</h2>
                <TileGrid tileMap={skillsMap} type="skills" />
            </article>

            <article>
                <h2>Frequently Used Tools</h2>
                <TileGrid tileMap={toolsMap} type="skills" />
            </article>
		</MainContentTemplate>
	);
}

export default Skills;