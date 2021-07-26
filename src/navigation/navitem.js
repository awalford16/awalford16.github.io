import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IconContext } from "react-icons";

import "../styles/templates/navbar.css";

class NavItem extends React.Component {

    handleClick = () => {
        const {path, onItemClick} = this.props;
        onItemClick(path);
    }

    render(){
        const {active} = this.props;

        return(
            <div className="navbarItemContainer" active={active}>
                <Link className="navbarItem" to={this.props.path} onClick={this.handleClick} style={{ textDecoration: 'none' }}>
                    <IconContext.Provider value={{ color: `${this.props.active ? "#F2A154" : "#314E52"}`, className: "global-class-name" }}>
                        {this.props.icon}
                    </IconContext.Provider>
                </Link>
            </div>
        )
    }
}

export default NavItem