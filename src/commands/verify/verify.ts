import { Client, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, TextInputStyle } from "discord.js";
import { Command } from "../command";
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import { CommandCustomID } from "../../commandCustomID";

export const VerifyCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Verify your email to get access to the server.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("email")
                .setDescription("Verify email address"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("code")
                .setDescription("Verify email verification code")
                .addStringOption(option =>
                    option
                        .setName("code")
                        .setDescription("Verification code")
                        .setRequired(true))
        ),
    execute: async (client: Client, interaction) => {
        if (interaction.options.getSubcommand() === "email") {
            await interaction.showModal(
                new ModalBuilder()
                    .setCustomId(CommandCustomID.VerificationModal)
                    .setTitle("Verify your email")
                    .addComponents([
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(CommandCustomID.VerificationInput)
                                    .setLabel("Email")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("example@mailman.com")
                                    .setRequired(true)
                            )
                    ])
            )
        }
        else if (interaction.options.getSubcommand() === "code") {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Pong!")
                        .setDescription("request received")
                ],
                ephemeral: true
            })
        }
    },
    followUp: async (client: Client, interaction: ModalSubmitInteraction) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Email sent!")
                    .setDescription(`You should receive an email at **${interaction.fields.getTextInputValue(CommandCustomID.VerificationInput)}**. 
                        Please follow the instructions in the email to verify your email address.`)
            ],
            ephemeral: true
        })
    },
    customID: [CommandCustomID.VerificationModal, CommandCustomID.VerificationInput]
};