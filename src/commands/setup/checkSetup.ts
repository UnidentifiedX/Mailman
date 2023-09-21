import { db, dbStruct } from "../../database/db";

export default (guildId: string) => {
    // Query the database
    const guild: dbStruct = db.prepare("SELECT is_setup FROM guilds WHERE guild_id = ?").get(guildId);

    // Check if the guild exists in the database
    if (!guild) {
        // Update the db
        db.prepare("INSERT INTO guilds (guild_id) VALUES (?)").run(guildId);

        return false;
    }

    return guild.is_setup === 1;
}