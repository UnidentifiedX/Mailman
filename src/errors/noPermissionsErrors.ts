import { ChatInputCommandInteraction, Colors, EmbedBuilder, Interaction, PermissionFlags, Permissions, PermissionsBitField } from "discord.js";

export async function noManageRolesPermissionsError(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("No permissions")
                .setDescription(`Mailman does not have the required permissions to run this command. \n**Required permission: Manage Roles**`)
                .setColor(Colors.Red)
        ]
    })
}

export async function noManageChannelsPermissionsError(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("No permissions")
                .setDescription(`Mailman does not have the required permissions to run this command. \n**Required permission: Manage Channels**`)
                .setColor(Colors.Red)
        ]
    })
}