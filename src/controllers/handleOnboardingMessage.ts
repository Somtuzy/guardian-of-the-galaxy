import { Message, TextChannel, EmbedBuilder } from "discord.js";
import {
  INTRO_CHANNEL_ID,
  COMMUNITY_CHANNEL_ID,
  ONBOARDING_ROLE_ID,
  MEMBER_ROLE_ID
} from "../config/environment";
import { introFormat, parseIntro } from "../utils";
import {
  deleteOnboardingRoles,
  getOnboardingRoles
} from "../models";

// Handler for messages in any onboarding channel.
export async function handleOnboardingMessage(message: Message) {
  try {
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

    if (!member.roles.cache.has(ONBOARDING_ROLE_ID)) {
      return message.reply("Please click the onboard button to start");
    }

    // 1. Validate intro format
    let { data, errors, errorCount } = parseIntro(message.content);
    const attachments = message.attachments;

    // Check for exactly one image attachment
    if (attachments.size !== 1) {
      errors.push(`${errorCount}. Please attach exactly one image to your introduction (e.g., a profile picture). You attached ${attachments.size} file(s).`);
      errorCount++
    } else {
      const attachment = attachments.first()!;
      const validImageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(attachment.contentType || '')) {
        errors.push(`${errorCount}. The attached file must be an image (PNG, JPG, GIF, or WebP). You attached a ${attachment.contentType || 'unknown'} file.`);
        errorCount++
      }
    }

    if (errors.length) {
      const errorMessage = errors.join('\n\n');
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Oops! Let's Fix Your Introduction")
            .setDescription(
              `**We found a few issues with your introduction:**\n\n${errorMessage}\n\n` +
              `**Please follow this format and attach an image:**\n\`\`\`\n${introFormat}\`\`\`\n` +
              `**Tips**:\n- Include all fields with valid values (no placeholders).\n- Attach one image (PNG, JPG, GIF, or WebP).\n`
            )
        ]
      })

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
      return message.reply("Looks like we caught a bug while updating your roles. Please contact an admin.");
    }

    // 3. Post their intro into the central introductions channel.
    const introChannel = message.guild!.channels.cache.get(
      INTRO_CHANNEL_ID
    ) as TextChannel;
    if (!introChannel) {
      console.error(`Error: Introductions channel ${INTRO_CHANNEL_ID} not found.`);
      return message.reply(
        "Looks like we caught a bug trying to post your introduction to our introductions channel. Please contact an admin."
      );
    }
    const attachment = attachments.first()!;
    await introChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#3E91E9")
          .setTitle(`Introduction by <@${member.user.id}> (${member.user.tag})`)
          .setDescription(message.content)
          .setImage(attachment.url)
          .setTimestamp(),
      ],
    });

    // 4. Confirm in the private channel, then delete it.
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#3E91E9")
          .setDescription(
            `✅ Welcome aboard, ${member.user}!\n\n Your introduction has been posted to <#${INTRO_CHANNEL_ID}>. ` +
            `Head to <#${COMMUNITY_CHANNEL_ID}> to connect with your trybe!\n\n` +
            `P.S. This channel will self destruct in 60 seconds 😏`
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

  } catch (error) {
    console.error(`Error: eerror in handlingOnboardingMembers`, { error });
  }
}
