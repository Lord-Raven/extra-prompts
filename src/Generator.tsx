import { Stage } from "./Stage";

function buildSection(name: string, body: string) {
    return `###${name.toUpperCase()}:\n${body.trim()}\n\n`;
}


export function buildMapPrompt(stage: Stage): string {
    return (
        buildSection('Purpose', 'You are a game engine crafting 2D grid-based game maps for a dynamic world. You will analyze the setting and scenario to generate a formatted map that suits the situation.') +
        buildSection('Tiles', '\n' +
            `0: Outdoor plaza\n1: Interior room\n2: Solid wall\n`) +
        buildSection('Example Map - City street crossroad with shops', '\n' +
            `22222200022222222222\n` +
            `21111200021111211112\n` +
            `21111100021111111112\n` +
            `21111200021111211112\n` +
            `21111200011111211112\n` +
            `22222200022222222122\n` +
            `00000000000000000000\n` +
            `00000000000000000000\n` +
            `00000000000000000000\n` +
            `22212200022122222222\n` +
            `21111200021111211112\n` +
            `21111200011111211112\n` +
            `21111200021111111112\n` +
            `22222200021111211112\n` +
            `21111200021111211112\n` +
            `21111200022222222222\n` +
            `21111100021111111112\n` +
            `21111200011111111112\n` +
            `21111200021111111112\n` +
            `22222200022222222222\n`)+
        buildSection('Current Setting', 'A large urban warehouse') +
        buildSection('Current Instruction',
            `You are doing critical prep work for a roleplaying game. Instead of narrating, you will first use this planning response to construct a 2D map of the area described in CURRENT SETTING, using a 20x20 grid 
            of characters representing known TILES. Simply output this grid of twenty lines, then end this response.\n`) +
        '###FUTURE INSTRUCTION:');
}

export async function generateMap(stage: Stage) {

    let tries = 1;
    while (tries > 0) {
        let textResponse = await stage.generator.textGen({
            prompt: buildMapPrompt(stage),
            max_tokens: 500,
            min_tokens: 200
        });
        if (textResponse && textResponse.result) {
            console.log(textResponse.result);
        }
        
        tries--;
    }
    return '';
}