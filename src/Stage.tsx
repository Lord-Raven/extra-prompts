import {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";
import {Canvas} from "@react-three/fiber";
import {Sky, PointerLockControls, KeyboardControls} from "@react-three/drei";
import {Physics} from "@react-three/rapier";
import Player from "./Player";
import { Level } from "./Level";
import { generateMap } from "./Generator";


type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {

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
        console.log('Extra Prompts constructor()');
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
        console.log('Extra Prompts load()');

        generateMap(this);

        return {
            success: true,
            error: null,
            initState: null,
            chatState: null,
            messageState: null
        };
    }

    async setState(state: MessageStateType): Promise<void> {
        console.log('Extra Prompts setState()');
        if (state != null) {
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
            messageState: {},
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
            messageState: {},
            modifiedMessage: null,
            error: null,
            systemMessage: null,
            chatState: null
        };
    }


    render(): ReactElement {
        console.log('Extra Prompts render()');
        return (
            <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "jump", keys: ["Space"] },
            ]}>
                <div style={{width: '100vw', height: '100vh'}}>
                    <Canvas camera={{ fov: 45 }}>
                        <Sky sunPosition={[100, 20, 100]} />
                        <ambientLight intensity={1.0} />
                        <Player />
                        <Level />
                    </Canvas>
                </div>
            </KeyboardControls>
        )
    }

}
