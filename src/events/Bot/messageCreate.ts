import { Collection, Message } from "discord.js";
import { serverModel } from "../../databases/server-model";
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
		|| client.utils.isDev(message.author.id)
		|| client.config.whitelist.reaction.indexOf(message.author.id) !== -1
	) return;

	let db = await serverModel.findOne({ guildId: message.guildId });
	if (!db) db = await serverModel.create({ guildId: message.guildId });

	const sendMessage = (msg: string) => {
		message.channel.send(`${message.author.toString()}, ${msg}`).then(msg => setTimeout(() => msg.delete(), 30000));
		message.delete();
	};
	if (db) {
		const data = db.whitelist.find(data => data.userId == message.author.id);
		if (data?.approved === true) {
			sendMessage(`bạn đã sử dụng **${data.ign}** và đã được duyệt!`);
			return;
		}
		if (data?.denied === true) {
			sendMessage(`bạn đã sử dụng **${data.ign}** và đã bị từ chối!`);
			return;
		}
		const nameUsed = db.whitelist.find(data => data.ign.toLowerCase() === message.content.toLowerCase());
		if (nameUsed) {
			sendMessage(`**${message.content}** đã có nugời sử dụng!`);
			return;
		}
		if (data && data.approved === false && data.denied === false) {
			sendMessage(`bạn đã sử dụng **${data.ign}** tại server, vui lòng chờ duyệt!`);
			return;
		}
	}

	if (!validIgn(message.content))
		return sendMessage("tên của bạn không hợp lệ!");

	if (!db.whitelist) db.whitelist = [];

	db.whitelist.push({
		userId: message.author.id,
		ign: message.content,
		approved: false,
		denied: false
	});
	await db.save();

	await message.react(client.emotes.approved);
	await message.react(client.emotes.denied);

	// update info message
	message.channel.messages.fetch().then((msgs: Collection<string, Message>) => {
		const msg = msgs.find(msg => msg.author.id == client.user.id);
		if (!msg) return;
		msg.delete();
		message.channel.send(msg.content);
	});
}

function validIgn(username: string): boolean {
	if (username.length < 3 || username.length > 16) {
		return false;
	}

	const regex = /^[a-zA-Z0-9_]+$/;
	if (!regex.test(username)) {
		return false;
	}

	return true;
}
