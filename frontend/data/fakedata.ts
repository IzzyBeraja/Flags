import type { Project } from "@components/FlagNav/FlagNav";

export const fakeProjects: Project[] = [
  {
    flags: [
      {
        edges: [],
        id: "flag1",
        name: "Launch Rocket",
        nodes: [
          {
            data: {
              label: "Is Android",
            },
            id: "flag1-node1",
            position: { x: 250, y: 5 },
            type: "card",
          },
        ],
      },
      {
        edges: [],
        id: "flag2",
        name: "Run Rover",
        nodes: [
          {
            data: {
              label: "Is Employee",
            },
            id: "flag2-node0",
            position: { x: 100, y: 4 },
            type: "card",
          },
          {
            data: {
              label: "Is Tester",
            },
            id: "flag2-node1",
            position: { x: 200, y: 4 },
            type: "card",
          },
        ],
      },
      {
        edges: [],
        id: "flag3",
        name: "Invest in CGI",
        nodes: [],
      },
      {
        edges: [],
        id: "flag4",
        name: "Deal with Aliens",
        nodes: [],
      },
    ],
    id: "project1",
    name: "Development",
  },
  {
    flags: [
      {
        edges: [],
        id: "flag5",
        name: "Show Banner",
        nodes: [],
      },
      {
        edges: [],
        id: "flag6",
        name: "30 second ads",
        nodes: [],
      },
      {
        edges: [],
        id: "flag7",
        name: "Display Call to Action",
        nodes: [],
      },
    ],
    id: "project2",
    name: "Advertising",
  },
];
