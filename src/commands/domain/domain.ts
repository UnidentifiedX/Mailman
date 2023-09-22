import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import checkSetup from "../setup/checkSetup";
import { notSetupError } from "../../errors/notSetupErrors";

enum Subcommands {
    Add = "add"
}

export const DomainCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("domain")
        .setDescription("All custom domain options")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.Add)
                .setDescription("Add a domain to the allowed domains list")
                .addStringOption(option =>
                    option
                        .setName("domain")
                        .setDescription("The domain to add")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a domain from the allowed domains list")
                .addStringOption(option =>
                    option
                        .setName("domain")
                        .setDescription("The domain to remove")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all allowed domains")
        ),
    execute: async (client, interaction) => {
        if (!checkSetup(interaction))
            return notSetupError(interaction)
    }
};