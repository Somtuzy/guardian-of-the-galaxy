import {
  Interaction,
  GuildMember,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { ONBOARDING_ROLE_ID } from "../config/environment";
import { messages, introFormat } from "../utils/constants";

// Handler for when the “Start Onboarding” button is clicked in the private channel.
export async function handleOnboardingButton(interaction: Interaction) {
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
      ephemeral: true,
    });
  }

  // Check if user has Onboarding role.
  if (!member.roles.cache.has(ONBOARDING_ROLE_ID)) {
    return interaction.reply({
      content: messages.alreadyOnboarded,
      ephemeral: true,
    });
  }

  // Send introduction prompt.
  const introEmbed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle(`Onboarding for ${member.user.username}`)
    .setDescription(
      `Please provide your introduction in the following format:\n\n` +
        introFormat +
        `\n\nYou can copy the template from the message below and change the samples to your specific details.`
    );

  // Disable the button.
  const disabledButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`start_onboarding_${member.id}`)
      .setLabel("Onboarding Started")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)
  );

  // Update the embed first.
  await interaction.update({
    embeds: [introEmbed],
    components: [disabledButtonRow],
  });

  // Then send the ephemeral template message.
  await interaction.followUp({
    content: introFormat,
    // ephemeral: true,
  });

  console.log(`✅ Onboarding prompt sent for ${member.user.tag}`);
}