import {
  GuildMember,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  AttachmentBuilder,
} from "discord.js";
import {
  ONBOARDING_CATEGORY_ID,
  WELCOME_ROLE_ID,
  SERVER_NAME,
  ONBOARDING_VIDEO_URL,
  COMMUNITY_MANAGER_ROLE_ID,
} from "../config";
import { rules } from "../utils/constants";
import { join } from "path";
import { existsSync } from "fs";

// Handler for when a new user joins the guild.
export async function handleNewMember(member: GuildMember) {
  try {
    // 1. Fetch roles from cache (must exist on ready).
    const welcomeRole = member.guild.roles.cache.get(WELCOME_ROLE_ID);
    if (!welcomeRole) {
      console.error("Welcome role not found.");
      return;
    }

    // 2. Assign welcome role to hide all content.
    await member.roles.add(WELCOME_ROLE_ID);

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
        `Channel ${channelName} already exists for ${member.user.tag}. Recreating channel...👀`
      );

      await isExistingChannel.delete();
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
        {
          id: COMMUNITY_MANAGER_ROLE_ID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    // console.log(1);

    // let videoAttachment: AttachmentBuilder | null = null;
    // const videoPath = join(__dirname, "..", "assets", "onboarding.mp4");
    // try {
    //   if (existsSync(videoPath)) {
    //     videoAttachment = new AttachmentBuilder(videoPath, {
    //       name: "onboarding.mp4",
    //     });
    //   } else {
    //     console.error(`Welcome video not found at ${videoPath}`);
    //   }
    // } catch (error) {
    //   console.error(`Error fetching video from ${videoPath}:, error`);
    // }
    // 6. Send welcome message with rules and button in private channel.
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#3E91E9")
      .setTitle(`Welcome to ${SERVER_NAME}!`)
      .setDescription(
        `Hey, ${member.user}. Welcome to The Geek Trybe!\n\n` +
          rules +
          `\n\nClick below to start your onboarding process.`
      );

    const startButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`start_onboarding_${member.id}`)
        .setLabel("Start Onboarding")
        .setStyle(ButtonStyle.Success)
    );

    // console.log(5, { videoAttachment });

    try {
      await privateChannel.send({
        embeds: [welcomeEmbed],
        components: [startButtonRow],
        // files: videoAttachment ? [videoAttachment] : [],
      });

      console.log(
        `👉 Created onboarding channel ${channelName} for ${member.user.tag}`
      );
      return privateChannel.id;
    } catch (error) {
      console.error(`Error sending message to channel:`, { error });
    }
  } catch (error) {
    console.error(`Error in handleNewMember for ${member.user.tag}:`, error);
  }
}
