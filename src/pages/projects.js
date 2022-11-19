import React, { useState } from "react";
import "../styles/pages/blogs.css"
import { blogContent } from "../content/content";
import CenterContentTemplate from "../templates/centerContentTemplate";
import { Accordion, Card, Dropdown } from 'react-bootstrap';
import ProjectDropdown from "../components/projectSelection";

function Projects() {
    const [project, selectProject] = useState(blogContent[0])

    const convert_header = (header) => {
        return header.replaceAll("_", " ").toUpperCase();
    }

    return (
        <CenterContentTemplate title="">
            <ProjectDropdown select={selectProject} />

            <h3>{project.title}</h3>

            {Object.keys(project.content).map((c, i) => (
                <div className="textBlock">
                    <h4>{convert_header(c)}</h4>
                    {project.content[c].map((text, i) => (
                        <p key={i}>{text}</p>
                    ))}
                </div>
            ))}
            {/* {blogContent.map((content, i) => (
                <Accordion className="blogContent">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            <h3>{content.title}</h3>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            ))} */}
        </CenterContentTemplate>
    );
}

export default Projects;