import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

export async function notSetupError(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("Server not set up")
                .setDescription(`The server has not been set up yet. Please run \`/setup\` to setup the server.`)
                .setColor(Colors.Red)
        ]
    })
}