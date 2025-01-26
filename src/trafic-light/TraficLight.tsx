import { useMachine } from "@xstate/react";
import { useState } from "react";
import styled from "styled-components";
import { ActorRefFrom } from "xstate";
import stopping from "./stopping.svg";
import { TrafficLightImage } from "./TrafficLightImage";
import {
  pedestrianLightMachineWithPedestrianNames,
  trafficLightMachineWithTimer,
} from "./traficLightMachine";
import walking from "./walking.svg";

type PedestrianRef = ActorRefFrom<
  typeof pedestrianLightMachineWithPedestrianNames
>;

export const TrafficLight = () => {
  const [snapshot, event, ref] = useMachine(trafficLightMachineWithTimer, {
    inspect: (inspectionEvent) => {
      console.log(inspectionEvent);
    },
  });
  const pedestrianActor = ref.system.get("pedestrianLight") as
    | PedestrianRef
    | undefined;
  const pedestrianActorState = pedestrianActor?.getSnapshot();

  const [name, setName] = useState("");

  return (
    <Wrapper>
      <ButtonWrapper>
        <button onClick={() => event({ type: "NEXT" })}>Next</button>
        <button onClick={() => event({ type: "STOP" })}>Stop</button>
        <button onClick={() => event({ type: "RETURN" })}>yellow</button>
        <div>Number of cycles: {snapshot.context.numberOfCycle}</div>
      </ButtonWrapper>

      <LightWrapper>
        <TrafficLightImage
          redOn={snapshot.value === "red" || snapshot.value === "stopped"}
          yellowOn={snapshot.value === "yellow" || snapshot.value === "stopped"}
          greenOn={snapshot.value === "green" || snapshot.value === "stopped"}
        />
        <div>
          <img
            style={{ width: 50 }}
            src={pedestrianActorState?.value === "green" ? walking : stopping}
          />
        </div>
      </LightWrapper>
      <div>
        <InputWrapper>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => {
              pedestrianActor?.send({ type: "ADD", name });
              setName("");
            }}
            disabled={snapshot.value !== "red"}
          >
            Add
          </button>
        </InputWrapper>
        <div>
          <ul>
            {pedestrianActorState?.context.pedestrianNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Wrapper>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LightWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const Wrapper = styled.div`
  margin: 16px;
  display: flex;
  gap: 64px;
`;
