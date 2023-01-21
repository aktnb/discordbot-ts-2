import { Client, GatewayIntentBits } from "discord.js";
import { token } from "./bot-config.json";

const CLIENT = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

CLIENT.login(token);