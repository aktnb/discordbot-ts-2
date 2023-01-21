import { Client } from "discord.js";
import { EventListener } from "../core";

export const listener = new EventListener(
  "ready",
  true,
  async (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}.`);
  }
)