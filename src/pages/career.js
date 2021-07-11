import React from "react";
import "../styles/_images.css";
import MainContentTemplate from "../templates/mainContentTemplate";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import {work} from "../content/content";
import 'react-vertical-timeline-component/style.min.css';
import TimelineElementTemplate from "../templates/timelineElementTemplate";


function Career() {
	return (
        <MainContentTemplate title="Career">
            <VerticalTimeline animate={true} layout="1-column-left">
                {work.map((job, i) => (
                    <VerticalTimelineElement
                        contentStyle={{ borderTop: `1px solid ${job.style.color}`, color: '#314E52', borderRadius: 0, backgroundColor: '#fefefe' }}
                        contentArrowStyle={{ borderRight: `7px solid  ${job.style.color}` }}
                        iconStyle={{ background: `${job.style.color}`, color: '#fff' }}
                        icon={job.style.icon}
                        date={job.duration}>
                        <TimelineElementTemplate skills={job.skills} role={job.job} company={job.company} tools={job.tools} description={job.description} />
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
		</MainContentTemplate>
	);
}

export default Career;