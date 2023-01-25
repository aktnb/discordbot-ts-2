import { Message } from "discord.js";
import { getMsg } from "../botmessage/botmessage";
import { EventListener } from "../core";

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
