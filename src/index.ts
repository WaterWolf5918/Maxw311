import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Message, TextChannel, messageLink, Utils, AuditLogEvent, Guild, ChannelType, VoiceChannel, Invite } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { Logger } from './logger.js';
import { Command } from './command.js';
import { pathToFileURL } from 'url';


/**@deprecated */
// const __dirname = import.meta.dirname;



async function loadCommands() {
    const files = fs.readdirSync('./dist/commands',{'withFileTypes': true});
    for(const file of files) {
        if (!file.isFile() || !file.name.endsWith('js')) return;
        const command: Command = (await import(`./commands/${file.name}`)).command;
        if (command == undefined) { Logger.error('Error loading command file "' + file.name + '.js"!'); return; }
        commands.push(command);
    }
}

async function initializeCommands() {
    await loadCommands();
    try {
        
        Logger.log('Started refreshing application (/) commands.');
        Logger.log('Commands:');
        for (let i = 0; i < commands.length; i++) {
            try {
                Logger.log(` - ${chalk.white(commands[i].commandBuilder.name)} : ${chalk.gray(commands[i].commandBuilder.description)}`);
            } catch (e) {
                Logger.error('An unknown error occured!');
                Logger.error('-------------------------');
                Logger.error(e);
            }
        }

        const timeStarted = Date.now();

        const t = [];

        for (let i = 0; i < commands.length; i++) {
            if (commands[i].commandBuilder.name !== undefined) {
                t.push(commands[i].commandBuilder);
            }
        }

        await rest.put(
            Routes.applicationGuildCommands(config.clientID,'1235590917839261769'),
            { body: t },
        );
        const timeEnded = Date.now();
        Logger.log('Successfully reloaded application (/) commands in ' + (chalk.blue(timeEnded - timeStarted)) + 'ms.');
    } catch (error) {
        console.error(error);
    }
}


const config = JSON.parse(fs.readFileSync('./config.json').toString());
const rest = new REST({ version: '9' }).setToken(config.token); // For slash commands
const commands: Command[] = [];

initializeCommands();

// console.clear();

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution
    ]
});

client.on('ready', () => {
    Logger.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach((guild) => {
        

        guild.invites.fetch().then(invites => {
            invites.forEach(invite => {
                console.log(`<${invite.channel.name}> [${invite.inviter.username}]: ${invite.code}`);
            });
        });
    });
    // initializeWebsockets(client)
});


const tempChannels: VoiceChannel[] = [];

client.on('voiceStateUpdate',async (oldState,newState) => {
    if (newState.channel !== undefined) {
        if (newState.channelId == '1239514510381809694'){
            console.log('create new channel');
            const category = newState.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == '1235590918447300721');
            const channel = await newState.guild.channels.create({'name': `${newState.member.displayName}@${newState.guild.name}`,'type': ChannelType.GuildVoice,'parent': newState.channel.parent});
            newState.member.voice.setChannel(channel);
            tempChannels.push(channel);
        }
    }

    if (oldState.channel !== null) {
        tempChannels.forEach(channel => {
            if (channel.id == oldState.channel.id) {
                if(channel.members.size == 0){
                    channel.delete('No Users Left In Temp Channel');
                }
            }
        });
    }
});




client.on('messageCreate', async (message) => {
    const tokens = message.content.toLowerCase().split(' ');
    const messageString: string = message.content;
    console.log(`[${message.channel.id}] <${message.author.displayName}> : ${message.content}`);
    songConvert(message);
});


async function songConvert(message:Message){
    const ytMusicRegex = /https:\/\/music\.youtube\.com\S*/gm;
    const spotifyRegex = /https:\/\/open\.spotify\.com\S*/gm;
    const appleMusicRegex = /https:\/\/music\.apple\.com\S*/gm;
    const ytMusic = ytMusicRegex.exec(message.content);
    const spotify = spotifyRegex.exec(message.content);
    const appleMusic = appleMusicRegex.exec(message.content);
    // console.log(appleMusic);






    if (ytMusic !== null){
        const list = await songLink(message.content);
        const embed = new EmbedBuilder().setTitle('Universal Music Links');
        let body = '';
        Object.keys(list).forEach((service,i) => {
            body += `* [${service}](<${Object.values(list)[i]}>)\n`;
        });
        embed.setDescription(body);
        embed.setFooter({
            text: 'Powered by Songlink',
        });
        message.reply({embeds: [embed]});
    }
    else if (spotify !== null){
        const list = await songLink(message.content);
        const embed = new EmbedBuilder().setTitle('Universal Music Links');
        let body = '';
        Object.keys(list).forEach((service,i) => {
            body += `* [${service}](<${Object.values(list)[i]}>)\n`;
        });
        embed.setDescription(body);
        embed.setFooter({
            text: 'Powered by Songlink',
        });
        message.reply({embeds: [embed]});
    }
    else if(appleMusic !== null){
        const list = await songLink(message.content);
        const embed = new EmbedBuilder().setTitle('Universal Music Links');
        let body = '';
        Object.keys(list).forEach((service,i) => {
            body += `* [${service}](<${Object.values(list)[i]}>)\n`;
        });
        embed.setDescription(body);
        embed.setFooter({
            text: 'Powered by Songlink',
        });
        message.reply({embeds: [embed]});
    }
    // if()
}

async function songLink(url){
    const list = {
        Youtube: '',
        YoutubeMusic: '',
        Spotify: '',
        AppleMusic: '',
        AmazonMusic: ''

    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`);
    data = await data.json();
    list.Youtube = (data.linksByPlatform.youtube === undefined ? 'https://en.wikipedia.org/wiki/HTTP_404' :data.linksByPlatform.youtube.url);
    list.YoutubeMusic = (data.linksByPlatform.youtubeMusic === undefined ? 'https://en.wikipedia.org/wiki/HTTP_404' :data.linksByPlatform.youtubeMusic.url);
    list.Spotify = (data.linksByPlatform.spotify === undefined ? 'https://en.wikipedia.org/wiki/HTTP_404' :data.linksByPlatform.spotify.url);
    list.AppleMusic = (data.linksByPlatform.appleMusic === undefined ? 'https://en.wikipedia.org/wiki/HTTP_404' :data.linksByPlatform.appleMusic.url);
    list.AmazonMusic = (data.linksByPlatform.amazonMusic === undefined ? 'https://en.wikipedia.org/wiki/HTTP_404' :data.linksByPlatform.amazonMusic.url);
    return list;
}



client.on('messageDelete',async (message) => {

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    for (let i = 0; i < commands.length; i++) {
        if (interaction.commandName == commands[i].commandBuilder.name) {
            commands[i].runnable(interaction);
            return;
        }
    }
});



client.login(config.token);