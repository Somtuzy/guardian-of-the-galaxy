import { Client, IntentsBitField } from "discord.js";
import { TOKEN } from "./config";
import {
  handleNewMember,
  handleOnboardingMessage,
  handleOnboardingButton,
  handleMemberLeave,
} from "./controllers";

// Initialize bot with required intents.
export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Attach event handlers.
bot.once("ready", () => {
  console.log(`✅ Bot is online as ${bot.user?.tag}`);
});

bot.on("guildMemberAdd", handleNewMember);
bot.on("interactionCreate", handleOnboardingButton);
bot.on("messageCreate", handleOnboardingMessage);
bot.on("guildMemberRemove", handleMemberLeave); // New handler for user leave

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

// Start the bot.
bot.login(TOKEN).catch((err) => {
  console.error("❌ Failed to login:", err);
  process.exit(1);
});