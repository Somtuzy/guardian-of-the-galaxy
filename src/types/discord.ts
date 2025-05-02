import { Client, ClientOptions, Collection } from 'discord.js';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export class ExtendedClient extends Client {
    public commands: Collection<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}