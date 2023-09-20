import { ChatInputCommandInteraction, Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../command";

export const PingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong and other information."),

    execute: async (client: Client, interaction: ChatInputCommandInteraction) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .addFields(
                        { name: "Latency", value: `${Date.now() - interaction.createdTimestamp}ms` },
                        { name: "API Latency", value: `${Math.round(client.ws.ping)}ms` }
                    )
            ],
            ephemeral: true
        })
    }
};