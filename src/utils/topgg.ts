import { Client } from "discord.js";
import config from "../config.json";

export default (client: Client) => {
    if (!config.topgg_token) return;

    const options = {
        method: "POST",
        body: JSON.stringify({
            server_count: client.guilds.cache.size
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": config.topgg_token
        }
    }

    fetch(`https://top.gg/api/bots/${client.user.id}/stats`, options)
        .then(res => console.log(`[TOP.GG] Posted server count to topgg. Status code: ${res.status}`))
}