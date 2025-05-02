import express from "express";
import fs from "node:fs";
import path from "node:path";
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"

import {
  Events,
  GatewayIntentBits,
  IntentsBitField,
  MessageFlags,
} from "discord.js";
import { ExtendedClient, Command } from "./types/discord";
import { API_VERSION, BOT_TOKEN, NODE_ENV } from "./config";
import {
  handleNewMember,
  handleOnboardingMessage,
  handleOnboardingButton,
  handleMemberLeave,
} from "./controllers";
import { startDatabase } from "./config";
import "./wakey";
import { ping } from "./controllers/ping";


// Initialize bot with required intents
export const bot = new ExtendedClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.Guilds,
  ],
});

// Load commands from the commands directory
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs
  .readdirSync(commandsPath)
  .filter((folder) =>
    fs.statSync(path.join(commandsPath, folder)).isDirectory()
  );

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const fileExtension = NODE_ENV === "development" ? ".ts" : ".js"
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(fileExtension));
  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command: Command = require(filePath);
    bot.commands.set(command.data.name, command);
  }
}

// Attach event handlers
bot.once(Events.ClientReady, () => {
  console.log(`✅ Bot is online as ${bot.user?.tag} 🎊`);
});

bot.on("guildMemberAdd", handleNewMember);
bot.on("interactionCreate", handleOnboardingButton);
bot.on("messageCreate", handleOnboardingMessage);
bot.on("guildMemberRemove", handleMemberLeave);

// Handle interactions (buttons and slash commands)
bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = bot.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// Global error handling.
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Promise Rejection:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error);
});

bot.on("error", (error) => {
  console.warn("⚠️ Discord.js client error:", error);
});

bot.on("shardError", (error) => {
  console.error("⚠️ WebSocket connection error:", error);
});

// Initialize Express app
const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define a simple route to confirm the server is running
app.get(`/api/${API_VERSION}/ping`, ping);

app.get(`/api/${API_VERSION}/health`, (req, res) => {
  res.sendStatus(200);
});

// Start the Express server on the port provided by Render (or default to 3000 locally)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  startDatabase();
  console.info(`Express server listening on port ${port} 🎉`);
  console.info({ NODE_ENV })
});

// Start the bot.
bot.login(BOT_TOKEN).catch((err) => {
  console.error("❌ Failed to login:", err);
  process.exit(1);
});
