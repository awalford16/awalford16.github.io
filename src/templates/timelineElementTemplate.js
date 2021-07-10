import React from "react";
import {skillsMap} from "../content/content";
import {IconContext} from "react-icons";

import "../styles/_images.css";
import "../styles/templates/timelineElement.css";

function TimelineElementTemplate(props) {
    return(
        <div>
            <div id="skillsToolsWrapper">
                <div id="skillsRow">
                    {props.skills.map((skill, i) => (
                        <IconContext.Provider value={{ color: "#F2A154", size: 20}}>
                            {skillsMap[skill].icon}
                        </IconContext.Provider>
                    ))}
                </div>
                <div id="toolsRow">
                    {props.tools.map((tool, j) => (
                        // <img class="toolImg" src={require(`../content/images/${toolsMap[tool].image}`)} alt="terraform" /> 
                        <img class="toolImg" src={require(`../content/images/${tool}.png`)} alt="terraform" />
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