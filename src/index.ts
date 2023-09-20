import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, Interaction } from "discord.js"
import config from "./config.json";
import commandHandler from "./commands/commandHandler";
import { Commands } from "./commands/commands";
import modalHandler from "./modals/modalHandler";

const token = config.token;
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.on(Events.ClientReady, () => {
    // Register commands
    Commands.forEach(command => {
        client.application?.commands.create(command.data);
    });

    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isModalSubmit())
        modalHandler(client, interaction);
    if (interaction.isChatInputCommand())
        commandHandler(client, interaction);
});

client.login(token);