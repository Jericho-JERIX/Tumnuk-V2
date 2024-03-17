import { SlashCommand } from "./SlashCommand";

export type SlashCommandObject = {
	[name: string]: SlashCommand;
};