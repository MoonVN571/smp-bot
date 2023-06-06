import { MessageReaction, User } from "discord.js";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot, reaction: MessageReaction, user: User) {
	if (reaction.message.channel.id == client.config.whitelist.channelId
		&& user.id !== reaction.client.user.id
		&& client.config.developers.indexOf(user.id) == -1
		&& client.config.whitelist.reaction.indexOf(user.id) == -1)
		reaction.users.remove(user);
}