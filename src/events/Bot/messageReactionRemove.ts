import { GuildMember, MessageReaction, PartialMessageReaction, User } from "discord.js";
import { serverModel } from "../../databases/server-model";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot, _reaction: MessageReaction | PartialMessageReaction, user: User) {
	const reaction = await _reaction.fetch();
	const message = await reaction.message.fetch();

	if (message.channel.id == client.config.whitelist.channelId
		&& !user.bot
		&& client.config.developers.indexOf(user.id) == -1
		&& client.config.whitelist.reaction.indexOf(user.id) == -1) {
		return reaction.users.remove(user);
	} if (user.bot) return;

	const db = await serverModel.findOne({ guildId: message.guildId });
	if (!db) return;

	const emoji = reaction.emoji.toString();
	const role = client.config.whitelist.roleId;
	const index = db.whitelist.findIndex(data => data.userId == message.author.id);
	let member: GuildMember;
	try {
		member = await message.guild.members.fetch(message.author.id);
	} catch {
		member = undefined;
	}
	if (!member) return;
	if (emoji === client.emotes.approved) {
		db.whitelist[index].approved = false;
		member.roles.remove(role);
	} else if (emoji === client.emotes.denied) {
		db.whitelist[index].denied = false;
	}
	await db.save();
}