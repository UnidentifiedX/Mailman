import { Client, ModalSubmitInteraction } from "discord.js";
import { Commands } from "../commands/commands";

export default (client: Client, interaction: ModalSubmitInteraction) => {
    const command = Commands.find(command => command.customID?.includes(interaction.customId));

    command.followUp(client, interaction);
}