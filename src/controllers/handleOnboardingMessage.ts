import {
  Message,
  TextChannel,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import {
  INTRO_CHANNEL_ID,
  COMMUNITY_CHANNEL_ID,
  ONBOARDING_ROLE_ID,
  WELCOME_ROLE_ID,
  MEMBER_ROLE_ID,
} from "../config/environment";
import { introFormat, parseIntro } from "../utils/constants";

const REQUIRED_FIELDS = [
  "Name",
  "Gender",
  "Location",
  "Birthday",
  "Skill",
  "LinkedIn",
];

// Regex to strictly validate the 6-field introduction template.
const INTRO_REGEX =
  /^name:\s*.+\r?\ngender:\s*.+\r?\nstate of origin:\s*.+\r?\nbirthday:\s*.+\r?\nskill:\s*.+\r?\nlinkedin:\s*.+/i;

// Handler for messages in any onboarding channel.
export async function handleOnboardingMessage(message: Message) {
  if (
    message.author.bot ||
    !(message.channel instanceof TextChannel) ||
    !message.channel.name.startsWith("onboarding-")
  )
    return;

  const member = message.member!;
  if (!member.roles.cache.has(ONBOARDING_ROLE_ID)) return;

  // 1. Validate intro format.
  const submitted = parseIntro(message.content);
  console.log({ submitted });

  const missing = REQUIRED_FIELDS.filter(
    (field) =>
      !(field.toLowerCase() in submitted) || submitted[field]?.length === 0
  );
  if (missing?.length) {
    // Tell them exactly what’s missing.
    return message.reply(
      `🚫 Please include all fields. You’re missing: **${missing.join(
        ", "
      )}**\n\n` +
        "Format:\n" +
        REQUIRED_FIELDS.map((f) => `${f}: ...`).join("\n")
    );
  }

  // 2. Batch role updates: add MEMBER, remove onboarding & welcome.
  try {
    await Promise.all([
      member.roles.add(MEMBER_ROLE_ID),
      member.roles.remove([ONBOARDING_ROLE_ID, WELCOME_ROLE_ID]),
    ]);
  } catch (error) {
    console.error(`Error updating roles for ${member.user.tag}:`, error);
    return message.reply("Error updating roles. Please contact an admin.");
  }

  // 3. Post their intro into the central introductions channel.
  const introChannel = message.guild!.channels.cache.get(
    INTRO_CHANNEL_ID
  ) as TextChannel;
  if (!introChannel) {
    console.error(`Introductions channel ${INTRO_CHANNEL_ID} not found.`);
    return message.reply(
      "Error: Introductions channel not found. Please contact an admin."
    );
  }
  await introChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle(`Introduction by ${member.user.tag}`)
        .setDescription(message.content),
    ],
  });

  // 4. Confirm in the private channel, then delete it.
  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#00FF00")
        .setDescription(
          `✅ Welcome aboard, ${member.user}! Your introduction is posted in <#${INTRO_CHANNEL_ID}>. ` +
            `Join <#${COMMUNITY_CHANNEL_ID}> to connect with the community!`
        ),
    ],
  });

  try {
    setTimeout(async () => {
      await message.channel.delete();
    }, 60000);
  } catch (err) {
    console.warn(`Failed to delete ${message.channel.id}:`, err);
  }

  console.log(`🗑️ Deleted onboarding channel for ${member.user.tag}`);
}
