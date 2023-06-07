import { Message } from "discord.js";
import { serverModel } from "../../databases/server-model";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot, message: Message) {
	const db = await serverModel.findOne({ guildId: message.guildId });
	if (!db) return;

	const data = db.whitelist.find(data => data.userId == message.author.id);
	if (!data) return;

	const index = db.whitelist.indexOf(data);
	if (data.denied === false) db.whitelist.splice(index, 1);

	await db.save();
}