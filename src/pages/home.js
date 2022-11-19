import React from "react";
import "../styles/pages/home.css"
import "../styles/_images.css"
import { homeContent } from "../content/content";
import { IconContext } from "react-icons";
import CenterContentTemplate from "../templates/centerContentTemplate";

function Home() {
	return (
		<CenterContentTemplate title="">
			{/* <ScrollContentWrapper content={homeContent} /> */}
			{homeContent.map((content, i) => (
				<div className="homeContentContainer">
					<div className="homeContentIcon">
						<IconContext.Provider value={{ color: "#314E52", size: 40 }}>
							{content.icon}
						</IconContext.Provider>
					</div>
					<div className="homeContentInfo">
						<h3>{content.title}</h3>
						{content.text.map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			))}
		</CenterContentTemplate>
	);
}

export default Home;