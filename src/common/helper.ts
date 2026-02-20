export function convertToTimestamp(dateTimeStr: string): number {
    // Check if it's ISO 8601 format (contains 'T')
    if (dateTimeStr.includes('T')) {
        return Math.floor(Date.parse(dateTimeStr) / 1000)
    }

    // Split into date and time parts for other formats
    const [dateStr, timeStr = '00:00:00'] = dateTimeStr.split(' ')

    // Parse date
    const dateParts = dateStr.split('-')
    let year: number, month: number, day: number

    if (dateParts[0].length === 4) {
        // Format: 2025-01-01
        year = parseInt(dateParts[0])
        month = parseInt(dateParts[1]) - 1 // Months are 0-based in JS
        day = parseInt(dateParts[2])
    } else {
        // Format: 01-01-2025
        day = parseInt(dateParts[0])
        month = parseInt(dateParts[1]) - 1
        year = parseInt(dateParts[2])
    }

    // Parse time
    const [hours = '0', minutes = '0', seconds = '0'] = timeStr.split(':')

    // Create date object with both date and time
    const date = new Date(
        year,
        month,
        day,
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
    )

    return Math.floor(date.getTime() / 1000)
}

/**
 * Transforms object keys from PascalCase to camelCase
 * @param data The object with PascalCase keys
 * @returns A new object with all keys converted to camelCase
 */
export function transformKeysToCamelCase<T extends object>(
    data: T
): Record<string, any> {
    if (!data || typeof data !== 'object' || data === null) {
        return data as any
    }

    const result: Record<string, any> = {}

    Object.entries(data).forEach(([key, value]) => {
        // Convert PascalCase to camelCase
        const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1)

        // Handle special cases for ID suffix
        const finalKey = camelCaseKey.replace(
            /ID([^a-z]|$)/g,
            (_, suffix) => `Id${suffix}`
        )

        // Handle nested objects recursively
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            result[finalKey] = transformKeysToCamelCase(value)
        } else if (Array.isArray(value)) {
            // Handle arrays by mapping each element
            result[finalKey] = value.map((item) =>
                typeof item === 'object' && item !== null
                    ? transformKeysToCamelCase(item)
                    : item
            )
        } else {
            result[finalKey] = value
        }
    })

    return result
}
