import { EmbedBuilder, Message } from "discord.js";
import { WebhookClient } from "discord.js";
import {
  BIRTHDAY_AVATAR_URL,
  BIRTHDAY_BOT_ID,
  BIRTHDAY_CHANNEL_ID,
  BIRTHDAY_CHANNEL_WEBHOOK_ID,
  BIRTHDAY_CHANNEL_WEBHOOK_TOKEN,
  BIRTHDAY_GIF_URL,
} from "../config";

const birthdayWebhook = new WebhookClient({
  id: BIRTHDAY_CHANNEL_WEBHOOK_ID,
  token: BIRTHDAY_CHANNEL_WEBHOOK_TOKEN,
});

/**
 * Intercepts birthday bot messages and reposts a custom announcement.
 */
export async function handleBirthdayMessage(msg: Message) {
  // Only process the designated channel and birthday bot
  if (msg.channel.id !== BIRTHDAY_CHANNEL_ID) return;
  if (msg.author.id !== BIRTHDAY_BOT_ID) return;

  try {
    // Extract the user mention (embed-aware)
    let mention: string | null = null;

    // If embed exists, inspect description and fields
    if (msg.embeds.length) {
      const embed = msg.embeds[0];
      if (embed.description) {
        const m = embed.description.match(/<@!?(\d+)>/);
        if (m) mention = `<@${m[1]}>`;
      }
      if (!mention) {
        for (const field of embed.fields) {
          const f = field.value.match(/<@!?(\d+)>/);
          if (f) {
            mention = `<@${f[1]}>`;
            break;
          }
        }
      }
      if (!mention && embed.author?.name) {
        const username = embed.author.name.split("#")[0];
        mention = `@${username}`;
      }
    }

    // Fallback to plain content
    if (!mention && msg.content) {
      const m = msg.content.match(/<@!?(\d+)>/);
      if (m) mention = `<@${m[1]}>`;
    }

    if (!mention) return

    // Create custom message
    const content =
      `\n\n` +
      `Happy Birthday, ${mention}! 🎉\n\n` +
      `We wish you lots of joy and all the geeky goodness life has to offer. Have an amazing year ahead! 🎊 \n\n` +
      `_Make a wish, the birthday genie is listening 🥳_\n`;

    // Delete original and repost
    await Promise.all([
      msg.delete(),
      birthdayWebhook.send({
        username: "birthday genie",
        avatarURL: BIRTHDAY_AVATAR_URL,
        embeds: [
          new EmbedBuilder()
            .setColor("#3E91E9")
            .setTitle(`Birthday Announcement 🎂 🎁`)
            .setDescription(content)
            .setImage(BIRTHDAY_GIF_URL)
            .setTimestamp(),
        ],
      }),
    ]);
  } catch (err) {
    console.error("Failed to handle birthday message:", err);
  }
}
