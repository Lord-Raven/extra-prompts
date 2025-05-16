import {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";
import {Canvas} from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei";
import {Physics} from "@react-three/rapier";
import Player from "./Player";


type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {

    myInternalState: {[key: string]: any};

    constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
        super(data);
        const {
            characters,
            users,
            config,
            messageState,
            environment,
            initState,
            chatState
        } = data;
        this.myInternalState = messageState != null ? messageState : {'someKey': 'someValue'};
        this.myInternalState['numUsers'] = Object.keys(users).length;
        this.myInternalState['numChars'] = Object.keys(characters).length;
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
        return {
            success: true,
            error: null,
            initState: null,
            chatState: null,
        };
    }

    async setState(state: MessageStateType): Promise<void> {
        if (state != null) {
            this.myInternalState = {...this.myInternalState, ...state};
        }
    }

    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
            anonymizedId,
            isBot
        } = userMessage;
        return {
            stageDirections: null,
            messageState: {'someKey': this.myInternalState['someKey']},
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null,
        };
    }

    async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
            anonymizedId,
            isBot
        } = botMessage;
        return {
            stageDirections: null,
            messageState: {'someKey': this.myInternalState['someKey']},
            modifiedMessage: null,
            error: null,
            systemMessage: null,
            chatState: null
        };
    }


    render(): ReactElement {
  return (
            <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "jump", keys: ["Space"] },
            ]}>
            <Canvas shadows camera={{ fov: 45 }}>
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={0.3} />
                <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
                <Physics gravity={[0, -30, 0]}>
                <mesh position={[0, -1, 0]}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
                <Player />
                </Physics>
                <PointerLockControls />
            </Canvas>
            </KeyboardControls>
        )
    }

}
