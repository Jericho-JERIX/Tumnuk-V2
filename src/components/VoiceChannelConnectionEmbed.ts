import { EmbedBuilder, GuildMember, VoiceState } from "discord.js";

export function VoiceChannelConnectionEmbed({
    guildMember,
    oldVoiceState,
    newVoiceState,
    state="join"
}:{
    guildMember: GuildMember
    oldVoiceState: VoiceState
    newVoiceState: VoiceState
    state?: "join" | "leave" | "move"
}): EmbedBuilder {

    const avatarURLResult = guildMember.user.avatarURL() || guildMember.user.defaultAvatarURL
    const date = new Date()

    const embed = new EmbedBuilder()
    .setFooter({ text: date.toLocaleString() })
    
    if (state === "join") {
        embed
        .setAuthor({ name: "Join a Channel", iconURL: avatarURLResult })
        .setDescription(`<@${guildMember.user.id}> joined a <#${newVoiceState.channelId}>`)
        .setColor("Green")
    }
    if (state === "leave") {
        embed
        .setAuthor({ name: "Leave a Channel", iconURL: avatarURLResult })
        .setDescription(`<@${guildMember.user.id}> left a <#${oldVoiceState.channelId}>`)
        .setColor("Red")
    }
    if (state === "move") {
        embed
        .setAuthor({ name: "Move a Channel", iconURL: avatarURLResult })
        .setDescription(`<@${guildMember.user.id}> moved from <#${oldVoiceState.channelId}> to <#${newVoiceState.channelId}>`)
        .setColor("Yellow")
    }

    return embed
}