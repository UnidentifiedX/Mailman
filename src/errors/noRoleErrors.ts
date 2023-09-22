import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

export async function noAdminRoleError(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("Error!")
                .setDescription(`You do not have the \`Mailman Admin\` role which is required to run this command`)
                .setColor(Colors.Red)
        ],
        ephemeral: true
    })
}   