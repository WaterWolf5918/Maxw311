import { EmbedBuilder, GuildMember, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../command.js';
import { exec } from 'child_process';
import { ConfigHelper } from '../utils.js';
export const command: Command = {
    commandBuilder: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Level learderboard'),
    runnable: async function (interaction) {
        const xpStore = new ConfigHelper('./xp.json').getFull();
        const sorrted = {};
        const sortedKeys = Object.keys(xpStore).sort((a,b) => {return xpStore[b].xp - xpStore[a].xp;});
        const newList = {};

        for (let i=0;i<sortedKeys.length;i++){
            const e = sortedKeys[i];
            const user = await interaction.client.users.fetch(e);
            const name = user.username;
            newList[name] = {
                xp: xpStore[e].xp,
                level: Math.floor(Math.log(xpStore[e].xp)).toString(),
                messageCount: xpStore[e].messageCount
            };
        }


        const nameSortedList = Object.keys(newList).sort((a,b) => {return b.length - a.length;});
        const longestName = nameSortedList[0];
        const longestXP = newList[Object.keys(newList)[0]].xp.toString().length;
        const longestLevel = 5;
        const header = `${padUsername('Username',longestName)}      │     ${'XP'.padStart(longestXP,' ')} │ ${'Level'.padStart(longestLevel,' ')} │\n`;
        let message = '```';

        message += header;
        message += '┼'.padStart(longestName.length + 7,'━');
        message += '┼'.padStart(longestXP + 7,'━');
        message += '┼'.padStart(longestLevel + 3,'━');
        message += '\n';
        Object.keys(newList).forEach((e) => {
            const el = newList[e];
            message += `${padUsername(e,longestName)}      │     ${el.xp.toString().padStart(longestXP,' ')} │ ${el.level.padStart(longestLevel,' ')} │\n`;
        });
        message += '```';
        await interaction.reply(message);
    }
};

function padUsername(username: string,longestName: string){
    return username.padEnd(longestName.length,' ');
}

