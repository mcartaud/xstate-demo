import { assign, createMachine, sendTo, setup } from "xstate";

export const basicTrafficLightMachine = createMachine({
  id: "traffic light",
  initial: "green",
  states: {
    green: {
      on: {
        NEXT: "yellow",
      },
    },
    yellow: {
      on: {
        NEXT: "red",
      },
    },
    red: {
      on: {
        NEXT: "green",
      },
    },
  },
});

export const pedestrianLightMachine = createMachine({
  id: "pedestrian light",
  initial: "red",
  states: {
    green: {
      on: {
        NEXT: "red",
      },
    },
    red: {
      on: {
        NEXT: "green",
      },
    },
  },
});

export const trafficLightMachineWithSubMachine = createMachine({
  id: "traffic light",
  initial: "green",
  invoke: {
    src: pedestrianLightMachine,
    systemId: "pedestrianLight",
  },
  states: {
    green: {
      on: {
        NEXT: "yellow",
      },
    },
    yellow: {
      on: {
        NEXT: {
          target: "red",
          actions: [
            sendTo(({ system }) => system.get("pedestrianLight"), {
              type: "NEXT",
            }),
          ],
        },
      },
    },
    red: {
      on: {
        NEXT: {
          target: "green",
          actions: [
            sendTo(({ system }) => system.get("pedestrianLight"), {
              type: "NEXT",
            }),
          ],
        },
      },
    },
  },
});

export const trafficLightMachineWithSetup = setup({
  types: {
    events: {} as { type: "NEXT" },
  },
  actors: { pedestrianLightMachine },
  actions: {
    "pedestrian.next": sendTo(({ system }) => system.get("pedestrianLight"), {
      type: "NEXT",
    }),
  },
}).createMachine({
  id: "traffic light",
  initial: "green",
  context: {
    pedestrians: 0,
  },
  invoke: {
    src: pedestrianLightMachine,
    systemId: "pedestrianLight",
  },
  states: {
    green: {
      on: {
        NEXT: "yellow",
      },
    },
    yellow: {
      on: {
        NEXT: {
          target: "red",
          actions: ["pedestrian.next"],
        },
      },
    },
    red: {
      on: {
        NEXT: {
          target: "green",
          actions: ["pedestrian.next"],
        },
      },
    },
  },
});

export const pedestrianLightMachineWithGlobalStop = createMachine({
  id: "pedestrian light",
  initial: "red",
  on: { STOP: ".stopped" },
  states: {
    green: {
      on: {
        NEXT: "red",
      },
    },
    red: {
      on: {
        NEXT: "green",
      },
    },
    stopped: { type: "final" },
  },
});

export const trafficLightMachineWithGlobalStop = setup({
  types: {
    context: {} as { numberOfCycle: number },
    events: {} as { type: "NEXT" | "STOP" },
  },
  actors: { pedestrianLightMachineWithGlobalStop },
  actions: {
    "pedestrian.next": sendTo(({ system }) => system.get("pedestrianLight"), {
      type: "NEXT",
    }),
    increaseCycleCount: assign({
      numberOfCycle: ({ context }) => context.numberOfCycle + 1,
    }),
  },
  guards: {
    shouldStop: ({ context }) => context.numberOfCycle > 5,
  },
}).createMachine({
  id: "traffic light",
  initial: "green",
  context: {
    numberOfCycle: 0,
  },
  invoke: {
    src: pedestrianLightMachineWithGlobalStop,
    systemId: "pedestrianLight",
  },
  on: {
    STOP: {
      target: ".stopped",
      guard: "shouldStop",
      actions: sendTo(({ system }) => system.get("pedestrianLight"), {
        type: "STOP",
      }),
    },
  },
  states: {
    green: {
      on: {
        NEXT: "yellow",
      },
    },
    yellow: {
      on: {
        NEXT: {
          target: "red",
          actions: ["pedestrian.next"],
        },
      },
    },
    red: {
      on: {
        NEXT: {
          target: "green",
          actions: ["pedestrian.next", "increaseCycleCount"],
        },
      },
    },
    stopped: { type: "final" },
  },
});

