import { TextBasedChannel } from "discord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { serverModel } from "../../databases/server-model";
dotenv.config();
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot) {
	client.logger.start("Bot started!");

	client.application.commands.set(client.commands.map(cmd => cmd.data));

	await mongoose.connect(process.env.MONGO_STRING as string).then(() => {
		client.logger.start("Connected to MongoDB!");
	});

	/*
	const channel = client.channels.cache.get(client.config.whitelist.channelId) as TextBasedChannel;
	channel.messages.fetch().then(async msgs => {
		let db = await serverModel.findOne({ guildId: "1115619473840418906" });
		if (!db) db = await serverModel.create({ guildId: "1115619473840418906" });
		db.whitelist = [];
		msgs.forEach(async msg => {
			if (msg.author.bot) return;
			db.whitelist.push({
				userId: msg.author.id,
				ign: msg.content,
				approved: false,
				denied: false
			});
			// await msg.react(client.emotes.approved);
			// msg.react(client.emotes.denied);
		});
		await db.save();
	}); */

	// channel.send("Không ghi bất kì nội dung gì khác ngoài IGN (kể cả emoji). Chúng mình sử dụng bot để quản lí toàn bộ IGN này.");
}