const fields = {
  0: {
    fieldname: "FullName",
    format: "FullName: Somtochukwu Onyeka Uzuakpunwa"
  },
  1: {
    fieldname: "NickName",
    format: "Nickname: Somtuzy"
  },
  2: {
    fieldname: "Gender",
    format: "Gender: Male"
  },
  3: {
    fieldname: "Location",
    format: "Location: Enugu City"
  },
  4: {
    fieldname: "State Of Origin",
    format: "State Of Origin: Anambra"
  },
  5: {
    fieldname: "Birthday",
    format: "Birthday: 17th January"
  },
  6: {
    fieldname: "Skills",
    format: "Skills: Software Engineer"
  },
  7: {
    fieldname: "LinkedIn",
    format: "LinkedIn: https://linkedin.com/in/somtochukwu-onyeka-uzuakpunwa"
  }
} as {
  [key: number]: {
    fieldname: string,
    format: string
  }
}

const REQUIRED_FIELDS = [
  "FullName",
  "NickName",
  "Gender",
  "Location",
  "State Of Origin",
  "Birthday",
  "Skills",
  "LinkedIn",
];

interface ParseResult {
  data: { [key: string]: string };
  errors: string[];
  errorCount: number
}

export function parseIntro(content: string): ParseResult {
  const data: { [key: string]: string } = {};
  const errors: string[] = [];
  let errorCount = 1
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);

  // Map expected fields to their placeholder texts for validation
  const placeholderMap: { [key: string]: string } = {
    FullName: "Somtochukwu Onyeka Uzuakpunwa",
    NickName: "Somtuzy",
    Gender: "Male",
    Location: "Enugu (Coal City)",
    "State Of Origin": "Anambra State",
    Birthday: "January 17th",
    Skills: "Problem Solver. Entrepreneur. Software Engineer.",
    LinkedIn: "https://linkedin.com/in/somtochukwu-onyeka-uzuakpunwa",
  };

  // Process each line
  const foundFields = new Set<string>();
  lines.forEach((line, index) => {
    console.log({ line });

    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) {
      if(line.includes(fields[index].fieldname)) {
        const fieldTitle = (fields[index].fieldname).toLowerCase()
        errors.push(`${errorCount}. ${fieldTitle.charAt(0).toUpperCase() + fieldTitle.slice(1)} expected to be filled as \`\`[${fields[index].format}]\`\``);
        errorCount++
      }
        
      return;
    }

    const [_, field, value] = match;
    const trimmedField = field.trim();
    const trimmedValue = value.trim();
    console.log({ _, field, value, trimmedField, trimmedValue});
    

    if (!REQUIRED_FIELDS.includes(trimmedField)) {
      errors.push(`${errorCount}. You provided an unknown field called \`\`${trimmedField}\`\`.`);
      errorCount++
      return;
    }

    if (foundFields.has(trimmedField)) {
      errors.push(`${errorCount}. Duplicate field \`\`${trimmedField}\`\`. Each field must appear exactly once.`);
      errorCount++
      return;
    }

    foundFields.add(trimmedField);

    if (!trimmedValue) {
      errors.push(`${errorCount}. \`\`${trimmedField}\`\` is empty. Please provide a valid value.`);
      errorCount++
      return;
    }

    if (trimmedValue === placeholderMap[trimmedField]) {
      if(trimmedField === fields[0].fieldname && trimmedField === fields[1].fieldname && trimmedField === fields[7].fieldname) {
        errors.push(`${errorCount}. Your \`\`${trimmedField.toLowerCase()}\`\` contains placeholder text. Please provide a valid value.`);
        errorCount++
      }
      return;
    }

    data[trimmedField.toLowerCase()] = trimmedValue;
  });

  // Check for missing fields
  const missingFields = REQUIRED_FIELDS.filter(field => !foundFields.has(field));
  if (missingFields.length) {
    errors.push(`${errorCount}. You didn't provide your ` +
      `\`\`${missingFields.map((f, i) => i === missingFields.length - 1 && missingFields.length > 1 ? `and ${removeUnderScore(f)}.` : removeUnderScore(f)).join(', ').toLowerCase()}.\`\``);
    errorCount++
  }

  return { data, errors, errorCount };
}

export function removeUnderScore(content: string) {
  if (content.includes("_")) {
    return content.replace(/_/g, ' ').split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  return content.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Placeholder for capitalize (if needed elsewhere)
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}