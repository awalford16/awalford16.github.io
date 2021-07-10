import React from "react";
import { RiBook2Line, RiBriefcase2Line, RiCloudLine, RiComputerLine, RiFileCodeLine, RiFirstAidKitLine, RiInboxLine, RiLeafLine, RiMoneyCnyBoxLine, RiOperaLine, RiUserVoiceLine } from "react-icons/ri";

export const homeContent = [
    {
        title: "Bio",
        text: "I currently work as a Site Reliability Engineer at Citrix. My primary responsibilities include working on infrastructure automation to provision k8s clusters. "
    },
    {
        title: "Career",
        text: "I currently work as a Site Reliability Engineer at Citrix. My primary responsibilities include working on infrastructure automation to provision k8s clusters. "
    },
    {
        title: "Passions",
        text: "While I work a lot with software, I am trying to get to grips more with electrical engineering but I do like to spend a lot of my spare time out of the house either exploring new countries or exercising. I have been an avid runner for over 3 years and now beginning to participate in more events including a half-triathlon and half-marathon. Please visit the life section of my profile to see more."
    }
]

export const techSkills = [
    {
        name: "Terraform",
        years: 1,
        image: "terraform.png"
    }, 
    {
        name: "Kubernetes",
        years: 1,
        image: "kubes.png"
    }, 
    {
        name: "Jenkins",
        years: 2,
        image: "jenkins.png"
    }, 
    {
        name: "PowerShell",
        years: 2,
        image: "powershell.png"
    },
    {
        name: "Python",
        years: 3,
        image: "python.png"
    },
    {
        name: "React",
        years: 2,
        image: "react.png"
    },
    {
        name: "NodeJS",
        years: 3,
        image: "node.png"
    },
    {
        name: "MongoDB",
        years: 2,
        image: "mongo.png"
    },
    {
        name: "Azure",
        years: 2,
        image: "azure.png"
    }
]

export const status={
    company: "Citrix",
    role: "SRE",
    years: 2
}

export const work=[
    {
        job: "Site Reliability Engineer",
        company: "Citrix",
        description: "",
        duration: "2020-Present",
        style: {
            icon: <RiCloudLine />,
            color: 'teal'
        },
        skills: ["public_speaking", "programming"],
        tools: ["azure", "jenkins", "kubes", "terraform"]
    },
    {
        job: "Software Engineer Intern",
        company: "Citrix",
        description: "",
        duration: "2018-2019",
        style: {
            icon: <RiComputerLine />,
            color: 'purple'
        },
        skills: ["programming"],
        tools: ["jenkins", "python", "powershell"]
    },
    {
        job: "Instructor",
        company: "Go Ape",
        description: "",
        duration: "2017-2019",
        style: {
            icon: <RiLeafLine />,
            color: 'darkgreen'
        },
        skills: ["public_speaking", "first_aid"],
        tools: []
    },
    {
        job: "Student",
        company: "University of Lincoln",
        description: "I studied computer science",
        duration: "2016-2020",
        style: {
            icon: <RiBook2Line />,
            color: 'darkred'
        },
        skills: ["programming"],
        tools: ["python", "node"]
    },
    {
        job: "Ride Operator",
        company: "Joyland",
        description: "This was my very humble beginnings.",
        duration: "2015-2016",
        style: {
            icon: <RiMoneyCnyBoxLine />,
            color: 'gold'
        },
        skills: [],
        tools: []
    }
]

export const skillsMap = {
    public_speaking: {
        icon: <RiUserVoiceLine />
    },
    programming: {
        icon: <RiFileCodeLine />
    },
    first_aid: {
        icon: <RiFirstAidKitLine />
    }
}