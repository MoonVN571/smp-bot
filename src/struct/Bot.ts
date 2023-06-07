import dotenv from "dotenv";
dotenv.config();

import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";

import Logger from "./Logger";
import config from "../config.json";
import emojis from "../assets/emojis.json";

import { CommandData } from "./Commands";
import { Commands } from "../functions/Command";
import { Utils } from "../functions/Utils";

export class Bot extends Client {
	public commands: Collection<string, CommandData> = new Collection();
	public logger: Logger = new Logger();

	public dev = process.env.NODE_ENV == "development";
	public readonly emotes = emojis;
	public config = config;

	public utils = new Utils(this);
	public cmds = new Commands(this);

	public async start(): Promise<void> {
		this.loadCommands();
		this.loadEvents();
		process.on("uncaughtException", (error) => {
			this.logger.error(error);
		});
		await this.login(process.env.TOKEN);
	}

	public async loadCommands(): Promise<void> {
		const categories: string[] = readdirSync("./src/commands");
		categories.forEach((category: "developer" | "utils") => {
			const commands = readdirSync(`./src/commands/${category}`);
			commands.forEach(async (cmd: string) => {
				const cmdName = cmd.split(".")[0];
				const data: CommandData = await import(`../commands/${category}/${cmdName}`);
				data.data.category = category;
				this.commands.set(data.data.name, data);
			});
		});
	}

	public loadEvents(): void {
		readdirSync("./src/events/Bot").forEach(async (event: string) => {
			const eventName: string = event.split(".")[0];
			const { execute } = await import(`../events/Bot/${eventName}`);
			if (typeof execute !== "function") return;
			this.on(eventName, (...p) => execute(this, ...p));
		});
	}
}
