import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { exec } from 'child_process';
import { ConfigHelper } from '../utils.js';
export const command: Command = {
    commandBuilder: new SlashCommandBuilder()
        .setName('level2')
        .setDescription('Check Your Level'),
    runnable: async function (interaction) {
        // await interaction.deferReply();
        const xpStore = new ConfigHelper('./xp.json');
        const xp = xpStore.get(interaction.user.id)?.xp ?? 0;
        const messageCount = xpStore.get(interaction.user.id)?.messageCount ?? 0;
        const embed = new EmbedBuilder();
        embed.setTitle('Level');
        embed.setDescription(`Level of ${interaction.user.displayName}`);
        embed.addFields([
            {'name': 'XP', 'value' : xp.toString()},
            {'name': 'Level', 'value' : (Math.log(xp)).toString()},
            {'name': 'Message Count', 'value': messageCount.toString()}
        ]);
        await interaction.reply({'embeds': [embed]});
    }
};



function logistic(x) {
    return 1 / (1 + Math.exp(-x));
}