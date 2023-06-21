import { GuildMember } from "discord.js";
import { serverModel } from "../../databases/server-model";
import { Bot } from "../../struct/Bot";

export async function execute(client: Bot, member: GuildMember) {
	const db = await serverModel.findOne({ guildId: client.config.guildId });
	const isWhitelist = db.whitelist.find(data => data.userId === member.id && data.approved);
	if (isWhitelist) member.roles.add(client.config.whitelist.roleId);
}