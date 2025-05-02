export const messages = {
  alreadyOnboarded: "You’ve already started onboarding!",
  channelExists: "Your onboarding channel already exists!",
};

export const rules = `
Behold, the Ten Commandments:

I. Thou shalt respect all members at all times — harassment, discrimination, racism, sexism, and hate speech will not be tolerated.

II. Thou shalt not spam nor promote thyself without permission — seek admin approval before sharing your business, projects, or promotions.

III. Thou shalt not share unsafe or harmful content — malicious websites, pirated materials, and dangerous links are forbidden.

IV. Thou shalt keep thy profile clean — do not use offensive usernames or profile pictures.

V. Thou shalt protect the community — if you witness any wrongdoing, you should report it privately to the admins.

VI. Thou shalt keep discussions focused — stay on topic within the right channels; when in doubt, ask the admins for guidance.

VII. Thou shalt respect differing opinions — disagree and converse objectively and don’t be condescending when someone has a different opinion.

VIII. Thou shalt participate and engage — bring your ideas, questions, and energy to build the community strong.

IX. Thou shalt guard the privacy of others — personal information and private conversations should not be shared without consent.

X. Thou shalt collaborate joyfully and learn with passion — rejoice in learning, teamwork, and the building of great things together.
`;

export const introFormat = `
Name: Your fullname.\n
Nickname: What you want us to call you.\n
Gender: Your gender.\n
Location: Your city/state of residence and state of origin (e.g Awka, Anambra and Enugu)\n
Birthday: Your birthday (e.g., January 17th)\n
Skills: Your expertise or a skill(s) you're interested in.\n
LinkedIn: Your LinkedIn profile URL (e.g https://linkedin.com/in/geekstudiosdai)\n
`;

export function parseIntro(content: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      result[key.trim().toLowerCase()] = value;
    }
  }
  return result;
}