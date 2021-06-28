import React from "react";
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import { faHome, faTasks, faBriefcase } from '@fortawesome/free-solid-svg-icons'

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
                    icon: faHome
                },
                {
                    path: "/skills",
                    icon: faTasks
                },
                {
                    path: "/career",
                    icon: faBriefcase
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
            <div id="navbarContainer">
                {
                    items.map((item, i) => (
                        <NavItem key={i} icon={item.icon} path={item.path} onItemClick={this.onItemClick} active={item.path === activePath} />
                    ))
                }
            </div>
        );
    }
    
}

const RouterSideNav = withRouter(NavBar);

export default RouterSideNav;