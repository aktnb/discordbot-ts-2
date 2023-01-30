import { BaseMessageOptions, Message } from "discord.js";
import path from "path";
import { KeyNotExitError } from "../boterror/boterrors";

import { EventListener } from "../core";
import { BotMessage, Message as MessageModel, sequelize } from "../db";

type GetMsg = (key: string) => Promise<BaseMessageOptions|null>;

const getMsg: GetMsg = async (key: string) => {
  let bmo: BaseMessageOptions|null = null;
  await sequelize.transaction(async t => {
    const one = await BotMessage.findOne({
      where: {
        key: key
      },
      transaction: t,
      lock: t.LOCK.KEY_SHARE
    });
    if (!one) throw new KeyNotExitError(key);
    const messageModel = await MessageModel.findByPk(one.messageId);
    if (!messageModel) throw new KeyNotExitError(key);
    bmo = {
      content: !!messageModel.content ? messageModel.content : undefined,
      files: !!messageModel.uri ? [path.join("..", 'attachments', messageModel.uri)] : undefined,
    };
  });
  return bmo;
};

export const listener = new EventListener(
  "messageCreate",
  false,
  async (msg: Message) => {
    if (msg.author.bot) return;
    try {
      const bmo = await getMsg(msg.content);
      if (!!bmo) await msg.reply(bmo);
    } catch (err) {

    }
  }
)
