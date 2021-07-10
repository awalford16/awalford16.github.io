import React from "react";
import {skillsMap, toolsMap} from "../content/content";
import {IconContext} from "react-icons";

import "../styles/_images.css";
import "../styles/templates/timelineElement.css";

function TimelineElementTemplate(props) {
    return(
        <div>
            <div id="skillsToolsWrapper">
                <div id="skillsRow">
                    {props.skills.map((skill, i) => (
                        <IconContext.Provider value={{ color: "#F2A154", size: 25}}>
                            {skillsMap[skill].icon}
                        </IconContext.Provider>
                    ))}
                </div>
                <div id="toolsRow">
                    {props.tools.map((tool, j) => (
                        <IconContext.Provider value={{ color: "#fff", size: 15, marginRight: "5px"}}>
                            <i style={{ backgroundColor: `${toolsMap[tool].color}`}}>{toolsMap[tool].icon}</i>
                        </IconContext.Provider>
                    ))}
                </div>
            </div>
            <div>
                <h2>{props.role}</h2>
                <h4>{props.company}</h4>
            </div>
        </div>
    );
}

export default TimelineElementTemplate;