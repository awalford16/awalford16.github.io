import React from "react";
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import { RiHomeLine, RiTaskLine, RiBriefcase2Line, RiFootprintLine, RiHome7Line, RiCloudLine, RiLineChartLine, RiPlugLine, RiRocket2Line, RiToolsLine } from "react-icons/ri";
import Gravatar from "react-gravatar"

import NavItem from "./navitem";
import { Footer } from "../components/footer";

import "../styles/templates/navbar.css";

const ICON_SIZE = 20
class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePath: "/",
            items: [
                {
                    path: "",
                    icon: <RiHome7Line size={ICON_SIZE} />
                },
                {
                    path: "projects",
                    icon: <RiToolsLine size={ICON_SIZE} />
                }
            ]
        }
    }

    onItemClick = (path) => {
        this.setState({ activePath: path });
    }

    render() {
        const { items, activePath } = this.state;

        return (
            <div id="navbarHeader">
                <div id="profile">
                    <Gravatar email="awalford16@gmail.com" style={{ "borderRadius": 50 }} />
                    <h3>Adam Walford</h3>
                </div>

                <div id="navbarContainer">
                    {
                        items.map((item, i) => (
                            <NavItem key={i} icon={item.icon} path={item.path} onItemClick={this.onItemClick} active={item.path === activePath} />
                        ))
                    }
                </div>

                <Footer />
            </div>
        );
    }

}

const RouterSideNav = withRouter(NavBar);

export default RouterSideNav;