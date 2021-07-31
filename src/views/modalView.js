import React, {useState} from "react";
import ReactDOM from "react-dom";
import {toolsMap} from "../content/content";

import "../styles/views/modalView.css"
import { TileIcon } from "../components/tileIcon";

export const ModalView = (props) => props.isVisible ? ReactDOM.createPortal(
        <div id="modalContainer">
            <div id="modalContentContainer">
                <div id="modalHeaderContainer">
                    <h2>{props.title}</h2>
                    <div id="modalInfoContainer">
                        <div id="modalToolsContainer">
                            {props.tools.map((tool) => (
                                <TileIcon icon={toolsMap[tool].icon} color={toolsMap[tool].color} />
                            ))}
                        </div>
                        <div id="modalLinksContainer">
                            <TileIcon icon={props.icon} color="#000" />
                        </div>
                    </div>
                    
                </div>
                <div id="modalBodyContainer">
                    {props.children}
                </div>
            </div>
        </div>, document.getElementById("imgContent")) : null;