export const pedestrianLightMachineWithPedestrianNames = setup({
  types: {
    context: {} as { pedestrianNames: string[] },
    events: {} as { type: "NEXT" | "STOP" } | { type: "ADD"; name: string },
  },
}).createMachine({
  id: "pedestrian light",
  initial: "red",
  context: { pedestrianNames: [] },
  on: { STOP: ".stopped" },
  states: {
    green: {
      on: {
        NEXT: {
          target: "red",
          actions: assign({
            pedestrianNames: () => [],
          }),
        },
        ADD: {
          guard: ({ event }) => event.name.length > 0,
          actions: assign({
            pedestrianNames: ({ context, event }) => [
              ...context.pedestrianNames,
              event.name,
            ],
          }),
        },
      },
    },
    red: {
      on: {
        NEXT: "green",
      },
    },
    stopped: { type: "final" },
  },
});

export const trafficLightMachineWithPedestrianNames = setup({
  types: {
    context: {} as { numberOfCycle: number },
    events: {} as { type: "NEXT" | "STOP" },
  },
  actors: { pedestrianLightMachineWithPedestrianNames },
  actions: {
    "pedestrian.next": sendTo(({ system }) => system.get("pedestrianLight"), {
      type: "NEXT",
    }),
    increaseCycleCount: assign({
      numberOfCycle: ({ context }) => context.numberOfCycle + 1,
    }),
  },
  guards: {
    shouldStop: ({ context }) => context.numberOfCycle > 5,
  },
}).createMachine({
  id: "traffic light",
  initial: "green",
  context: {
    numberOfCycle: 0,
  },
  invoke: {
    src: pedestrianLightMachineWithPedestrianNames,
    systemId: "pedestrianLight",
  },
  on: {
    STOP: {
      target: ".stopped",
      guard: "shouldStop",
      actions: sendTo(({ system }) => system.get("pedestrianLight"), {
        type: "STOP",
      }),
    },
  },
  states: {
    green: {
      on: {
        NEXT: "yellow",
      },
    },
    yellow: {
      on: {
        NEXT: {
          target: "red",
          actions: ["pedestrian.next"],
        },
      },
    },
    red: {
      id: "red",
      on: {
        NEXT: {
          target: "green",
          actions: ["pedestrian.next", "increaseCycleCount"],
        },
      },
    },
    stopped: { type: "final" },
  },
});

export const trafficLightMachineWithTimer = setup({
  types: {
    context: {} as { numberOfCycle: number },
    events: {} as { type: "NEXT" | "STOP" | "RETURN" },
  },
  actors: { pedestrianLightMachineWithPedestrianNames },
  actions: {
    "pedestrian.next": sendTo(({ system }) => system.get("pedestrianLight"), {
      type: "NEXT",
    }),
    increaseCycleCount: assign({
      numberOfCycle: ({ context }) => context.numberOfCycle + 1,
    }),
  },
  guards: {
    shouldStop: ({ context }) => context.numberOfCycle > 5,
  },
}).createMachine({
  id: "traffic light",
  initial: "green",
  context: {
    numberOfCycle: 0,
  },
  invoke: {
    src: pedestrianLightMachineWithPedestrianNames,
    systemId: "pedestrianLight",
  },
  on: {
    STOP: {
      target: ".stopped",
      guard: "shouldStop",
      actions: sendTo(({ system }) => system.get("pedestrianLight"), {
        type: "STOP",
      }),
    },
  },
  states: {
    green: {
      after: {
        4000: "yellow",
      },
    },
    yellow: {
      after: {
        1000: {
          target: "red",
          actions: ["pedestrian.next"],
        },
      },
    },
    red: {
      id: "red",
      after: {
        4000: {
          target: "green",
          actions: ["pedestrian.next", "increaseCycleCount"],
        },
      },
      on: {
        RETURN: "yellow",
      },
    },
    stopped: { type: "final" },
  },
});
