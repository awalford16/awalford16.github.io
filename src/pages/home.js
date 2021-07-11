import React from "react";
import "../styles/pages/home.css"
import "../styles/_images.css"
import MainContentTemplate from "../templates/mainContentTemplate";
import {homeContent} from "../content/content";
import {IconContext} from "react-icons";

function Home() {
	return (
		<MainContentTemplate title="">
			{/* <ScrollContentWrapper content={homeContent} /> */}
			{homeContent.map((content, i) => (
				<div className="homeContentContainer">
					<div className="homeContentIcon">
						<IconContext.Provider value={{ color: "#314E52", size: 40}}>
                            {content.icon}
                        </IconContext.Provider>
					</div>
					<div className="homeContentInfo">
						<h3>{content.title}</h3>
						<p>{content.text}</p>
					</div>
				</div>
			))}
		</MainContentTemplate>
	);
}

export default Home;