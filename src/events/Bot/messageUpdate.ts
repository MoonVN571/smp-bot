import { Message } from "discord.js";
import { serverModel } from "../../databases/server-model";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot, message: Message) {
	const db = await serverModel.findOne({ guildId: message.guildId });
	if (!db) return;

	const data = db.whitelist.find(data => data.userId == message.author.id);
	if (!data) return;

	await db.save();

	message.delete();
	message.channel.send(`${message.author.toString()} vui lòng nhập lại ign!`).then(msg => setTimeout(() => msg.delete(), 30 * 1000));
}