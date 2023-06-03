import { Message } from "discord.js";
import { Bot } from "../../struct/Bot";
import type { CommandData } from "../../struct/Commands";
import Context from "../../struct/Context";

export async function execute(client: Bot, message: Message) {
	if (message.author.bot) return;

	const prefix: string = client.config.prefix;
	if (!message.content.toLowerCase().startsWith(prefix)) {
		handleWhitelist(client, message);
		return;
	}

	const args: string[] = message.content.trim().slice(prefix.length).split(" ");
	const cmdName: string = args.shift()?.toLowerCase();

	const cmd: CommandData = client.commands.get(cmdName)
		|| client.commands.find((cmd: CommandData) => cmd.data.aliases && cmd.data.aliases.indexOf(cmdName) > -1);
	if (!cmd) return;

	const ctx = new Context(message, args);
	ctx.setArgs(args);

	client.cmds.sendCmdLog(ctx, message.content);
	if (!await client.cmds.canUserRunCommand(ctx, cmd, "prefix")) return;

	cmd.execute(ctx, args);
}

async function handleWhitelist(client: Bot, message: Message): Promise<void> {
	if (message.channel.id !== client.config.whitelist.channelId
		|| message.author.bot
		|| client.utils.isDev(message.author.id)) return;
	await message.react(client.emotes.approved);
	await message.react(client.emotes.denied);

	// update info message
	message.channel.messages.fetch().then(msgs => {
		const msg = msgs.find(msg => msg.author.id == client.user.id);
		if (!msg) return;
		msg.delete();
		message.channel.send(msg.content);
	});
}