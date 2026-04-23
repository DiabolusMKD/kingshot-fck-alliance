/**
 * Utility function to format numbers with commas as thousand separators.
 * If the number has a decimal part that is ".00", it will be removed.
 * Example:
 *   formatNumbers(1234567) => "1,234,567"
 *   formatNumbers(1234567.00) => "1,234,567"
 *   formatNumbers(1234567.89) => "1,234,567.89"
 */
export const formatNumbers = (num: number): string => {
    const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (formatted.includes(".")) {
        const [integer, decimal] = formatted.split(".");
        if (decimal === "00") {
            return integer;
        }
    }
    return formatted;
}