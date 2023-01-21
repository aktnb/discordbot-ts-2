import fs from "fs";
import { Client, GatewayIntentBits } from "discord.js";
import { token } from "./bot-config.json";
import { EventListener } from "./core";

const CLIENT = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

async function addEventListener(args: void): Promise<number> {
  const eventFiles = fs.readdirSync("./events");

  await Promise.all(eventFiles.map(file =>
      import(`./events/${file}`)
          .then(({ listener }: { listener: EventListener}) => {
              if (listener.once) {
                CLIENT.once(listener.eventName, (...args) => listener.execute(...args));
              } else {
                CLIENT.on(listener.eventName, (...args) => listener.execute(...args));
              }
      })
  ));

  return eventFiles.length;
}

(async () => {
  const eventCount = await addEventListener();
  console.log(`Register ${eventCount} event.`);
})();

CLIENT.login(token);