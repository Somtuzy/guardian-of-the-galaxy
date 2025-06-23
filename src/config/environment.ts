export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const WELCOME_ROLE_ID = process.env.WELCOME_ROLE_ID!;
export const ONBOARDING_CATEGORY_ID = process.env.ONBOARDING_CATEGORY_ID!;
export const ONBOARDING_ROLE_ID = process.env.ONBOARDING_ROLE_ID!;
export const MEMBER_ROLE_ID = process.env.MEMBER_ROLE_ID!;
export const TUTOR_ROLE_ID = process.env.TUTOR_ROLE_ID!;
export const SUPER_ADMIN_ROLE_ID = process.env.SUPER_ADMIN_ROLE_ID!;
export const INTRO_CHANNEL_ID = process.env.INTRO_CHANNEL_ID!;
export const COMMUNITY_CHANNEL_ID = process.env.COMMUNITY_CHANNEL_ID!;
export const SERVER_NAME = process.env.SERVER_NAME || "Our Community";
export const SERVER_ID = process.env.SERVER_ID!
export const CLIENT_ID = process.env.CLIENT_ID!
export const DB_URI = process.env.MONGO_DB_URI!
export const DB_NAME = process.env.DB_NAME! 
export const SERVER_URL = process.env.SERVER_URL! 
export const TIME_TO_PING = parseFloat(process.env.TIME_TO_PING!)
export const API_VERSION = process.env.API_VERSION!
export const SPEAKER_ROLE_ID = process.env.SPEAKER_ROLE_ID!
export const COMMUNITY_MANAGER_ROLE_ID = process.env.COMMUNITY_MANAGER_ROLE_ID!
export const NODE_ENV = process.env.NODE_ENV!
export const BIRTHDAY_BOT_ID = process.env.BIRTHDAY_BOT_ID!;
export const BIRTHDAY_CHANNEL_ID = process.env.BIRTHDAY_CHANNEL_ID!;
export const BIRTHDAY_CHANNEL_WEBHOOK_ID = process.env.BIRTHDAY_CHANNEL_WEBHOOK_ID!;
export const BIRTHDAY_CHANNEL_WEBHOOK_TOKEN = process.env.BIRTHDAY_CHANNEL_WEBHOOK_TOKEN!;
export const THE_GEEK_TRYBE_CHANNEL_WEBHOOK_ID = process.env.THE_GEEK_TRYBE_CHANNEL_WEBHOOK_ID!;
export const THE_GEEK_TRYBE_CHANNEL_WEBHOOK_TOKEN = process.env.THE_GEEK_TRYBE_CHANNEL_WEBHOOK_TOKEN!;
export const BIRTHDAY_AVATAR_URL = process.env.BIRTHDAY_AVATAR_URL!;
export const ONBOARDING_VIDEO_URL = process.env.ONBOARDING_VIDEO_URL!;

export const birthdayGifs = [
  "https://res.cloudinary.com/dzukycark/image/upload/v1746329118/geekstudiosdai/the%20geek%20trybe/happy-birthday-one.gif",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746483169/geekstudiosdai/the%20geek%20trybe/happy-birthday-two.gif",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746496484/geekstudiosdai/the%20geek%20trybe/happy-birthday-three.gif",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746496485/geekstudiosdai/the%20geek%20trybe/happy-birthday-four.gif",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746496486/geekstudiosdai/the%20geek%20trybe/happy-birthday-five.gif",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746498944/geekstudiosdai/the%20geek%20trybe/happy-birthday-six.gif",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746498938/geekstudiosdai/the%20geek%20trybe/happy-birthday-seven.webp",
  "https://res.cloudinary.com/dzukycark/image/upload/v1746498937/geekstudiosdai/the%20geek%20trybe/happy-birthday-eight.gif",
];

export const birthdayMessages = {
  1: (mention: string) => (
    `\n\n` +
    `Happy Birthday, ${mention}! 🎉\n\n` +
    `We wish you lots of joy and all the geeky goodness life has to offer. Have an amazing year ahead! 🎊\n\n` +
    `_Make a wish, the birthday genie is listening 🥳_\n`
  ),
  2: (mention: string) => (
    `\n\n` +
    `Level up day, ${mention}! 🎮\n\n` +
    `Today’s all about you — may your inventory be full of love, cake, and legendary vibes! 🍰\n\n` +
    `_Make a wish, the Birthday Genie’s got your back! ✨_\n`
  ),
  3: (mention: string) => (
    `\n\n` +
    `Happy Birthday, ${mention}! 🎂\n\n` +
    `You’ve officially unlocked a new chapter. May it be filled with laughter, cool quests, and unlimited snacks. 😄\n\n` +
    `_Don’t forget to roll for a birthday wish 🎲_\n`
  ),
  4: (mention: string) => (
    `\n\n` +
    `Hey ${mention}, it’s your day! 🥳\n\n` +
    `Here’s to a birthday loaded with chill, joy, and that geeky magic you bring to the world. 💫\n\n` +
    `_Speak your wish—the Birthday Genie’s got the signal! 📡_\n`
  ),
  5: (mention: string) => (
    `\n\n` +
    `Let the confetti fly! 🎉\n\n` +
    `Happy Birthday, ${mention}! Wishing you a day that’s as awesome and fun as a surprise loot drop. 🧁\n\n` +
    `_Ready, set… wish! 🎈_\n`
  ),
  6: (mention: string) => (
    `\n\n` +
    `It’s your birthday, ${mention}! 🎉\n\n` +
    `May your day be filled with epic moments, great vibes, and the perfect balance of fun and chill. 🎈\n\n` +
    `_Your Birthday Genie is ready—make a wish and press start! 🕹️_\n`
  ),
  7: (mention: string) => (
    `\n\n` +
    `Level up, ${mention}! 🎂\n\n` +
    `Another year, another adventure unlocked. May your birthday be stacked with fun, laughter, and geeky surprises. 🧁\n\n` +
    `_Wish big, the Birthday Genie is always listening! 🎮_\n`
  ),
  8: (mention: string) => (
    `\n\n` +
    `Big cheers to you, ${mention}! 🥳\n\n` +
    `Here’s to a day of cake, chaos (the fun kind), and all your favorite things. Keep shining like the legend you are! ✨\n\n` +
    `_Make that wish—your Birthday Genie is already on standby. 🧙‍♂️_\n`
  ),
  9: (mention: string) => (
    `\n\n` +
    `Happy Cake Day, ${mention}! 🍰\n\n` +
    `Today’s the perfect excuse to geek out, take it easy, and do whatever makes you smile. You’ve earned it! 😎\n\n` +
    `_Don’t forget to wish — Birthday Genie’s clocking in! ⏳_\n`
  ),
  10: (mention: string) => (
    `\n\n` +
    `Birthday alert for ${mention}! 🚨🎉\n\n` +
    `Wishing you a full day of wins, snacks, and all the geeky delights that make life sweet. 💫\n\n` +
    `_Go ahead, whisper that birthday wish—your Genie’s waiting in the wings. 🧞‍♂️_\n`
  ),
} as { [key: number]: (mention: string) => string };
