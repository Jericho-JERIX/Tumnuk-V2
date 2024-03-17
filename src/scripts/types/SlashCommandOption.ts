import { ApplicationCommandOptionType } from "discord.js";

export type SlashCommandOption = {
	name: string;
	description?: string;
	type: ApplicationCommandOptionType;
	required?: boolean;
	autocomplete?: boolean;
};
