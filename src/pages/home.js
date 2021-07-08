import React from "react";
import "../styles/pages/home.css"
import "../styles/_images.css"
import MainContentTemplate from "../templates/mainContentTemplate";
import ScrollContentWrapper from "../components/scrollContentWrapper";
import {homeContent} from "../content/content";

function Home() {
	return (
		<MainContentTemplate title="Adam Walford">
			<ScrollContentWrapper content={homeContent} />
		</MainContentTemplate>
	);
}

export default Home;