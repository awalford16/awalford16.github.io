import React, {useState} from "react";
import ReactDOM from "react-dom";
import { IconContext } from "react-icons";

import "../styles/views/modalView.css"
import { TileIcon } from "../components/tileIcon";

export const ModalView = (props) => props.isVisible ? ReactDOM.createPortal(
        <div id="modalContainer">
            <div id="modalContentContainer">
                <div id="modalHeaderContainer">
                    <h2>{props.title}</h2>
                    <div id="modalInfoContainer">
                        <div id="modalToolsContainer">
                            <TileIcon icon={props.toolsIcon} />
                        </div>
                        <div id="modalLinksContainer">
                            <TileIcon icon={props.icon} />
                        </div>
                    </div>
                    
                </div>
                <div id="modalBodyContainer">
                    {props.children}
                </div>
            </div>
        </div>, document.getElementById("imgContent")) : null;
