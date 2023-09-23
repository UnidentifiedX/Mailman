import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import checkSetup from "../setup/checkSetup";
import { notSetupError } from "../../errors/notSetupErrors";
import { addGuildToDatabase } from "../../database/dbFunctions";
import { db, dbStruct } from "../../database/db";
import { noAdminRoleError } from "../../errors/noRoleErrors";
import { logServer } from "../../logging/serverLog";

enum Subcommands {
    Add = "add",
    Remove = "remove",
    RemoveSingular = "singular",
    RemoveAll = "all",
    List = "list"
}

function updateExistingDomains(interaction: ChatInputCommandInteraction, domain: string): boolean {
    const guildId = interaction.guild.id;

    // retrieve domain list
    let domains: string[] = JSON.parse((db.prepare(`SELECT allowed_domains FROM guilds WHERE guild_id = ?`).get(guildId) as dbStruct).allowed_domains);

    if (!domains)
        domains = [];    
    else if (domains?.includes(domain)) // check if domain already exists
        return false

    // add domain to list
    domains.push(domain);

    // Update the db
    db.prepare(`UPDATE guilds SET allowed_domains = ? WHERE guild_id = ?`).run(JSON.stringify(domains), guildId);

    return true;
}

function removeExistingDomains(interaction: ChatInputCommandInteraction, domain: string): boolean {
    const guildId = interaction.guild.id;

    let domains: string[] = JSON.parse((db.prepare(`SELECT allowed_domains FROM guilds WHERE guild_id = ?`).get(guildId) as dbStruct).allowed_domains);

    if (!domains || !domains.find(d => d === domain)) {
        return false;
    }

    // remove domain from list
    domains = domains.filter(d => d !== domain);

    // Update the db
    db.prepare(`UPDATE guilds SET allowed_domains = ? WHERE guild_id = ?`).run(JSON.stringify(domains), guildId);

    return true;
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
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName(Subcommands.Remove)
                .setDescription("Remove domains from the allowed domains list")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName(Subcommands.RemoveSingular)
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
                        .setName(Subcommands.RemoveAll)
                        .setDescription("Remove all domains from the allowed domains list")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.List)
                .setDescription("List all allowed domains")
        ),
    execute: async (client, interaction) => {
        if (!checkSetup(interaction))
            return notSetupError(interaction)
        if (!interaction.guild.members.cache.get(interaction.member.user.id).roles.cache.has((db.prepare(`SELECT mailman_admin_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct).mailman_admin_role))
            return noAdminRoleError(interaction);

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === Subcommands.Add) {
            const domain = interaction.options.getString("domain", true);
            
            // check if domain is valid using regex
            if(/^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*$/.test(domain)) {
                const domainExists = updateExistingDomains(interaction, domain);

                if(!domainExists) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error!")
                                .setDescription(`The domain \`${domain}\` already exists in the allowed domains list`)
                                .setColor(Colors.Red)
                        ],
                        ephemeral: true
                    })
                }
                else {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Success!")
                                .setDescription(`Added \`${domain}\` to the allowed domains list`)
                                .setColor(Colors.Green)
                        ],
                        ephemeral: true
                    })

                    // Log to server
                    logServer(interaction, "Domain Added", `${interaction.user.username} added the domain \`${domain}\` to the allowed domains list`)
                }
            } 
            else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error!")
                            .setDescription(`The domain \`${domain}\` is not a valid domain`)
                            .setColor(Colors.Red)
                    ],
                    ephemeral: true
                })
            }
        } else if (subcommand === Subcommands.RemoveSingular) {
            const domain = interaction.options.getString("domain", true);
            const domainExists = removeExistingDomains(interaction, domain);

            if(!domainExists) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error!")
                            .setDescription(`The domain \`${domain}\` does not exist in the allowed domains list`)
                            .setColor(Colors.Red)
                    ],
                    ephemeral: true
                })
            }
            else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Success!")
                            .setDescription(`Removed \`${domain}\` from the allowed domains list`)
                            .setColor(Colors.Green)
                    ],
                    ephemeral: true
                })
            }
        } else if (subcommand === Subcommands.RemoveAll) {
            // Update the db
            db.prepare(`UPDATE guilds SET allowed_domains = ? WHERE guild_id = ?`).run(JSON.stringify([]), interaction.guild.id);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Success!")
                        .setDescription(`Removed all domains from the allowed domains list!`)
                        .setColor(Colors.Green)
                ],
                ephemeral: true
            })
        } else if (subcommand === Subcommands.List) {
            const allowedDomainsArray: string[] = JSON.parse((db.prepare(`SELECT allowed_domains FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct).allowed_domains);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Allowed Domains")
                        .setDescription(allowedDomainsArray?.length > 0 ? allowedDomainsArray.join("\n") : "All domains are currently allowed!")
                        .setColor(Colors.Green)
                        .setFooter({ text: "All other domains are not allowed" })
                ],
                ephemeral: true
            })
        }
    }
};