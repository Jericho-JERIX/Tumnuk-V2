import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";

type PingButtonValue = {
	button: string;
	count: number;
};

function PingButton({ disabled = false, count = 0 }): ActionRowBuilder<any> {
	const initialValue: PingButtonValue = {
		button: "ping",
		count: count,
	};

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(JSON.stringify(initialValue))
			.setLabel("Press Me")
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled)
	);
}

function PingMenuSelect(): ActionRowBuilder<any> {
	return new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId("select")
			.setPlaceholder("Nothing selected")
			.addOptions(
				{
					label: "Select me",
					description: "This is a description",
					value: "first",
				},
				{
					label: "You can select me too",
					description: "This is also a description",
					value: "second",
				}
			)
	);
}

export const Ping: SlashCommand = {
	name: "ping",
	description: "Replies with pong!!!",
	options: [
		{
			name: "message",
			description: "Type something here",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],

	async onCommandExecuted(interaction) {
		const message = interaction.options.get("message");

		let replyMessage = "Hello";
		if (message) {
			replyMessage += `\nYour message is: ${message.value}`;
		}

		const button = PingButton({});
		const menuSelect = PingMenuSelect();

		await interaction.reply({
			content: replyMessage,
			components: [button, menuSelect],
		});
	},

	async onButtonPressed(interaction) {
		let buttonValue: PingButtonValue = JSON.parse(interaction.customId);
		buttonValue.count++;

		const button = PingButton({ count: buttonValue.count });

		await interaction.update({
			content: `Count: ${buttonValue.count}`,
			components: [button],
		});
	},

	async onMenuSelected(interaction) {
		switch (interaction.values[0]) {
			case "first":
				await interaction.update({ content: `Select 1` });
				break;

			case "second":
				await interaction.update({ content: `Select 2` });
				break;
		}
		console.log(interaction);
	},
};
