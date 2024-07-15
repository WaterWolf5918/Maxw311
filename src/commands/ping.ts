import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { exec } from 'child_process';
export const command: Command = {
    commandBuilder: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the ping of the device, and whether the bot can respond to questions'),
    runnable: async function (interaction) {
        await interaction.deferReply();
        let msg = ''; // Why though?

        const regex = /Minimum = (\d.)ms, Maximum = (\d.)ms, Average = (\d.)ms/gm;

        exec('ping google.com -n 1', async (err, stdout, stderr) => {

            const match = stdout.match(regex);
            console.log(match[0].match(/[0-9]+/g));
            msg += `Discord Ping: ${Math.round(interaction.client.ws.ping)}ms\n`;
            msg += `Google Ping: ${match[0].match(/[0-9]+/g)[0]}ms\n`;


            await interaction.followUp(msg);
        });
        // interaction.reply('Sorry but as of 5/27/2024 this service has been discontinued.');
    }
};