import { ActivityType, GatewayIntentBits } from "discord.js";
import { Bot } from "./struct/Bot";

const bot = new Bot({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions
	],
	presence: {
		status: "online",
		activities: [{ type: ActivityType.Watching, name: "" }]
	}
});

bot.start();