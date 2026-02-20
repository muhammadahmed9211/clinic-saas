import { NotFoundException } from "@nestjs/common";

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}



export const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  try {
    // Parse date string like "6/24/2025 12:41:29 PM"
    const parsedDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error(`Invalid date format: ${dateString}`);
      return null;
    }

    return parsedDate;
  } catch (error) {
    console.error(`Error parsing date: ${dateString}`, error);
    return null;
  }
};