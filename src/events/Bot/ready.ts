import { APIEmbed, Colors, Message, TextBasedChannel } from "discord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
dotenv.config();
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot) {
	client.logger.start("Bot started! " + client.user.tag);

	client.application.commands.set(client.commands.map(cmd => cmd.data));
	const guild = client.guilds.cache.get(client.config.guildId);
	guild.commands.set([]);

	// guild.members.fetch().then(async m => {
	// 	await Promise.all(m.map(async member => {
	// 		if (member.user.bot && member.roles.cache.has("1205012992882778163"))
	// 			return await member.roles.remove("1205012992882778163")
	// 		if (!member.roles.cache.has("1205012992882778163") && member.joinedTimestamp < 1704042000000)
	// 			await member.roles.add("1205012992882778163")
	// 	}));
	// 	console.log("Done")
	// })

	// let channel = guild.channels.cache.get("1205015073937035275");
	// if (channel.isTextBased()) channel.send(".");

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
				value: res.data.players.list?.join(", ") || "Không có ai",
				inline: true
			}, {
				name: "Version",
				value: res.data.version,
				inline: true
			}, {
				name: "Update",
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
	setInterval(updateStatus, 1 * 60 * 1000);

	await mongoose.connect(process.env.MONGO_STRING as string).then(() => {
		client.logger.start("Connected to MongoDB!");
	});

	// channel.send("Không ghi bất kì nội dung gì khác ngoài IGN (kể cả emoji). Chúng mình sử dụng bot để quản lí toàn bộ IGN này.");
}