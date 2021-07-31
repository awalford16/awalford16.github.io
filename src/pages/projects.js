import React, { Component } from "react";
import MainContentTemplate from "../templates/mainContentTemplate";
import {projects} from "../content/content";

import "../styles/pages/projects.css"
import { ModalView } from "../views/modalView";
import useModal from "../components/modal";
import { RiGithubLine, RiReactjsLine } from "react-icons/ri";

export default function Projects() {
    const {isShowing, toggle, currentContent} = useModal();
    return(
        <MainContentTemplate>
            <ModalView isVisible={isShowing} hide={toggle} title={currentContent.name} links={currentContent.links} tools={currentContent.tools}>
                <p>{currentContent.description}</p>
            </ModalView>
            {Object.keys(projects).map((year, i) => (
                <div className="projectYearContainer">
                    <div className="projectYear">
                        <h2>{year}</h2>
                    </div>
                    <div className="projects">
                    {projects[year].map((project, j) => (
                        <button style={{ backgroundColor: `${currentContent.name == project.name ? "#F2A154" : "#314E52"}`}} onClick={() => toggle(project)}>{project.name}</button>
                    ))}
                    </div>
                </div>
            ))}
        </MainContentTemplate>
    );
}