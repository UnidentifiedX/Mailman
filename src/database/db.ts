import Database from "better-sqlite3";

export const db = new Database("database.db")

export function initDatabase() {
    // create a verification_guilds table with guild_id and a json column that contains verified members and their emails
    db.prepare(`CREATE TABLE IF NOT EXISTS guilds (
        guild_id TEXT PRIMARY KEY,
        is_setup INT DEFAULT 0, 
        verified_email_role TEXT DEFAULT NULL, 
        mailman_admin_role TEXT DEFAULT NULL,
        mailman_logs_channel TEXT DEFAULT NULL,
        allowed_domains TEXT DEFAULT NULL)`).run();
}

export interface dbStruct {
    guild_id?: string,
    is_setup?: number,
    verified_email_role?: string,
    mailman_admin_role?: string,
    mailman_logs_channel?: string
}