import { ChatInputCommandInteraction, Client, Colors, EmbedBuilder, Interaction, TextChannel } from "discord.js";
import { db, dbStruct } from "../database/db";

export async function logServer(interaction: Interaction, title: string, content: string) {
    // Get mailman logs channel
    const mailmanLogsChannelId = (db.prepare('SELECT mailman_logs_channel FROM guilds WHERE guild_id = ?').get(interaction.guildId) as dbStruct).mailman_logs_channel;
    const mailmanLogsChannel = interaction.guild.channels.cache.get(mailmanLogsChannelId) as TextChannel;

    if(!mailmanLogsChannelId || !mailmanLogsChannel) {
        await interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Mailman logs channel not set. Please set up a mailman logs channel using the `/setup` command.')
                    .setColor(Colors.Red)
            ]
        })

        return;
    }

    mailmanLogsChannel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(title)
                .setDescription(content)
                .setColor(Colors.Blue)
        ]
    })
}