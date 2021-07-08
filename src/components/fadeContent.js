import React from "react";
import { Component } from "react";

import "../styles/components/fadeContent.css";

class FadeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    handleFade = () => {
        this.setState({
            visible: this.props.visible
        })
    }

    render() {
        return(
            <article className={this.props.visible ? 'fadeIn' : 'fadeOut'}>
                <h2>{this.props.title}</h2>
                {this.props.children}
            </article>
        )
    }
}

export default FadeContent