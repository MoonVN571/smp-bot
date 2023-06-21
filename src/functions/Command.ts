import dotenv from "dotenv";
dotenv.config();

import { Bot } from "../struct/Bot";
import Context from "../struct/Context";

import { CommandData } from "../struct/Commands";
import { CommandInteractionOption } from "discord.js";

export class Commands {
	public client: Bot;
	constructor(client: Bot) {
		this.client = client;
	}

	public async canUserRunCommand(ctx: Context, cmd?: CommandData): Promise<boolean> {
		const isDeveloper: boolean = this.client.config.developers.indexOf(ctx.author.id) !== -1;
		if (isDeveloper && cmd.data.whitelist?.developer === true)
			return true;

		ctx.sendMessage({
			embeds: [{
				description: "Bạn không thể dùng lệnh này!",
				color: ctx.config.color.error
			}],
			ephemeral: true
		});
		return false;
	}

	public async sendCmdLog(ctx: Context, msg?: string): Promise<void> {
		if (!msg) msg = `/${ctx.interaction.commandName} ${this.getSlashData(ctx.interaction.options.data.slice())}`;
		this.client.logger.info(`[${ctx.guild?.name}] [${ctx.channel?.name}] - ${ctx.author?.tag} (${ctx.author?.id}) : ${msg}`);
	}

	private getSlashData(data: CommandInteractionOption[]) {
		let result = "";
		data.forEach(item => {
			result += item.name;
			if (item.options) {
				item.options.forEach((option) => {
					result += " " + option.name;
					if (option.value) result += ":" + option.value;
					option.options?.forEach((nestedOption) => {
						result += " " + nestedOption.name;
						if (nestedOption.value) result += ":" + nestedOption.value;
					});

				});
			} else if (item.value) result += ":" + item.value;
			result += " ";
		});
		result = result.trim();
		return result;
	}
}