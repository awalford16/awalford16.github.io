import React from "react";
import { Component } from "react";
import {tagMap, skillsMap} from "../content/content";
import TileGrid from "../components/tileGrid";
import { RiCloseLine } from "react-icons/ri";
import {IconContext} from "react-icons";

import "../styles/views/filterView.css";

class FilterView extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            selectedFilters: [],
            tileMap: {}
        }
    }

    getTileMap = () => {
        let tileMap = {}
        let filteredMap = {};

        // Use selected filters to produce new TileGrid component
        this.state.selectedFilters.forEach(skillsFilter => {
            Object.keys(this.props.content).forEach((key) => {
                if (tagMap[skillsFilter.toLowerCase()].includes(key)) {
                    filteredMap[key] = this.props.content[key]
                }
            });
        });

        this.setState({
            tileMap: filteredMap
        }, () => console.log(this.state.tileMap));
    }

    toggleFilter = (filterName) => {
        let activeFilters = this.state.selectedFilters;
        if (this.state.selectedFilters.includes(filterName)) {
            let index = activeFilters.indexOf(filterName);
            activeFilters = this.state.selectedFilters.splice(index+1, 1);
        } else {
            activeFilters = [...this.state.selectedFilters, filterName]
        }

        this.setState({
            selectedFilters: activeFilters,
        }, () => this.getTileMap())
    }
    
    render() {
        return(
            <div id="filterViewWrapper">
                <div id="filterSelector">
                    <h4>Filters: </h4>
                    {this.props.filters.map((filter, i) => (
                        <button key={i} className={this.state.selectedFilters.includes(filter) ? "selectedFilter" : "unselectedFilter"} 
                                onClick={() => this.toggleFilter(filter)}>
                            <p>{filter}</p>
                        </button>
                    ))}
                </div>
                <div id="content">
                    {this.state.selectedFilters.length == 0 ? (
                        <p>No Selected Filters</p>
                    ) : (
                        <TileGrid tileMap={this.state.tileMap} />
                    )}
                </div>
            </div>
        );
    }
}

export default FilterView;