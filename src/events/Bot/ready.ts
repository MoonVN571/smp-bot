import { APIEmbed, Colors, Message, TextBasedChannel } from "discord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
dotenv.config();
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot) {
	client.logger.start("Bot started!");

	client.application.commands.set(client.commands.map(cmd => cmd.data));
	client.guilds.cache.get("1115619473840418906").commands.set([]);

	const guild = client.guilds.cache.get(client.config.guildId);
	const sttChannel = guild.channels.cache.get(client.config.status.channelId) as TextBasedChannel;
	const ipServer = "wildlands.online";
	const updateStatus = () => sttChannel.messages.fetch(client.config.status.msgId).then(async (msg: Message) => {
		const embed: APIEmbed = {
			author: { name: "Wild Lands SMP", icon_url: client.user.displayAvatarURL() },
			thumbnail: { url: guild.iconURL() },
			color: Colors.Red,
			description: "Server đang offline.",
			footer: { text: "IP Address: " + ipServer }
		};
		const updateMsg = () => msg.edit({ content: "", embeds: [embed] });
		axios.get(`https://api.mcsrvstat.us/2/${ipServer}`).then(res => {
			if (!res.data.online) return; // server offline, mac dinh
			embed.color = Colors.Green;
			embed.description = "";
			embed.fields = [{
				name: "Players [" + res.data.players.online + "]",
				value: res.data.players.list.join(", "),
				inline: true
			}, {
				name: "Phiên Bản",
				value: res.data.version,
				inline: true
			}, {
				name: "Update vào",
				value: `<t:${Math.trunc(Date.now() / 1000)}:R>`,
				inline: true
			}, {
				name: "Motd",
				value: res.data.motd.clean.join("\n")
			}];
			updateMsg();
		}).catch(err => {
			client.logger.error("Status:", err);
			embed.description = "Không thể lấy dữ liệu từ server.";
			updateMsg();
		});
	});
	updateStatus();
	setInterval(updateStatus, 5 * 60 * 1000);

	await mongoose.connect(process.env.MONGO_STRING as string).then(() => {
		client.logger.start("Connected to MongoDB!");
	});

	// channel.send("Không ghi bất kì nội dung gì khác ngoài IGN (kể cả emoji). Chúng mình sử dụng bot để quản lí toàn bộ IGN này.");
}