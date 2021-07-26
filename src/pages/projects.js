import React, { Component } from "react";
import MainContentTemplate from "../templates/mainContentTemplate";
import {Modal} from "react-bootstrap"

import "../styles/pages/projects.css"
import { ModalView } from "../views/modalView";
import useModal from "../components/modal";
import { RiGithubLine, RiReactjsLine } from "react-icons/ri";

export default function Projects() {
    const {isShowing, toggle} = useModal();
    return(
        <MainContentTemplate>
            <ModalView isVisible={isShowing} hide={toggle} title="Root" icon={<RiGithubLine />} toolsIcon={<RiReactjsLine />}>
                <p>React native project</p>
            </ModalView>
            <div className="projectYearContainer">
                <div className="projectYear">
                    <p>2019</p>
                </div>
            </div>
            <div className="projects">
                <button onClick={toggle}>Project 1</button>
            </div>
        </MainContentTemplate>
    );
}