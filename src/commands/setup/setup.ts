import { ChannelType, Client, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import checkSetup from "./checkSetup";
import { notSetupError } from "../../errors/notSetupErrors";
import { noPermissionsError } from "../../errors/noPermissionsErrors";
import { db, dbStruct } from "../../database/db";
import { addGuildToDatabase } from "../../database/dbFunctions";
import { GuildEntry } from "../../database/guildEntry";

export const SetupCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the bot for your server. If ran before, re-adds missing roles and channels."),
    execute: async (client: Client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
            return noPermissionsError(interaction)

        addGuildToDatabase(new GuildEntry(interaction.guild.id, undefined));

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Working on it...")
                    .setDescription("Creating necessary roles...")
            ],
            ephemeral: true
        })

        const currentRoles = interaction.guild.roles.cache;
        const verified_email_role: dbStruct = db.prepare(`SELECT verified_email_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id);
        const mailman_admin_role: dbStruct = db.prepare(`SELECT mailman_admin_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id);

        // Create verified email role 
        // Check if role already exists in db
        if (db.prepare(`SELECT verified_email_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) === null
            || !currentRoles.find(
                role => role.id === verified_email_role.verified_email_role)) {

            const role = await interaction.guild.roles.create({
                name: "Verified Email",
                color: Colors.Green,
                reason: "Role for verified users"
            })

            // Add role to db
            db.prepare(`UPDATE guilds SET verified_email_role = ? WHERE guild_id = ?`).run(role.id, interaction.guild.id)
        }

        if (db.prepare(`SELECT mailman_admin_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) === null
            || !currentRoles.find(
                role => role.id === mailman_admin_role.mailman_admin_role)) {

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

        // // Create mailman logs channel
        // await interaction.guild.channels.create({
        //     name: "mailman-logs",
        //     type: ChannelType.GuildText,
        //     topic: "Mailman logs",
        //     reason: "Channel for mailman logs"
        // })

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Complete!")
                    .setDescription("Mailman has been set up for this server.")
                    .setColor(Colors.Green)
            ]
        })
    }
}