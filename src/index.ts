import { ActivityType, ChannelType, ChatInputCommandInteraction, Client, Colors, EmbedBuilder, Events, GatewayIntentBits, Interaction, PermissionFlagsBits, TextChannel } from "discord.js"
import config from "./config.json";
import commandHandler from "./commands/commandHandler";
import { Commands } from "./commands/commands";
import modalHandler from "./modals/modalHandler";
import { db, initDatabase } from "./database/db";
import verificationListCleaner from "./commands/verify/verificationListCleaner";
import { addGuildToDatabase } from "./database/dbFunctions";

const token = config.token;
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.on(Events.ClientReady, () => {
    // Register commands
    Commands.forEach(command => {
        client.application?.commands.create(command.data);
    });

    // Initialize database
    initDatabase();

    // Run verification list cleaner
    verificationListCleaner();

    // Set up activity
    client.user?.setActivity("your emails", { type: ActivityType.Listening });

    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isModalSubmit())
        modalHandler(client, interaction);
    if (interaction.isChatInputCommand())
        commandHandler(client, interaction);
});

client.on(Events.GuildCreate, async (guild) => {
    // Add guild to database
    addGuildToDatabase(guild.id);

    // Send welcome message
    const channel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me)?.has(PermissionFlagsBits.SendMessages))! as TextChannel;

    if(channel) {
        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Thanks for adding me!")
                    .setDescription("To get started, run `/setup` to set up the bot for your server.")
                    .setColor(Colors.White)
            ]
        }).catch(() => {
            console.log(`Couldn't send welcome message in ${guild.name}.`);
        });
    }
});

client.on(Events.GuildDelete, async (guild) => {
    // Delete guild from database
    db.prepare("DELETE FROM guilds WHERE guild_id = ?").run(guild.id);
});

client.login(token);