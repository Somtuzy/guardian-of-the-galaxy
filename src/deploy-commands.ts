import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { BOT_TOKEN, CLIENT_ID, SERVER_ID } from "./config";
import { Command } from "./types/discord";

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs
  .readdirSync(commandsPath)
  .filter((folder) =>
    fs.statSync(path.join(commandsPath, folder)).isDirectory()
  );

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command: Command = require(filePath);
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, SERVER_ID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
