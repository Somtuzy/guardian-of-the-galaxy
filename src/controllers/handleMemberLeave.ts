import { GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { ONBOARDING_ROLE_ID } from "../config/environment";

// Handler for when a user leaves the server.
export async function handleMemberLeave(member: GuildMember | PartialGuildMember) {
  try {
    // Check if the user had the Onboarding role.
    const hadOnboardingRole = member instanceof GuildMember
  ? member.roles.cache.has(ONBOARDING_ROLE_ID)
  : await member.guild.members
      .fetch(member.id)
      .then((fetchedMember) => fetchedMember.roles.cache.has(ONBOARDING_ROLE_ID))
      .catch(() => false);
      
    if (!hadOnboardingRole) {
      console.log(`No onboarding role for leaving user ${member.user.tag}`);
      return;
    }

    // Construct channel name using user data (available in both GuildMember and PartialGuildMember).
    const channelName = `onboarding-${member.user.username.toLowerCase()}-${member.id.slice(-4)}`;

    // Find the channel in the guild's cache.
    const channel = member.guild.channels.cache.find(
      (c) => c.name === channelName && c instanceof TextChannel
    ) as TextChannel | undefined;

    if (channel) {
      await channel.delete();
      console.log(`🗑️ Deleted onboarding channel ${channelName} for leaving user ${member.user.tag}`);
    } else {
      console.log(`No onboarding channel found for leaving user ${member.user.tag}`);
    }
  } catch (error) {
    console.error(`Error handling member leave for ${member.user.tag}:`, error);
  }
}