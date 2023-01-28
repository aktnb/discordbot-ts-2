import { Awaitable, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

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

export class Command {
  data: SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  handler: (interaction: CommandInteraction) => Promise<void>;
  /**
   * 
   * @param data 
   * @param handler 
   */
  constructor(data: SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, handler: (interaction: CommandInteraction) => Promise<void>) {
    this.data = data;
    this.handler = handler;
  }
}