import _ from "lodash";

export function parseIntro(content: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  const lines = content.split("\n");

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");

    if (key && valueParts.length) {
      const value = valueParts.join(":").trim();

      const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, "_"); // replaces one or more spaces with a single underscore

      result[normalizedKey] = value;
    }
  }

  return result;
}

export function capitalize(content: string) {
  return _.capitalize(content);
}

export function removeUnderScore(content: string) {
  if (content.includes("_")) {
    return content.split("_").join(" ");
  }
  return capitalize(content);
}