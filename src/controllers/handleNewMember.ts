import {
  GuildMember,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
} from "discord.js";
import {
  ONBOARDING_CATEGORY_ID,
  WELCOME_ROLE_ID,
  SERVER_NAME,
} from "../config/environment";
import { messages, rules } from "../utils/constants";

// Handler for when a new user joins the guild.
export async function handleNewMember(member: GuildMember) {
  try {
    // 1. Fetch roles from cache (must exist on ready).
    const welcomeRole = member.guild.roles.cache.get(WELCOME_ROLE_ID);
    if (!welcomeRole) {
      console.error("Welcome role not found.");
      return;
    }
console.log({welcomeRole})
    // 2. Assign "Onboarding" (locks them out) + "Welcome" badge.
    await member.roles.add(WELCOME_ROLE_ID)
console.log({WELCOME_ROLE_ID})
    // 3. Build a deterministic channel name.
    const channelName = `onboarding-${member.user.username.toLowerCase()}-${member.id.slice(
      -4
    )}`;
    const isExistingChannel = member.guild.channels.cache.find(
      (c) => c.name === channelName
    ) as TextChannel;

    // 4. Prevent creating duplicates.
    if (isExistingChannel) {
      console.log(
        `Channel ${channelName} already exists for ${member.user.tag}. Recreating channel.`
      );

      await isExistingChannel.delete()
    }

    // 5. Create private onboarding channel.
    const privateChannel = await member.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: ONBOARDING_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: member.guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    // 6. Send welcome message with rules and button in private channel.
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle(`Welcome to ${SERVER_NAME}!`)
      .setDescription(
        `Hey ${member.user}, welcome to our community!\n\n` +
          rules +
          `\n\nClick below to start your onboarding process.`
      );

    const startButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`start_onboarding_${member.id}`) // User-specific customId
        .setLabel("Start Onboarding")
        .setStyle(ButtonStyle.Success)
    );

    await privateChannel.send({
      embeds: [welcomeEmbed],
      components: [startButtonRow],
    });

    console.log(
      `👉 Created onboarding channel ${channelName} for ${member.user.tag}`
    );
    return privateChannel.id;
  } catch (error) {
    console.error(`Error in handleNewMember for ${member.user.tag}:`, error);
  }
}
