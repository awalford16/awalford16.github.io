import React from "react";
import "../styles/_images.css"
import TileGrid from "../components/tileGrid";
import MainContentTemplate from "../templates/mainContentTemplate";
import { skillsMap, toolsMap } from "../content/content";
import TabView from "../views/tabView";
import FilterView from "../views/filterView";

function Skills() {
    const filters = ["Soft", "Cloud", "Dev", "CICD"];
    const mergedSkills = {...skillsMap, ...toolsMap}

	return (
        <MainContentTemplate title="">
            {/* <TabView tabs={tabs} /> */}
            <FilterView filters={filters} content={mergedSkills} />
		</MainContentTemplate>
	);
}

export default Skills;