import { Awaitable, ClientEvents, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export class EventListener {
  eventName: string;
  once: boolean;
  execute: (...args: any[]) => Awaitable<void>;
  constructor(eventName: string, once: boolean, execute: (...args: any[]) => Awaitable<void>) {
    this.eventName = eventName;
    this.once = once;
    this.execute = execute;
  }
}

export class CommandHandler {
  data: SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: CommandInteraction) => Promise<void>;
  constructor(data: SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, execute: (interaction: CommandInteraction) => Promise<void>) {
    this.data = data;
    this.execute = execute;
  }
}