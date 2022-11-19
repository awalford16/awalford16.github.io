import React from "react";
import { blogContent } from "../content/content";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/projects.css"

export default function ProjectDropdown(props) {
    return (
        <div id="projectSelectionWrapper">
            <Dropdown>
                <Dropdown.Toggle size="sm" id="dropdown-button-dark-example1" variant="secondary">
                    Select Project
                </Dropdown.Toggle>

                <Dropdown.Menu size="sm" variant="dark">
                    {blogContent.map((blog, i) => (
                        <div>
                            <Dropdown.Item onClick={() => props.select(blog)}>{blog.title}</Dropdown.Item>
                            <Dropdown.Divider />
                        </div>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}