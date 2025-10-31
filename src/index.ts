import {
	BaseInteraction,
	Client,
	Events,
	GatewayIntentBits,
	TextChannel,
} from "discord.js";
import * as dotenv from "dotenv";
import { slashCommands } from "./commands";
import { VoiceChannelConnectionEmbed } from "./components/VoiceChannelConnectionEmbed";
import Cron from "./cron";
import { registerCommands } from "./scripts/register";
import { SlashCommandObject } from "./scripts/types/SlashCommandObject";
import VoiceStateUpdateEvent from "./events/voice-state-update/voiceStateUpdate.event";

dotenv.config();
let commands: SlashCommandObject;
const logTextChannelId = process.env.LOG_CHANNEL_ID;
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildVoiceStates,
	],
});

let voiceStateUpdateEvent: VoiceStateUpdateEvent | undefined = undefined;

client.once(Events.ClientReady, async (client) => {
	console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
	commands = await registerCommands(slashCommands);

	const cron = new Cron(client);
	cron.start();
	voiceStateUpdateEvent = new VoiceStateUpdateEvent(client);
});

client.on("interactionCreate", async (interaction: BaseInteraction) => {
	if (interaction.isChatInputCommand()) {
		await commands[interaction.commandName].onCommandExecuted(interaction);
	} else if (interaction.isButton()) {
		await commands[
			String(interaction.message.interaction?.commandName)
		].onButtonPressed?.(interaction);
	} else if (interaction.isStringSelectMenu()) {
		await commands[
			String(interaction.message.interaction?.commandName)
		].onMenuSelected?.(interaction);
	} else if (interaction.isAutocomplete()) {
		await commands[String(interaction.commandName)].onAutoCompleteInputed?.(
			interaction
		);
	}
});

client.on("voiceStateUpdate", (oldState, newState) => {
	if (voiceStateUpdateEvent) {
		voiceStateUpdateEvent.notifyUserEntryVoiceChannel(oldState, newState);
	}
});

client.login(process.env.TOKEN);
