import { ApplicationCommandOptionBase, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, CommandInteraction, Interaction, SharedNameAndDescription, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBuilder } from "discord.js";
import { CommandCustomID } from "../commandCustomID";

export interface Command {
    execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
    followUp?: (client: Client, interaction: Interaction) => Promise<void>;

    customID?: string[]
    data: SharedNameAndDescription
};