import { Client, Colors, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, TextInputStyle } from "discord.js";
import { Command } from "../command";
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import { CommandCustomID } from "../../commandCustomID";
import transporter from "../../mailer/transporter";
import config from "../../config.json";

enum Subcommands {
    Email = "email",
    Code = "code"
}

class VerificationInstance {
    public userId: string;
    public guildId: string;
    public code: number;
    public expiresAt: Date;

    constructor(userId: string, guildId: string, code: number, expiresAt: Date) {
        this.userId = userId;
        this.guildId = guildId;
        this.code = code;
        this.expiresAt = expiresAt;
    }
}

export const verificationMembers: VerificationInstance[] = [];

function AddMinutesToDate(minutes: number) {
    return new Date(new Date().getTime() + minutes * 60000);
}

export const VerifyCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Verify your email to get access to the server.")
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.Email)
                .setDescription("Verify email address"))
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.Code)
                .setDescription("Verify email verification code")
        ),
    execute: async (client: Client, interaction) => {
        if (interaction.options.getSubcommand() === Subcommands.Email) {
            await interaction.showModal(
                new ModalBuilder()
                    .setCustomId(CommandCustomID.VerificationEmailModal)
                    .setTitle("Verify your email")
                    .addComponents([
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(CommandCustomID.VerificationEmailInput)
                                    .setLabel("Email")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("example@mailman.com")
                                    .setRequired(true)
                            )
                    ])
            )
        }
        else if (interaction.options.getSubcommand() === Subcommands.Code) {
            await interaction.showModal(
                new ModalBuilder()
                    .setCustomId(CommandCustomID.VerificationCodeModal)
                    .setTitle("Enter your verification code")
                    .addComponents([
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(CommandCustomID.VerificationCodeInput)
                                    .setLabel("Verification Code")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("123456")
                                    .setRequired(true)
                                    .setMinLength(6)
                                    .setMaxLength(6)
                            )
                    ])
            )
        }
    },
    followUp: async (client: Client, interaction: ModalSubmitInteraction) => {
        if (interaction.customId === CommandCustomID.VerificationEmailModal) {
            const input = interaction.fields.getTextInputValue(CommandCustomID.VerificationEmailInput);

            // https://www.w3resource.com/javascript/form/email-validation.php
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input)) {
                // Working on it...
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Working on it...")
                            .setDescription(`Please wait while we send an email to **${input}**.`)
                    ],
                    ephemeral: true
                })

                const verificationCode = Math.floor(100000 + Math.random() * 900000);
                const mail = {
                    from: config.sender_email,
                    to: input,
                    subject: `Verification code for ${interaction.guild?.name}`,
                    text: `Your verification code is ${verificationCode}. \n\n Run the \"/verify code\" command to verify your email address. This code expires in 5 minutes.`
                }

                transporter.sendMail(mail, async (err, info) => {
                    if (err) {
                        await interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Error sending email!")
                                    .setDescription(`Please try again later.`)
                            ],
                            ephemeral: true
                        })

                        console.log(err);
                    }
                    else {
                        verificationMembers.push(
                            new VerificationInstance(
                                interaction.user.id,
                                interaction.guildId,
                                verificationCode,
                                AddMinutesToDate(5)
                            )
                        );

                        await interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Email sent!")
                                    .setDescription(`You should receive an email at **${interaction.fields.getTextInputValue(CommandCustomID.VerificationEmailInput)}**. Please follow the instructions in the email to verify your email address.`)
                            ],
                            ephemeral: true
                        })
                    }
                });
            }
            else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Invalid email address!")
                            .setDescription(`Please enter a valid email address.`)
                            .setColor(Colors.Red)
                    ],
                    ephemeral: true
                })
            }
        }
        else if (interaction.customId === CommandCustomID.VerificationCodeModal) {
            const instance = verificationMembers.find(instance => instance.userId === interaction.user.id && instance.guildId === interaction.guildId);
            const code = interaction.fields.getTextInputValue(CommandCustomID.VerificationCodeInput);

            // Check valid
            if (new Date() < instance?.expiresAt
                && code == instance?.code.toString()
                && interaction.guildId == instance?.guildId
                && interaction.user.id == instance?.userId) {

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Email verified!")
                            .setDescription(`Your email address has been verified.`)
                    ],
                    ephemeral: true
                })

                // Remove instance
                verificationMembers.splice(verificationMembers.indexOf(instance), 1);
                
                return;
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Verification code invalid.")
                        .setDescription(`Please run the \"/verify email\" command again to get a new verification code, or rerun the`)
                        .setColor(Colors.Red)
                ],
                ephemeral: true
            })
        }
    },
    customID: [
        CommandCustomID.VerificationEmailModal,
        CommandCustomID.VerificationEmailInput,
        CommandCustomID.VerificationCodeModal,
        CommandCustomID.VerificationCodeInput
    ]
};