import { Channel, Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { registerCommands } from "./scripts/register";
import { BaseInteraction } from "discord.js";
import { SlashCommandObject } from "./scripts/types/SlashCommandObject";
import { slashCommands } from "./commands";
import { VoiceChannelConnectionEmbed } from "./components/VoiceChannelConnectionEmbed";

dotenv.config();
let commands: SlashCommandObject;
const logTextChannelId = process.env.LOG_CHANNEL_ID;
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, async (client) => {
	console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
	commands = await registerCommands(slashCommands);

	let serverIconIndex = 0
	setInterval(()=>{
		client.guilds.cache.get('814810394912358430')?.setIcon(`src/img/logo_${serverIconIndex+1}.jpg`)
		serverIconIndex = (serverIconIndex + 1) % 15
	},10*60*1000)
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

	const guildMember = newState.member

	if (!guildMember) {
		return
	}

	let state: "join" | "leave" | "move" | undefined = undefined;

	if (!oldState.channel && newState.channel) {
		state = "join"
	}
	else if (oldState.channel && !newState.channel) {
		state = "leave"
	}
	else if (oldState.channelId !== newState.channelId) {
		state = "move"
	}
	
	if (!state) {
		return
	}

	(client.channels.cache.get(logTextChannelId) as TextChannel).send({
		embeds: [
			VoiceChannelConnectionEmbed({
				guildMember: guildMember,
				oldVoiceState: oldState,
				newVoiceState: newState,
				state: state
			})
		]
	})
})

client.login(process.env.TOKEN);
