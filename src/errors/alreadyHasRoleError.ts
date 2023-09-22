import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

export async function alreadyHasRoleError(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("Already verified!")
                .setDescription(`You already have the verified email role!`)
                .setColor(Colors.Red)
        ],
        ephemeral: true
    })
}