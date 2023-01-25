import { CommandInteractionOptionResolver, SlashCommandAttachmentOption, SlashCommandBuilder } from 'discord.js';
import { Command } from '../core';
import fs from 'fs';
import http from 'http';

import { delBotMsg, getBotMsg, KeyAlreadyExistError, registerBotMsg } from '../botmessage/botmessage';

export const command = new Command(
  new SlashCommandBuilder()
      .setName('botmsg')
      .setDescription('botmsg')
      .addSubcommand(cmd => 
          cmd.setName('add')
              .setDescription('add')
              .addStringOption(option =>
                  option.setName('key')
                      .setDescription('key')
                      .setRequired(true))
              .addAttachmentOption(option =>
                  option.setName('attachment')
                      .setDescription('attachment')
                      .setRequired(false)
              )
              .addStringOption(option=>
                  option.setName('content')
                      .setDescription('content')
                      .setRequired(false)
              ))
      .addSubcommand(cmd =>
          cmd.setName('del')
              .setDescription('del')
              .addStringOption(option =>
                  option.setName('key')
                      .setDescription('key')
                      .setRequired(true)))
      .addSubcommand(cmd =>
          cmd.setName('list')
              .setDescription('list')
              .addUserOption(option =>
                  option.setName('creator')
                      .setDescription('creator')
                      .setRequired(false))),
  async interaction => {
    const option = <CommandInteractionOptionResolver>interaction.options;
    const subcommand = option.getSubcommand();
    switch (subcommand) {
      case 'add':
        {
          const key = option.getString('key');
          const attachment = option.getAttachment('attachment');
          const content = option.getString('content');
          if (!key) {
            //  えらー
            await interaction.reply({ content: "keyが必要です", ephemeral: true });
            return;
          }
          if (!attachment && !content) {
            //  えらー
            await interaction.reply({ content: "attachmentまたはcontentが必要です", ephemeral: true });
            return;
          }
          try {
            await registerBotMsg(key, content, attachment, interaction.user);
          } catch (err) {
            if (err instanceof KeyAlreadyExistError) {
              await interaction.reply(`The key(${key}) already exists.`);
              return;
            }
          }
          await interaction.reply({ content: `Registered ${key}.`, ephemeral: true });
          break;
        }
      case 'del':
        {
          const key = option.getString('key');
          if (!key) {
            await interaction.reply({ content: "keyが必要です", ephemeral: true });
            return;
          }
          try {
            const deled = await delBotMsg(key, interaction.user);
            if (deled) await interaction.reply({ content: `Deleted "${key}".`, ephemeral: true });
            else await interaction.reply({ content: `"${key}" does not exist.\n※You can not delete a Message registered by others.`, ephemeral: true });
          } catch (err) {
            await interaction.reply({ content: "error", ephemeral: true });
          }
          break;
        }
      case 'list':
        {
          const creator = option.getUser('creator');
          try {
            const botMsgs = await getBotMsg(creator);
            let reply = "";
            if (botMsgs.length == 0) {
              reply = "There are no Registered Message!";
            } else {
              let num = 0;
              for (const botMsg of botMsgs) {
                reply += `${num++} ${botMsg.key}\n`;
              }
            }
            await interaction.reply({ content: reply, ephemeral: true });
          } catch (err) { 
            await interaction.reply({ content: "error", ephemeral: true });
          }
        }
    }
  }
);