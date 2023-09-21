import Database from "better-sqlite3";

export const db = new Database("database.db")

export function initDatabase() {
    // create a verification_guilds table with guild_id and a json column that contains verified members and their emails
    db.prepare("CREATE TABLE IF NOT EXISTS verification_guilds (guild_id TEXT PRIMARY KEY, verified_members TEXT)").run();
}