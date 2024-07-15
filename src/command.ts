import { SlashCommandBuilder, CommandInteraction, CacheType, SlashCommandSubcommandsOnlyBuilder, SlashCommandSubcommandBuilder } from 'discord.js';



export type Command = { commandBuilder: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup' > | SlashCommandSubcommandsOnlyBuilder, runnable: CommandRunnable};
export type CommandRunnable = (interaction: CommandInteraction<CacheType>) => void;