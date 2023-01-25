import fs from "fs";
import { Client, Collection, CommandInteraction, GatewayIntentBits } from "discord.js";
import { token } from "./bot-config.json";
import { Command, EventListener } from "./core";

import { dbInit } from "./db";

const CLIENT = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages
]});

async function addEventListener(): Promise<number> {
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

async function addCommandHandler(): Promise<number> {
  const commands = new Collection<string, Command>();
  const commandFiles = fs.readdirSync("./commands");
  await Promise.all(commandFiles.map(async file => {
      import(`./commands/${file}`)
        .then(({ command }: { command: Command}) => {
            commands.set(command.data.name, command);
        });
  }));

  CLIENT.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.handler(<CommandInteraction>interaction);
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: "There was an error while executing this command!!!",
                                ephemeral: true });
    }
  });

  return commands.size;
}

(async () => {
  const eventCount = await addEventListener();
  console.log(`Registered ${eventCount} events.`);
  const commandCount = await addCommandHandler();
  console.log(`Registered ${commandCount} commands`);

  await dbInit();
  console.log(`Connected to PostgreSQL.`);
})();

CLIENT.login(token);