import fs from "fs";
import http from "http";

import { Attachment, BaseMessageOptions, User } from "discord.js";
import { BotMessage, sequelize } from "../db";
import { Transaction } from "sequelize";

type RegisterBotMsg = (key: string, content: string|null, attachment: Attachment|null, creator: User) => Promise<void>;
type IsKey = (key: string) => Promise<boolean>;
type GetMsg = (key: string) => Promise<BaseMessageOptions|null>;
type DelBotMsg = (key: string, user: User) => Promise<boolean>;
type GetBotMsg = (user: User|null) => Promise<Array<BotMessage>>;

class BaseError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

class KeyAlreadyExistError extends BaseError {
  constructor(public key: string, e?: string) {
    super(e);
  }
};

class KeyNotExitError extends BaseError {
  constructor(public key: string, e?: string) {
    super(e);
  }
}

export const registerBotMsg: RegisterBotMsg = async (key, content, attachment, creator) => {
  try {
    await sequelize.transaction(async t => {
      const [bm, _isNew] = await BotMessage.findOrCreate({
        where: {
          key: key,
        },
        defaults: {
          key: key,
          creatorId: creator.id,
        },
        transaction: t,
        lock: t.LOCK.NO_KEY_UPDATE
      });
      if (!_isNew) {
        throw new KeyAlreadyExistError(key);
      }
      await bm.update({
        content: content,
        url: !!attachment ? attachment.url : null,
        enable: true
      }, { transaction: t });
    });
  } catch (err) {
    throw err;
  }
};

export const isKey: IsKey = async (key: string) => {
  let one: BotMessage|null = null;
  await sequelize.transaction(async t => {
    one = await BotMessage.findOne({
      where: {
        key: key,
      },
      transaction: t,
      lock: t.LOCK.KEY_SHARE,
    });
  });
  return !!one;
};

export const getMsg: GetMsg = async (key: string) => {
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
    bmo = {
      content: !!one.content ? one.content : undefined,
      files: !!one.url ? [one.url] : undefined,
    };
  });
  return bmo;
};

export const delBotMsg: DelBotMsg = async (key, user) => {
  let num = 0;
  await sequelize.transaction(async t => {
    num += await BotMessage.destroy({
      where: {
        key: key,
        creatorId: user.id
      },
      transaction: t,
    });
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

export { KeyAlreadyExistError, KeyNotExitError };