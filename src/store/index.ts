import { create } from "zustand";
import { type Message } from "ai";
import { type InputProps } from "~/remotion/video";

interface ZustandStore {
  messagesMaybeOutOfSync: Message[];
  setStoredMessages: (newMessages: Message[]) => void;
  isCreatingVideo: boolean;
  voiceId: string;
  inputProps: InputProps;
}

export const useZustandStore = create<ZustandStore>()((set) => ({
  messagesMaybeOutOfSync: [],
  setStoredMessages: (newMessages) =>
    set({ messagesMaybeOutOfSync: newMessages }),
  isCreatingVideo: false,
  voiceId: "ewdB8Jn9FJaYMorleDYC",
  inputProps: {
    chapters: [
      {
        slides: [
          {
            script:
              "Welcome to the chapter on derivatives. In this chapter, we will explore the concept of derivatives and their applications. Let's start by understanding the definition of a derivative.",
            slideLayout: {
              type: "title",
              title: "Derivatives",
            },
            durationInFrames: 30 * 9,
            audioUrl: "/audio/v1w34f.mp3",
          },
          {
            script:
              "Welcome to the chapter on derivatives. In this chapter, we will explore the concept of derivatives and their applications. Let's start by understanding the definition of a derivative.",
            slideLayout: {
              type: "title",
              title: "Derivatives",
            },
            durationInFrames: 30 * 9,
            audioUrl: "/audio/v1w34f.mp3",
          },
          {
            script:
              "Welcome to the chapter on derivatives. In this chapter, we will explore the concept of derivatives and their applications. Let's start by understanding the definition of a derivative.",
            slideLayout: {
              type: "title",
              title: "Derivatives",
            },
            durationInFrames: 30 * 9,
            audioUrl: "/audio/v1w34f.mp3",
          },
          // {
          //   script:
          //     "A derivative measures how a function changes as its input changes. It represents the rate at which a quantity is changing at a given point. For example, the derivative of a function at a particular point represents the slope of the tangent line to the curve at that point.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Definition of a derivative",
          //     caption: "",
          //   },
          // },
          // {
          //   script:
          //     "Geometrically, the derivative can be interpreted as the instantaneous rate of change of a function. It tells us how fast the function is changing at any specific point. This concept is fundamental in calculus and various fields of science and engineering.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Geometric interpretation",
          //     caption: "",
          //   },
          // },
          // {
          //   script:
          //     "Derivatives have important applications in various domains. They are used to find the maximum and minimum points of functions, determine rates of growth, solve optimization problems, and analyze the behavior of functions. The rules of differentiation help us find the derivative of various types of functions.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Derivative rules and applications",
          //     caption: "",
          //   },
          // },
        ],
      },
      {
        slides: [
          {
            script:
              "Welcome to the chapter on limits. Limits play a crucial role in understanding calculus and analyzing functions. Let's begin by understanding the definition of a limit.",
            slideLayout: {
              type: "title",
              title: "Limits",
            },
            durationInFrames: 30 * 9,
            audioUrl: "/audio/y2ztzi.mp3",
          },
          // {
          //   script:
          //     "A limit represents the value a function approaches as its input approaches a certain value. It describes the behavior of a function near a particular point. Limits allow us to study the behavior of functions at points that are not defined, approach infinity or negative infinity.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Definition of a limit",
          //     caption: "",
          //   },
          // },
          // {
          //   script:
          //     "Evaluating limits involves analyzing the behavior of a function as the input approaches a specific value. It can be done through algebraic manipulations, graphical analysis, or by applying limit laws and techniques. Evaluating limits is crucial in understanding continuity, determining derivatives, and studying the behavior of functions.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Evaluating limits",
          //     caption: "",
          //   },
          // },
          // {
          //   script:
          //     "Limits and continuity are closely related concepts. A function is continuous at a point if the limit at that point exists and the function value matches that limit. Continuity implies that there are no abrupt jumps, holes, or vertical asymptotes in the graph of the function.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Limits and continuity",
          //     caption: "",
          //   },
          // },
        ],
      },
      {
        slides: [
          {
            script:
              "Welcome to the chapter on integrals. Integrals are powerful tools in calculus that help us find the total accumulation of quantities and analyze the area under curves. Let's begin by understanding the definition of an integral.",
            slideLayout: {
              type: "title",
              title: "Integrals",
            },
            durationInFrames: 30 * 14,
            audioUrl: "/audio/2ij5o.mp3",
          },
          // {
          //   script:
          //     "An integral is a mathematical operation that represents the reverse process of differentiation. It calculates the area under a curve or the total accumulation of a quantity over a given interval. Integrals are used in various areas such as physics, economics, and engineering.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Definition of an integral",
          //     caption: "",
          //   },
          // },
          // {
          //   script:
          //     "The Fundamental Theorem of Calculus establishes a fundamental relationship between derivatives and integrals. It states that if a function has an antiderivative (or indefinite integral), then the definite integral of the function can be evaluated by subtracting the antiderivative values at the endpoints of the interval.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Fundamental theorem of calculus",
          //     caption: "",
          //   },
          // },
          // {
          //   script:
          //     "Integrals have various applications, such as finding areas, calculating volumes, determining centers of mass, and solving problems involving accumulation of quantities. They provide a powerful tool for analyzing and solving problems in different fields.",
          //   slideLayout: {
          //     type: "titleAndCaption",
          //     title: "Applications of integrals",
          //     caption: "",
          //   },
          // },
        ],
      },
    ],
  },
}));

useZustandStore.subscribe((newState) => console.log("New state", newState));
