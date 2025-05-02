import { Message, TextChannel, EmbedBuilder } from "discord.js";
import {
  INTRO_CHANNEL_ID,
  COMMUNITY_CHANNEL_ID,
  ONBOARDING_ROLE_ID,
  MEMBER_ROLE_ID
} from "../config/environment";
import { introFormat, parseIntro, removeUnderScore } from "../utils";
import {
  deleteOnboardingRoles,
  getOnboardingRoles
} from "../models";

const REQUIRED_FIELDS = [
  "fullname",
  "nickname",
  "gender",
  "location",
  "state_of_origin",
  "birthday",
  "skills",
  "linkedIn",
];

// Handler for messages in any onboarding channel.
export async function handleOnboardingMessage(message: Message) {
  if (
    message.author.bot ||
    !(message.channel instanceof TextChannel) ||
    !message.channel.name.startsWith("onboarding-")
  ) {
    return;
  }

  // Extract the ID suffix from the channel name
  const channelNameParts = message.channel.name.split("-");
  const idSuffix = channelNameParts[channelNameParts.length - 1];

  // Check if the sender's ID ends with the suffix
  const senderIdSuffix = message.author.id.slice(-4);
  if (senderIdSuffix !== idSuffix && !message.author.bot) {
    return;
  }

  const member = message.member!;
  console.log("message member:", { user: member.displayName });

  if (!member.roles.cache.has(ONBOARDING_ROLE_ID)) {
    return message.reply("Please click the onboard button to start");
  }

  // 1. Validate intro format.
  const submitted = parseIntro(message.content);
  const missing = REQUIRED_FIELDS.filter(
    (field) =>
      !(field.toLowerCase() in submitted) || submitted[field]?.length === 0
  );
  if (missing?.length) {
    // Tell them exactly what’s missing.
    return message.reply(
      `Please include all fields. You’re missing: **${removeUnderScore(missing.join(
        ", "
      ))}**\n\n` +
        "Format:\n" +
        // REQUIRED_FIELDS.map((f) => `${f}: ...`).join("\n") +
        introFormat
    );
  }

  // 2. Update roles: add MEMBER_ROLE_ID, remove ONBOARDING_ROLE_ID, restore previous roles
  const previousRoles = (await getOnboardingRoles(member.id)) || [];
  const rolesToAssign = [MEMBER_ROLE_ID, ...previousRoles];

  try {
    await Promise.allSettled([
      member.roles.set(rolesToAssign),
      member.roles.remove(ONBOARDING_ROLE_ID),
    ]);

    // Clear stored roles
    await deleteOnboardingRoles(member.id);
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
        .setTitle(`Introduction by <@${member.user.id}> (${member.user.tag})`)
        .setDescription(message.content),
    ],
  });

  // 4. Confirm in the private channel, then delete it.
  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#00FF00")
        .setDescription(
          `✅ Welcome aboard, ${member.user}!\n Your introduction is posted in <#${INTRO_CHANNEL_ID}>. ` +
            `Go to <#${COMMUNITY_CHANNEL_ID}> to connect with the community!\n\n` +
            `NB: This channel will self destruct in 60 seconds.`
        ),
    ],
  });

  try {
    setTimeout(async () => {
      await message.channel?.delete();
      console.log(`🗑️ Deleted onboarding channel for ${member.user.tag}`);
    }, 60000);
  } catch (err) {
    console.warn(`Failed to delete ${message.channel.id}:`, err);
  }
}
