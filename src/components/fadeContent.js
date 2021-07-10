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

    componentDidMount() {
        this.setState({
            visible: true
        })
    }

    render() {
        return(
            <article className='fadeIn'>
                <h2>{this.props.title}</h2>
                {this.props.children}
            </article>
        )
    }
}

export default FadeContent