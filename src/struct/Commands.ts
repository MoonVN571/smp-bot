import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputApplicationCommandData,
} from "discord.js";
import Context from "./Context";


export declare interface Command extends ChatInputApplicationCommandData {
    aliases?: string[];
    command?: {
        slash?: boolean;
        prefix?: boolean;
    };
    category?: string;
    whitelist?: Whitelist;
}

export interface Whitelist {
    developer?: boolean;
    admin?: boolean;
    adminJr?: boolean;
    guest?: boolean;
}

export declare interface CommandData {
    data: Command,
    execute: (ctx: Context, args: string[]) => void,
    autoComplete?: (interaction: AutocompleteInteraction) => void,
    buttonRun?: (interaction: ButtonInteraction) => void
}