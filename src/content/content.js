import React from "react";
import { RiBook2Line, RiBriefcase2Line, RiCloudLine, RiComputerLine, RiEmotionLaughLine, RiFileCodeLine, RiFirstAidKitLine, RiHeart2Line, RiLeafLine, RiMoneyCnyBoxLine, RiTeamLine, RiTimeLine, RiUserVoiceLine } from "react-icons/ri";
import { SiJenkins, SiMicrosoftazure, SiTerraform, SiPython, SiKubernetes, SiNodeDotJs, SiPowershell, SiReact, SiGo, SiMongodb, SiGroovy, SiSpinnaker, SiHelm } from "react-icons/si";
import { HiOutlinePuzzle } from "react-icons/hi";

export const homeContent = [
    {
        title: "Bio",
        text: [
            "Thanks for visiting my site! My name is Adam and this is my first attempt at my own website where I am hoping to share my knowledge mostly in the form of tech blogs. As a software engineer, most of my work is the product of others, but there are some more complexities to deploying production-ready infrastructure from what you see in a lot of blog sites. I am hoping that this site can provide some of that knowledge.",
            "The last 2 years of my life have been focussed on specialising in automated deployments and service reliability in the cloud and on-prem. Please check out the blogs and feel free to get in touch if you have any questions/opinions/insults."
        ],
        icon: <RiEmotionLaughLine />
    },
    {
        title: "Career",
        text: ["Citrix: Site Reliability Engineer (2020-2022)",
            "Speechmatics: Site Reliability Engineer (2022-Present)"],
        icon: <RiBriefcase2Line />
    },
    {
        title: "Passions",
        text: ["While I work a lot with software, I am trying to get to grips more with electrical engineering but I do like to spend a lot of my spare time out of the house either exploring new countries or exercising. I have been an avid runner for over 3 years and now beginning to participate in more events including a half-triathlon and half-marathon. Please visit the life section of my profile to see more."],
        icon: <RiHeart2Line />
    }
]

export const blogContent = [
    {
        title: "GPU Inference on Kubernetes with Triton Server",
        content: {
            triton_server_overview: [
                "Triton server is a product provided by nvidia which specialises in GPU-based inference for machine learning applications. Triton leverages GPU performance capabilities to run inferences in batches to help performance and efficiency.",
                "In this example we will use an AKS cluster with T4 GPU nodes."
            ],
            provisioning_the_cluster: [
                "For the purposes of this demo, we are going to provision a 2 node cluster with 2 different nodepools. 1 small nodepool of type Standard_2d_v3 and 1 large GPU nodepool of size Standard_nvT4as_v4",
                "We can provision this cluster with 2 commands:",
                "az aks create --name triton-demo",
                "az aks nodepool create --name gpu --cluster-name triton-demo"
            ],
            node_isolation: [
                "We want to ensure that Triton only run on our T4 nodes. This can be achieved with labelling. By labelling a node, we can tell kubernetes to only provision pods on a particular node. Run the following command against the T4 nodes to label them:",
                "kubectl label node t4-node-1 gpu=true",
                "Now we want to ensure that only triton server is deployed on the T4 nodes so we dont consume resources that Triton needs. This is achieved with node taints. Run the following command to taint the T4 nodepool which will prevent pods from being scheduled onto it.",
                "kubectl taint nodes t4-node-1 gpu=true:NoSchedule",
            ],
            nvidia_drivers: [
                "Services running on kubernetes run on top of docker (or containerd to be particular). As Triton needs to talk to a GPU, we need to install a driver that allows triton to talk to the GPU through docker. This is achieved with a kubernetes daemonset which runs on every node of a cluster."
            ],
            triton_deployment: [
                "Previously we labelled nodes so we can target specific nodes on the cluster. The node selector block makes reference to this label to ensure that Triton server deploys onto the GPU nodes.",
                "We also define a liveness and readiness probe on the deployment. This will ensure that kubernetes will not send any inference traffic to the server until models have been loaded."
            ],
            triton_services: [
                "Triton server exposes 3 ports for 3 different services:",
                "8000: HTTP Service",
                "8001: GRPC Service",
                "8002: Metrics Service",
                "The metrics service provides metrics which can be scraped by prometheus. Here are the list of metrics: https://github.com/triton-inference-server/server/blob/main/docs/user_guide/metrics.md#metrics"
            ],
            consuming_triton: []
        }
    },
    {
        title: "Configuring ArgoCD with Helm",
        content: {
            helm_overview: [],
            argocd_overview: [],
            argocd_components: []
        }
    },
    {
        title: "Scaling with Datadog Metrics",
        content: {}
    },
    {
        title: "MQTT on Kubernetes",
        content: {}
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


export const work = [
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

export const projects = {
    2019: [
        {
            name: "AnonyQs",
            tools: ["node"]
        },
        {
            name: "Heart Disease Filter Selection",
            tools: ["python"]
        },
        {
            name: "Neural Network",
            tools: ["python"]
        },
        {
            name: "Spotify Playlist Generator",
            tools: ["python"]
        }
    ],
    2020: [
        {
            name: "Root",
            description: "React native app for tracking environmentally friendly journeys.",
            tools: ["react"]
        },
        {
            name: "Revlet",
            description: "Review Rental properties",
            tools: ["react", "node", "mongo"]
        }
    ],
    2021: [
        {
            name: "multictl",
            description: "Golang CLI to control multiple kubernetes clusters",
            tools: ["golang", "kubernetes"]
        }
    ]
}