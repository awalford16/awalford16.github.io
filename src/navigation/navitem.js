import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
                    <FontAwesomeIcon icon={this.props.icon} size="2x" color={this.props.active ? "#DA7F8F" : "#A7BBC7"} />
                </Link>
            </div>
        )
    }
}

export default NavItem