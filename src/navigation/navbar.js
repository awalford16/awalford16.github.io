import React from "react";
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import { RiHomeLine, RiTaskLine, RiBriefcase2Line, RiFootprintLine } from "react-icons/ri";

import NavItem from "./navitem";

import "../styles/templates/navbar.css";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePath: "/",
            items: [
                {
                    path: "/",
                    icon: <RiHomeLine size={25} />
                },
                {
                    path: "/skills",
                    icon: <RiTaskLine size={25} />
                },
                {
                    path: "/career",
                    icon: <RiBriefcase2Line size={25} />
                },
                {
                    path: "/life",
                    icon: <RiFootprintLine size={25}  />
                }
            ]
        }   
    }

    onItemClick = (path) => {
        this.setState({activePath: path});
    }

    render() {
        const {items, activePath} = this.state;

        return(
            <div id="navbarHeader">
                <h1>AW</h1>
                <div id="navbarContainer">
                    {
                        items.map((item, i) => (
                            <NavItem key={i} icon={item.icon} path={item.path} onItemClick={this.onItemClick} active={item.path === activePath} />
                        ))
                    }
                </div>
            </div>
        );
    }
    
}

const RouterSideNav = withRouter(NavBar);

export default RouterSideNav;