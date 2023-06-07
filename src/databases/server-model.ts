import { Schema, model } from "mongoose";
const schema = new Schema({
	guildId: String,
	whitelist: [{
		userId: String,
		ign: String,
		approved: Boolean,
		denied: Boolean
	}]
}, { id: false });
export const serverModel = model("servers", schema);