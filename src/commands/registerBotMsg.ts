import { Attachment, CommandInteractionOptionResolver, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../core';
import { createWriteStream, unlink } from 'fs';
import https from 'https';

import { BotMessage, sequelize, Message as MessageModel, User as UserModel } from '../db';
import { KeyAlreadyExistError } from '../boterror/boterrors';
import path from 'path';

type Download = (url: string, filename: string) => Promise<void>;
type AddBotMsg = (key: string, content: string|null, attachment: Attachment|null, creator: User) => Promise<void>;
type DelBotMsg = (key: string, user: User) => Promise<boolean>;
type GetBotMsg = (user: User|null) => Promise<Array<BotMessage>>;

const download: Download = async (url, filename) => {
  return new Promise<void>((resolve, reject) => {
    https
      .request(url, (res) => {
        res
          .pipe(createWriteStream(filename))
          .on("close", resolve)
          .on("error", reject);
      })
      .end();
  });
};

const addBotMsg: AddBotMsg = async (key, content, attachment, creator) => {
  await sequelize.transaction(async t => {
    const one = await BotMessage.findOne({ where: { key: key }, transaction: t, lock: t.LOCK.KEY_SHARE });
    if (one) {
      //  keyが使われている場合
      throw new KeyAlreadyExistError(key);
    }
    //  作成者
    const [userModel, _isNew] = await UserModel.findOrCreate({
      where: {
        userId: creator.id, 
      },
      defaults: {
        userId: creator.id,
        privatechannelId: null,
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    //  メッセージ
    const messageModel = await MessageModel.create();
    if (attachment) {
      //  画像情報
      let extension = "";
      if (attachment.contentType == "image/png") {
        extension = "png";
      } else if (attachment.contentType == "image/jpeg") {
        extension = "jpg";
      } else {
        throw new TypeError();
      }
      await download(attachment.url, path.join("..", "attachments", attachment.id + "." + extension));
      await messageModel.update({
        uri: attachment.id + "." + extension,
      }, { transaction: t });
    }
    if (content) {
      //  テキスト
      await messageModel.update({
        content: content
      }, { transaction: t });
    }
    //  ボットメッセージ
    await BotMessage.create(
      {
        key: key,
        messageId: messageModel.id,
        enable: true,
        creatorId: userModel.userId
      }, { transaction: t }
    );
  });
} 

const delBotMsg: DelBotMsg = async (key, user) => {
  let num = 0;
  await sequelize.transaction(async t => {
    const botmessages = await BotMessage.findAll({
      where: {
        key: key,
        creatorId: user.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    num += botmessages.length;
    for(const botmessage of botmessages) {
      const messageModel = await MessageModel.findByPk(botmessage.messageId);
      if (messageModel?.uri) {
        //  画像削除
        const filepath = path.join("..", "attachments", messageModel.uri);
        unlink(filepath, err => {
          if (err) throw err;
          console.log(`deleted ${filepath}`); 
        });
      }
      await messageModel?.destroy({ transaction: t });
      await botmessage.destroy({ transaction: t });
    }
  });
  return num > 0;
};

export const getBotMsg: GetBotMsg = async (user = null) => {
  if (!!user) {
    return await sequelize.transaction(async t => {
      return await BotMessage.findAll({
        where: {
          creatorId: user.id,
        },
        transaction: t,
        lock: t.LOCK.KEY_SHARE
      });
    });
  } else {
    return await sequelize.transaction(async t => {
      return await BotMessage.findAll({
        transaction: t,
        lock: t.LOCK.KEY_SHARE
      })
    });
  }
}

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
          await interaction.reply({content: `${key}を追加しています`, ephemeral: true});
          if (!key) {
            //  えらー
            await interaction.editReply({ content: "keyが必要です"});
            return;
          }
          if (!attachment && !content) {
            //  えらー
            await interaction.editReply({ content: "attachmentまたはcontentが必要です"});
            return;
          }
          try {
            await addBotMsg(key, content, attachment, interaction.user);
          } catch (err) {
            if (err instanceof KeyAlreadyExistError) {
              await interaction.editReply(`すでにキーメッセージ:"${key}"が存在します`);
              return;
            } else {
              console.error(err);
              await interaction.editReply('Cant Registered');
              return;
            }
          }
          await interaction.followUp({ content: `新しいキーメッセージ:"${key}"を登録しました` });
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
            if (deled) await interaction.reply({ content: `キーメッセージ:"${key}"を削除しました.`, ephemeral: true });
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
              reply = "登録されているキーメッセージはありません.";
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