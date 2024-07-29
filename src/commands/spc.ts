import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { devices, firefox } from 'playwright';
import { unlink, writeFileSync } from 'fs';
import { Logger } from '../logger.js';

async function downloadImage(url,file) {
    const buffer = await (await fetch(url)).arrayBuffer();
    writeFileSync(file,Buffer.from(buffer));
    await new Promise(resolve => setTimeout(resolve,350));
}

export const command: Command = {
    commandBuilder: new SlashCommandBuilder()
        .setName('spc')
        .setDescription('Gets the current map from the Storm Prediction Center.')
        .addIntegerOption(option => 
            option.setName('day')
                .setDescription('SPC day to get')
                .setRequired(false)
                .setChoices(
                    {name: 'Day 1', value: 1},
                    {name: 'Day 2', value: 2},
                    {name: 'Day 3', value: 3}
                )
        ),


    runnable: async function (interaction) {
        interaction.reply('Creating fake browser and getting results. Please Wait...');
        let value = '1';
        if (interaction.options.get('day') != null){value = interaction.options.get('day').value.toString();}
        
        const url = `https://www.spc.noaa.gov/products/outlook/day${value}otlk.html`;
        const browser = await firefox.launch({ 'headless': true });
        const context = await browser.newContext(devices['Desktop Firefox']);
        const page = await context.newPage();
        interaction.editReply('Browser opened, Waiting For Page Load...');
        await page.goto(url,{'waitUntil': 'networkidle'});
        //@ts-expect-error fdsfswd
        const title = await page.$eval('.zz', text => text.innerText);
        //@ts-expect-error fdsfswd
        const image = await page.$eval('#main', img => img.src);
        await context.close();
        await browser.close();
        const filename = `spc${Date.now()}.gif`;

        interaction.editReply('Saving Local Image...');
        downloadImage(image,`./spc/${filename}`)
            .then(async () => {
                interaction.editReply('Saved Image, Uploading To Discord...');
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'Storm Prediction Center',
                        iconURL: 'https://www.spc.noaa.gov/nwscwi/noaaleft.jpg',
                    })
                    .setTitle(title)
                    .setURL(`https://www.spc.noaa.gov/products/outlook/day${value}otlk.html`)
                    .setImage(`attachment://${filename}`)
                    .setColor('#0000f4');
                await interaction.editReply({ embeds: [embed],content: ' ', files: [`./spc/${filename}`] });
            })
            .then(() => {
                unlink(`./spc/${filename}`,() => {
                    Logger.log(`Deleted Temp Image: "./spc/${filename}"`);
                });
            });
        
    }
};