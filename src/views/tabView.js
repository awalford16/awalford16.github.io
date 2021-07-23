import React, {useState} from "react";
import { Tabs, Tab } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/components/tabs.css";

function TabView(props) {
    const [key, setKey] = useState(props.tabs[0].key)

    return(
        <Tabs defaultActiveKey={props.tabs[0].key} activeKey={key} onSelect={k => setKey(k)} className="tabView">
            {props.tabs.map((page, i) => (
                <Tab eventKey={page.key} title={page.title} className="tabContent">
                    {page.content}
                </Tab>
            ))}
        </Tabs>
    );
}

export default TabView;