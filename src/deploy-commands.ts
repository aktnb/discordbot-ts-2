import fs from "fs";
import { token, client } from "./bot-config.json";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { Command } from "./core";

(async () =>{
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const rest = new REST({ version: "10" }).setToken(token);
  const commandFiles = fs.readdirSync("./commands");
  
  await Promise.all(commandFiles.map((file) =>
      import(`./commands/${file}`)
          .then(({ command }: { command: Command }) => {
            commands.push(command.data.toJSON());
          })
  ));

  await rest.put(Routes.applicationCommands(client), { body: commands })
      .then(() => console.log(`Registered ${commands.length} application commands.`))
      .catch(console.error);
})();
