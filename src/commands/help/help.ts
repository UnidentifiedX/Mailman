import { SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import { Commands } from "../commands";
import { EmbedBuilder } from "@discordjs/builders";

export const HelpCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the list of available commands."),
    execute: async (client, interaction) => {
        // Get from the commands array
        const commandField = Commands.map(command => {
            return {
                name: "/" + command.data.name,
                value: command.data.description
            }
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Help")
                    .setURL("https://unidentifiedx.github.io/Mailman/")
                    .setDescription("Available commands")
                    .addFields(commandField)
            ],
            ephemeral: true
        })
    }
};