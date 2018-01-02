export function roundDecimals(value, decimalPlaces) {
    return parseFloat(parseFloat(value).toFixed(decimalPlaces))
}
