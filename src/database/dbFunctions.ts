import { db, dbStruct } from "./db";
import { GuildEntry } from "./guildEntry";

export function addGuildToDatabase(entry: GuildEntry) {
    // get the verified_members column from the guilds table
    const guild: dbStruct = db.prepare("SELECT * FROM guilds WHERE guild_id = ?").get(entry.guildId);

    // check if the guild exists in the database
    if (!guild) {
        db.prepare("INSERT INTO guilds (guild_id) VALUES (?)").run(entry.guildId);
    }
        
}