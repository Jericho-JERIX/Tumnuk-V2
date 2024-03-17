import { SlashCommandOption } from "./SlashCommandOption";
import {
	Interaction,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	ButtonInteraction,
	StringSelectMenuInteraction,
	UserSelectMenuInteraction,
	AutocompleteInteraction,
} from "discord.js";
export type SlashCommand = {
	name: string;
	description: string;
	options: SlashCommandOption[];

	onCommandExecuted: (
		interaction: ChatInputCommandInteraction
	) => Promise<void>;
	onButtonPressed?: (interaction: ButtonInteraction) => Promise<void>;
	onMenuSelected?: (
		interaction: StringSelectMenuInteraction
	) => Promise<void>;
	onAutoCompleteInputed?: (
		interaction: AutocompleteInteraction
	) => Promise<void>;
};
