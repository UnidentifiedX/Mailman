import { ChatInputCommandInteraction } from "discord.js";
import { db, dbStruct } from "../../database/db";

export default (interaction: ChatInputCommandInteraction) => {
    const guildId = interaction.guild.id;

    // Query the database
    const guild: dbStruct = db.prepare("SELECT is_setup FROM guilds WHERE guild_id = ?").get(guildId);

    // Check if the guild exists in the database
    if (!guild) {
        // Update the db
        db.prepare("INSERT INTO guilds (guild_id) VALUES (?)").run(guildId);

        return false;
    }

    if (!interaction.guild.roles.cache.find(role => role.id === (db.prepare(`SELECT verified_email_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct).verified_email_role))
        return false;
    if (!interaction.guild.roles.cache.find(role => role.id === (db.prepare(`SELECT mailman_admin_role FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct).mailman_admin_role))
        return false;
    if (!interaction.guild.channels.cache.find(channel => channel.id === (db.prepare(`SELECT mailman_logs_channel FROM guilds WHERE guild_id = ?`).get(interaction.guild.id) as dbStruct).mailman_logs_channel))
        return false;

    return guild.is_setup === 1;
}