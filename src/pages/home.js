import React from "react";
import "../styles/pages/home.css"
import "../styles/_images.css"
import TileGrid from "../components/tileGrid";
import MainContentTemplate from "../templates/mainContentTemplate";

function Home() {
	return (
		<MainContentTemplate title="Adam Walford">
			<article>
				<h2>Bio</h2>
				<p>I currently work as a Site Reliability Engineer at Citrix. My primary responsibilities include working on infrastructure automation to provision k8s clusters. </p>
			</article>

			<article>
				<h2>Career</h2>
			</article>

			<article>
				<h2>Passions</h2>
			</article>
		</MainContentTemplate>
	);
}

export default Home;