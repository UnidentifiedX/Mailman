import { db, dbStruct } from "./db";

export function addGuildToDatabase(id: string) {
    // get the verified_members column from the guilds table
    const guild: dbStruct = db.prepare("SELECT * FROM guilds WHERE guild_id = ?").get(id);

    // check if the guild exists in the database
    if (!guild) {
        db.prepare("INSERT INTO guilds (guild_id) VALUES (?)").run(id);
    }
}