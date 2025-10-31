import { Client, TextChannel, VoiceState } from "discord.js";
import { VoiceChannelConnectionEmbed } from "../../components/VoiceChannelConnectionEmbed";
import { UserVoiceState } from "./response";
import Cache, { TTL } from "../../cache";

export default class VoiceStateUpdateEvent {
	private readonly client: Client;
	private readonly cache: Cache;
	constructor(client: Client, cache: Cache) {
		this.client = client;
        this.cache = cache;
	}

	getUserVoiceState(
		oldState: VoiceState,
		newState: VoiceState
	): UserVoiceState {
		if (!oldState.channel && newState.channel) {
			return "join";
		} else if (oldState.channel && !newState.channel) {
			return "leave";
		} else if (oldState.channelId !== newState.channelId) {
			return "move";
		}
		return undefined;
	}

	notifyUserEntryVoiceChannel(oldState: VoiceState, newState: VoiceState) {
		const logTextChannelId = process.env.LOG_CHANNEL_ID;

		if (logTextChannelId === undefined) {
			return;
		}

		const guildMember = newState.member;

		if (!guildMember) {
			return;
		}

		let state: UserVoiceState = this.getUserVoiceState(oldState, newState);

		if (!state) {
			return;
		}

        const now = Date.now();
        if (state === "join") {
            this.cache.set(`user-entry-voice-channel:${guildMember.id}`, now, TTL.FOREVER)
        } else if (state === "leave") {
            const lastEntryTime = this.cache.get<number>(`user-entry-voice-channel:${guildMember.id}`);
            if (!lastEntryTime) {
                return;
            }
            const duration = now - lastEntryTime;
            // Database
            this.cache.delete(`user-entry-voice-channel:${guildMember.id}`)
        }

		(this.client.channels.cache.get(logTextChannelId) as TextChannel).send({
			embeds: [
				VoiceChannelConnectionEmbed({
					guildMember: guildMember,
					oldVoiceState: oldState,
					newVoiceState: newState,
					state: state,
				}),
			],
		});
	}
}
