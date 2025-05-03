import {
  SlashCommandBuilder,
  CommandInteraction,
  GuildMember,
  TextChannel,
  ChannelType,
  MessageFlags,
} from "discord.js";
import {
  WELCOME_ROLE_ID,
  ONBOARDING_ROLE_ID,
  MEMBER_ROLE_ID,
} from "../../config/environment";
import { handleNewMember } from "../../controllers";
import { setOnboardingRoles } from "../../models";

const data = new SlashCommandBuilder()
  .setName("onboard")
  .setDescription("Starts the onboarding process for existing users.");

async function execute(interaction: CommandInteraction) {
  try {
    // Defer reply to allow processing time
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // Ensure command is used in a guild
    if (!interaction.guild) {
      return interaction.editReply({
        content: "This command must be used in a server.",
      });
    }

    const channel = interaction.channel;

    // Check if the command is used in an onboarding channel
    if (channel instanceof TextChannel) {
      // Now TypeScript knows `channel` has a `name` property
      if (channel.name.startsWith("onboarding-")) {
        return interaction.editReply({
          content: "This command isn’t allowed in onboarding channels."
        });
      }
    }

    const member = interaction.member as GuildMember;

    // Check if user is already a member
    if (member.roles.cache.has(MEMBER_ROLE_ID)) {
      return interaction.editReply({ content: "You are already onboarded!" });
    }

    // Store current roles (excluding welcome and onboarding roles)
    const currentRoles = member.roles.cache
      .filter(
        (role) => role.id !== WELCOME_ROLE_ID && role.id !== ONBOARDING_ROLE_ID
      )
      .map((role) => role.id);
    await setOnboardingRoles(member.id, currentRoles);

    // Remove all roles except WELCOME_ROLE_ID
    try {
      await member.roles.set([WELCOME_ROLE_ID]);
    } catch (error) {
      console.error(`Error setting roles for ${member.user.tag}:`, error);
      return interaction.editReply({
        content: "Error updating roles. Please contact an admin.",
      });
    }

    // Start onboarding process
    try {
      const onboardingChannel = await handleNewMember(member);
      console.log({ onboardingChannel });

      await interaction.editReply({
        content: `Onboarding started! Click <#${onboardingChannel}> to proceed.`,
      });
    } catch (error) {
      console.error(`Error starting onboarding for ${member.user.tag}:`, error);
      return interaction.editReply({
        content: "Error starting onboarding. Please contact an admin.",
      });
    }

  } catch (error) {
    console.error("Error: error in onboard command:", { error });
  }
}

export = {
  data,
  execute,
};
