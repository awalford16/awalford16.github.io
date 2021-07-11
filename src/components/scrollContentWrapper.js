import React from "react";
import { Component } from "react";
import FadeContent from "./fadeContent";

import "../styles/components/scrollContentWrapper.css";

class ScrollContentWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeContentIndex: 0
        }
    }

    onContentChange = (up) => {
        let newIndex;
        if((this.state.activeContentIndex < this.props.content.length) && up) {
            newIndex = this.state.activeContentIndex + 1;
        } else if (this.state.activeContentIndex >= 0 && !up) {
            newIndex = this.state.activeContentIndex - 1;
        }

        this.setState({
            activeContentIndex: newIndex
        })
    }

    render() {
        return(
            <div id="scrollWrapper">
                { this.state.activeContentIndex != 0 &&
                (
                 <button className="changeContentBtn" onClick={() => this.onContentChange(false)}>{this.props.content[this.state.activeContentIndex - 1].title}</button>
                )}
                <FadeContent title={this.props.content[this.state.activeContentIndex].title} visible={true}>
                    <p>{this.props.content[this.state.activeContentIndex].text}</p>
                </FadeContent>
                { (this.state.activeContentIndex + 1) < this.props.content.length &&
                (
                 <button className="changeContentBtn" onClick={() => this.onContentChange(true)}>
                    {this.props.content[this.state.activeContentIndex + 1].title}
                </button>
                )}
            </div>
        );
    }
}

export default ScrollContentWrapper;