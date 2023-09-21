import { db, dbStruct } from "./db";
import { GuildEntry } from "./guildEntry";

export function addGuildToDatabase(guild: GuildEntry) {
    // get the verified_members column from the guilds table
    const verifiedMembers: dbStruct = db.prepare("SELECT verified_members FROM guilds WHERE guild_id = ?").get(guild.guildId);

    // check if the guild exists in the database
    if (verifiedMembers) {
        // parse the json
        const verifiedMembersArr: string[] = JSON.parse(verifiedMembers.verified_members);
        verifiedMembersArr.push(guild.verifiedMember);

        // Update the db
        db.prepare("UPDATE guilds SET verified_members = ? WHERE guild_id = ?").run(JSON.stringify(verifiedMembersArr), guild.guildId);
    } else {
        // Update the db
        db.prepare("INSERT INTO guilds (guild_id, verified_members) VALUES (?, ?)").run(guild.guildId, JSON.stringify([guild.verifiedMember]));
    }
}