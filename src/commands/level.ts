import { EmbedBuilder, GuildMember, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../command.js';
import { exec } from 'child_process';
import { ConfigHelper } from '../utils.js';
export const command: Command = {
    commandBuilder: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check Your Level')
        .addUserOption(m => 
            m
                .setName('user')
                .setDescription('Get Level From User')
                .setRequired(false)
                
        ),
    runnable: async function (interaction) {
        // await interaction.deferReply();

        const user = await interaction.options.getUser('user') ?? null;
        
        if (user) {
            // await interaction.reply(user.username);
            const fetchedUser = await interaction.guild.members.fetch(user);
            const embed = createLevelEmbedFromGuildMember(fetchedUser);
            await interaction.reply({'embeds': [embed]});
            return;
        }
        const fetchedUser = await interaction.guild.members.fetch(interaction.user.id);
        const embed = createLevelEmbedFromGuildMember(fetchedUser);
        await interaction.reply({'embeds': [embed]});
    }
};


function createLevelEmbedFromGuildMember(member: GuildMember){
    const xpStore = new ConfigHelper('./xp.json');
    const xp = xpStore.get(member.id)?.xp ?? 0;
    const messageCount = xpStore.get(member.id)?.messageCount ?? 0;
    const embed = new EmbedBuilder();
    embed.setTitle('Level');
    embed.setDescription(`Level of ${member.displayName}`);
    embed.setColor(member.roles.highest.color ?? 'Red');
    // embed.setColor('Aqua');
    embed.addFields([
        {'name': 'Level', 'value' : Math.floor(Math.log(xp)).toString(),},
        {'name': 'XP', 'value' : xp.toString(),inline: true},
        {'name': 'Message Count', 'value': messageCount.toString(), inline: true},
        
        {'name': 'Legacy Level', 'value' : Math.floor(xp / 100).toString(), inline: true},
        
    ]);
    return embed;
}