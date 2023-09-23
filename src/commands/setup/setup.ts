import { ChannelType, Client, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import checkSetup from "./checkSetup";
import { notSetupError } from "../../errors/notSetupErrors";
import { noManageRolesPermissionsError } from "../../errors/noPermissionsErrors";
import { db, dbStruct } from "../../database/db";
import { logServer } from "../../logging/serverLog";

export const SetupCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the bot for your server. If ran before, re-adds missing roles and channels.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    execute: async (client: Client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
            return noManageRolesPermissionsError(interaction)
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
            return noManageRolesPermissionsError(interaction)

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Working on it...")
                    .setDescription("Creating necessary roles...")
            ],
            ephemeral: true
        })

        const currentRoles = interaction.guild.roles.cache;
        const currentChannels = interaction.guild.channels.cache;
        const verified_email_role: string = (db.prepare(`SELECT verified_email_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct)?.verified_email_role;
        const mailman_admin_role: string = (db.prepare(`SELECT mailman_admin_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct)?.mailman_admin_role;
        const mailman_logs_channel: string = (db.prepare(`SELECT mailman_logs_channel FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct)?.mailman_logs_channel;

        // Create verified email role 
        // Check if role already exists in db
        if (!verified_email_role || !currentRoles.find(role => role.id === verified_email_role)) {
            const role = await interaction.guild.roles.create({
                name: "Verified Email",
                color: Colors.Green,
                reason: "Role for verified users"
            })

            // Add role to db
            db.prepare(`UPDATE guilds SET verified_email_role = ? WHERE guild_id = ?`).run(role.id, interaction.guild.id)
        }

        if (!mailman_admin_role || !currentRoles.find(role => role.id === mailman_admin_role)) {
            // Create mailman admin role
            const role = await interaction.guild.roles.create({
                name: "Mailman Admin",
                color: Colors.Red,
                reason: "Role for mailman admins"
            })

            // Add role to db
            db.prepare(`UPDATE guilds SET mailman_admin_role = ? WHERE guild_id = ?`).run(role.id, interaction.guild.id)
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Working on it...")
                    .setDescription("Creating necessary channels...")
            ]
        })

        if (!mailman_logs_channel || !currentChannels.find(channel => channel.id === mailman_logs_channel)) {
            // Create mailman logs channel
            const channel = await interaction.guild.channels.create({
                name: "mailman-logs",
                type: ChannelType.GuildText,
                topic: "Mailman logs",
                reason: "Channel for mailman logs"
            })

            // Add channel to db
            db.prepare(`UPDATE guilds SET mailman_logs_channel = ? WHERE guild_id = ?`).run(channel.id, interaction.guild.id)
        }

        // Set setup to true
        db.prepare(`UPDATE guilds SET is_setup = 1 WHERE guild_id = ?`).run(interaction.guild.id)

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Complete!")
                    .setDescription("Mailman has been set up for this server.")
                    .setColor(Colors.Green)
                    .setFooter({
                        text: "TIP: Feel free to change the name of the roles and channels to whatever you want! Mailman tracks these changes."
                    })
            ]
        })

        logServer(interaction, "Setup Complete!", `${interaction.user.username} ran the setup command, setting up Mailman for this server!`)
    }
}