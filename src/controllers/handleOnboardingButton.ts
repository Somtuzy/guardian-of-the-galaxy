import {
  Interaction,
  GuildMember,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import { ONBOARDING_ROLE_ID, WELCOME_ROLE_ID } from "../config/environment";
import { introFormat, introTemplate } from "../utils/constants";

// Handler for when the “Start Onboarding” button is clicked in the private channel.
export async function handleOnboardingButton(interaction: Interaction) {
  try {
  if (
    !interaction.isButton() ||
    !interaction.customId.startsWith("start_onboarding_")
  )
    return;

  const member = interaction.member as GuildMember;
  const userId = interaction.customId.split("_")[2]; // Extract userId from customId

  // Ensure only the channel owner clicks the button.
  if (member.id !== userId) {
    return interaction.reply({
      content: "This button is not for you!",
      flags: MessageFlags.Ephemeral
    });
  }

  const hasOnboardingRole = member.roles.cache.has(ONBOARDING_ROLE_ID);
  const onboardingRole = member.guild.roles.cache.get(ONBOARDING_ROLE_ID);

  if (!onboardingRole) {
    console.error("Onboarding role not found.");
    return interaction.reply({
      content: "Error: Onboarding role not configured.",
      flags: MessageFlags.Ephemeral
    });
  }

  // Prepare the introduction prompt
  const introEmbed = new EmbedBuilder()
    .setColor("#3E91E9")
    .setTitle(`Onboarding for ${member.user.username}`)
    .setDescription(
      `We'd like to know a little about you, Geek. Please introduce yourself using the following format:\n\n` +
        introFormat +
        `Do not forget to attach your picture.\n\n` +
        `\nDon't panic, we've sent you an introduction template so you can copy, paste and edit in your details to avoid mistakes.`
    );

  // Disable the button.
  const disabledButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`start_onboarding_${member.id}`)
      .setLabel("Onboarding Started")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)
  );

  // If user already has ONBOARDING_ROLE_ID, resend the prompt without changing roles
  if (hasOnboardingRole) {
    await interaction.update({
      embeds: [introEmbed],
      components: [disabledButtonRow],
    });
    await interaction.followUp({
      content: introFormat,
      flags: MessageFlags.Ephemeral
    });
    console.log(`ℹ️ Onboarding prompt resent for ${member.user.tag}`);
    return;
  }

  // Transition to onboarding state
  await Promise.all([
    member.roles.remove(WELCOME_ROLE_ID).catch(() => {}), // Safe removal if not present
    member.roles.add(ONBOARDING_ROLE_ID),
  ]);

  // Update the embed first.
  await interaction.update({
    embeds: [introEmbed],
    components: [disabledButtonRow],
  });

  await interaction.followUp({
    content: introTemplate,
    flags: MessageFlags.Ephemeral
  });

  console.log(`✅ Onboarding started for ${member.user.tag}`);
} catch(error) {
  console.error("Error in handleOnboardButton", { error });
}
}