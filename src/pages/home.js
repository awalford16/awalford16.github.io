import React from "react";
import "../styles/pages/home.css"
import "../styles/_images.css"
import TileGrid from "../templates/tileGrid";

function Home() {
	return (
		<div id="homeContainer">
			<div id="homeImgDiv">
				<img className="siteImg" src={require("../content/images/image1.jpg")} alt="home" />
			</div>
			<div id="homeContentContainer">
				<h1>Adam Walford</h1>

				<article>
					<h2>Bio</h2>
					<p>I currently work as a Site Reliability Engineer at Citrix. My primary responsibilities include working on infrastructure automation to provision k8s clusters. </p>
				</article>

				<article>
					<h2>Current Position</h2>
					<TileGrid type="status" />
				</article>


				<article>
					<h2>Technical Skills</h2>
					<TileGrid type="skills" />
				</article>
			</div>
		</div>
	);
}

export default Home;