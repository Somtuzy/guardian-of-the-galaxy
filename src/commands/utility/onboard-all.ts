import { SlashCommandBuilder, CommandInteraction, GuildMember, TextChannel, ChannelType, MessageFlags } from 'discord.js';
import { WELCOME_ROLE_ID, ONBOARDING_ROLE_ID, MEMBER_ROLE_ID, TUTOR_ROLE_ID, SUPER_ADMIN_ROLE_ID, SPEAKER_ROLE_ID } from '../../config';
import { handleNewMember } from '../../controllers';
import { setOnboardingRoles } from '../../models';

const data = new SlashCommandBuilder()
    .setName('onboard-all')
    .setDescription('Starts the onboarding process for all eligible server members (excluding tutors).');

async function execute(interaction: CommandInteraction) {
    // Ensure command is used in a guild
    if (!interaction.guild) {
        return interaction.reply({ content: 'This command must be used in a server.', flags: MessageFlags.Ephemeral });
    }

    const channel = interaction.channel;

  // Check if the command is used in an onboarding channel
  if (channel instanceof TextChannel) {
    // Now TypeScript knows `channel` has a `name` property
    if (channel.name.startsWith("onboarding-")) {
      return interaction.reply({
        content: "This command isn’t allowed in onboarding channels.",
        flags: MessageFlags.Ephemeral
      });
    }
  }

    const member = interaction.member as GuildMember;

    // Restrict to admins
    if (!member.roles.cache.has(SUPER_ADMIN_ROLE_ID)) {
        return interaction.reply({ content: 'You need admin permissions to use this command.', flags: MessageFlags.Ephemeral });
    }

    // Defer reply since this might take time
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    try {
        // Fetch all members
        const members = await interaction.guild.members.fetch();

        for (const [, guildMember] of members) {
            // Skip tutors, bots, and already onboarded members
            if (
                guildMember.roles.cache.has(TUTOR_ROLE_ID) ||
                guildMember.user.bot ||
                guildMember.roles.cache.has(MEMBER_ROLE_ID) ||
                guildMember.roles.cache.has(SPEAKER_ROLE_ID)
            ) {
                skipped++;
                continue;
            }

           // Store current roles (excluding welcome and onboarding roles)
            const currentRoles = guildMember.roles.cache
                .filter((role) => role.id !== WELCOME_ROLE_ID && role.id !== ONBOARDING_ROLE_ID)
                .map((role) => role.id);
            await setOnboardingRoles(guildMember.id, currentRoles);

            // Remove all roles except WELCOME_ROLE_ID
            try {
                await guildMember.roles.set([WELCOME_ROLE_ID]);
            } catch (error) {
                console.error(`Error setting roles for ${guildMember.user.tag}:`, error);
                errors++;
                continue;
            }

            // Start onboarding process
            try {
                await handleNewMember(guildMember);
                processed++;
            } catch (error) {
                console.error(`Error onboarding ${guildMember.user.tag}:`, error);
                errors++;
                continue;
            }

            // Throttle to avoid rate limits (500ms delay)
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Send summary
        await interaction.editReply({
            content: `Onboarding complete!\n- Processed: ${processed} members\n- Skipped: ${skipped} members\n- Errors: ${errors}`
        });
    } catch (error) {
        console.error('Error in /onboard-all:', error);
        await interaction.editReply({ content: 'An error occurred while processing members.' });
    }
}

export = {
    data,
    execute,
};