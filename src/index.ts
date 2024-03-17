import { Channel, Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { registerCommands } from "./scripts/register";
import { BaseInteraction } from "discord.js";
import { SlashCommandObject } from "./scripts/types/SlashCommandObject";
import { slashCommands } from "./commands";

dotenv.config();
let commands: SlashCommandObject;
const logTextChannelId = process.env.LOG_CHANNEL_ID;
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, async (client) => {
	console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
	commands = await registerCommands(slashCommands);
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
	if (logTextChannelId === undefined) {
		return
	}

	if (!oldState.channel && newState.channel) {
		(client.channels.cache.get(logTextChannelId) as TextChannel).send(`<@${newState.member?.user.id}> joined a <#${newState.channelId}>`)
	}
	else if (oldState.channel && !newState.channel) {
		(client.channels.cache.get(logTextChannelId) as TextChannel).send(`<@${newState.member?.user.id}> left a <#${oldState.channelId}>`)
	}
	else if (oldState.channelId !== newState.channelId) {
		(client.channels.cache.get(logTextChannelId) as TextChannel).send(`<@${newState.member?.user.id}> moved from <#${oldState.channelId}> to <#${newState.channelId}>`)
	}
})

client.login(process.env.TOKEN);
