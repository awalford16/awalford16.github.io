import React from "react";
import { RiBook2Line, RiBriefcase2Line, RiCloudLine, RiComputerLine, RiEmotionLaughLine, RiFileCodeLine, RiFirstAidKitLine, RiHeart2Line, RiLeafLine, RiMoneyCnyBoxLine, RiTeamLine, RiTimeLine, RiUserVoiceLine } from "react-icons/ri";
import {SiJenkins, SiMicrosoftazure, SiTerraform, SiPython, SiKubernetes, SiNodeDotJs, SiPowershell, SiReact, SiGo, SiMongodb, SiGroovy, SiSpinnaker, SiHelm} from "react-icons/si";
import {HiOutlinePuzzle} from "react-icons/hi";

export const homeContent = [
    {
        title: "Bio",
        text: "I currently work as a Site Reliability Engineer at Citrix. My primary responsibilities include working on infrastructure automation to provision k8s clusters. ",
        icon: <RiEmotionLaughLine />
    },
    {
        title: "Career",
        text: "I currently work as a Site Reliability Engineer at Citrix. My primary responsibilities include working on infrastructure automation to provision k8s clusters. ",
        icon: <RiBriefcase2Line />
    },
    {
        title: "Passions",
        text: "While I work a lot with software, I am trying to get to grips more with electrical engineering but I do like to spend a lot of my spare time out of the house either exploring new countries or exercising. I have been an avid runner for over 3 years and now beginning to participate in more events including a half-triathlon and half-marathon. Please visit the life section of my profile to see more.",
        icon: <RiHeart2Line />
    }
]

export const techSkills = [
    {
        name: "Terraform",
        years: 1,
        image: "terraform.png",
        tags: ["sre"]
    }, 
    {
        name: "Kubernetes",
        years: 1,
        image: "kubes.png",
        tags: ["sre"]
    }, 
    {
        name: "Jenkins",
        years: 2,
        image: "jenkins.png",
        tags: ["cicd"]
    }, 
    {
        name: "PowerShell",
        years: 2,
        image: "powershell.png",
        tags: ["dev"]
    },
    {
        name: "Python",
        years: 3,
        image: "python.png",
        tags: ["dev"]
    },
    {
        name: "React",
        years: 2,
        image: "react.png",
        tags: ["dev"]
    },
    {
        name: "NodeJS",
        years: 3,
        image: "node.png",
        tags: ["dev"]
    },
    {
        name: "MongoDB",
        years: 2,
        image: "mongo.png",
        tags: ["dev"]
    },
    {
        name: "Azure",
        years: 2,
        image: "azure.png",
        tags: ["sre"]
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
        skills: ["programming", "problem_solving"],
        tools: ["azure", "jenkins", "kubernetes", "terraform", "spinnaker", "helm"]
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
        tools: ["jenkins", "python", "powershell", "groovy"]
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
        skills: ["public_speaking", "first_aid", "time_management", "teamwork"],
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
        skills: ["programming", "problem_solving", "time_management"],
        tools: ["python", "node", "react"]
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
        skills: ["teamwork"],
        tools: []
    }
]

export const skillsMap = {
    public_speaking: {
        icon: <RiUserVoiceLine />,
        tags: ['soft']
    },
    programming: {
        icon: <RiFileCodeLine />,
        tags: ['soft']
    },
    first_aid: {
        icon: <RiFirstAidKitLine />,
        tags: ['soft']
    },
    time_management: {
        icon: <RiTimeLine />,
        tags: ['soft']
    },
    teamwork: {
        icon: <RiTeamLine />,
        tags: ['soft']
    },
    problem_solving: {
        icon: <HiOutlinePuzzle />,
        tags: ['soft']
    }
}

export const toolsMap = {
    azure: {
        icon: <SiMicrosoftazure />,
        color: '#007FFF'
    },
    jenkins: {
        icon: <SiJenkins />,
        color: '#d33834'
    },
    python: {
        icon: <SiPython />,
        color: '#4B8BBE'
    },
    terraform: {
        icon: <SiTerraform />,
        color: '#7B42BC'
    },
    kubernetes: {
        icon: <SiKubernetes />,
        color: '#2383db'
    },
    node: {
        icon: <SiNodeDotJs />,
        color: 'green'
    },
    powershell: {
        icon: <SiPowershell />,
        color: 'midnightblue'
    },
    react: {
        icon: <SiReact />,
        color: '#61DBFB'
    },
    golang: {
        icon: <SiGo />,
        color: 'aqua'
    },
    mongo: {
        icon: <SiMongodb />,
        color: '#4DB33D'
    },
    groovy: {
        icon: <SiGroovy />,
        color: '#54bedc'
    },
    spinnaker: {
        icon: <SiSpinnaker />,
        color: 'darkblue'
    },
    helm: {
        icon: <SiHelm />,
        color: '#0f1689'
    }
}

export const tagMap = {
    soft: ["first_aid", "problem_solving", "programming", "public_speaking", "teamwork", "time_management"],
    cloud: ["azure", "kubernetes", "helm", "terraform"],
    dev: ["powershell", "groovy", "python", "react", "golang", "node", "mongo"],
    cicd: ["jenkins", "spinnaker"]
}