import { GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { ONBOARDING_ROLE_ID, WELCOME_ROLE_ID } from "../config/environment";

// Handler for when a user leaves the server.
export async function handleMemberLeave(member: GuildMember | PartialGuildMember) {
  try {
    // Check if the user had the Onboarding related roles.
    const hadWelcomeRole = member.roles.cache.has(WELCOME_ROLE_ID)
    const hadOnboardingRole = member.roles.cache.has(ONBOARDING_ROLE_ID)
    
    if (!hadWelcomeRole && !hadOnboardingRole) {
      console.log(`No welcome or onboarding role for leaving user ${member.user.tag}`);
      return;
    }

    // Construct channel name using user data.
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