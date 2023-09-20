import { ChatInputCommandInteraction, Client, CommandInteraction, Interaction } from "discord.js";
import { Commands } from "./commands";

export default (client: Client, interaction: ChatInputCommandInteraction) => {
    const command = Commands.find(command => command.data.name === interaction.commandName);
    
    command.execute(client, interaction);
}