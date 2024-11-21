import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Message, TextChannel, messageLink, Utils, AuditLogEvent, Guild, ChannelType, VoiceChannel, Invite } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { Logger } from './logger.js';
import { Command } from './command.js';
import { pathToFileURL } from 'url';
import { songConvert } from './modules/songConvert.js';

// Variables \\

/**@deprecated */
const __dirname = import.meta.dirname;

const config = loadConfig('./config.json');
const rest = new REST({ version: '9' }).setToken(config.token); // For slash commands
const commands: Command[] = [];

let stockChecker = false;

export function setStockChecker(value: boolean) {
    stockChecker = value;
}

export function getStockChecker(): boolean {
    return stockChecker;
}

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

// Functions \\

/**
 * @param file location of the config file
 */
function loadConfig(file) {
    if(!fs.existsSync(file)) {
        const json = {
            'token': 'BOT TOKEN',
            'clientID': 'CLIENT ID'
        };
        fs.writeFileSync(file,JSON.stringify(json,null,4));
        throw new Error(chalk.redBright('\nConfig File Not Found, Creating...\nPlease add your bot token and clientID to the config.'));
    }
    const json = JSON.parse(fs.readFileSync('./config.json').toString());
    if(json.clientID === 'CLIENT ID' || json.token === 'BOT TOKEN') throw new Error(chalk.redBright('\nPlaceholder Token And ClientID Still Inplace\nPlease add your bot token and clientID to the config.'));
    Logger.log('Config OK');
    return JSON.parse(fs.readFileSync('./config.json').toString());
}

async function loadCommands() {
    const files = fs.readdirSync('./dist/commands',{'withFileTypes': true});
    for(const file of files) {
        if (!file.isFile() || !file.name.endsWith('js')) continue;
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
            Routes.applicationGuildCommands(config.clientID,'1308592368504668300'),
            { body: t },
        );
        const timeEnded = Date.now();
        Logger.log('Successfully reloaded application (/) commands in ' + (chalk.blue(timeEnded - timeStarted)) + 'ms.');
    } catch (error) {
        console.error(error);
    }
}


function displayInvites(){
    client.guilds.cache.forEach((guild) => {
        guild.invites.fetch().then(invites => {
            invites.forEach(invite => {
                console.log(`<${invite.channel.name}> [${invite.inviter.username}]: ${invite.code}`);
            });
        });
    });
}


// Events \\

client.on('ready', () => {
    Logger.log(`Logged in as ${client.user.tag}!`);
});



client.on('messageCreate', async (message) => {
    const tokens = message.content.toLowerCase().split(' ');
    const messageString: string = message.content;
    // console.log(`[${message.channel.id}] <${message.author.displayName}> : ${message.content}`);
    try{
        songConvert(message);
    } catch(error) {
        message.reply(`<@877743969503682612>\n[Internal Error] songConvert Failed\nError:\n${error}`);
    }
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


// Init \\

initializeCommands();
client.login(config.token);