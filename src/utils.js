export function roundDecimals(value, decimalPlaces) {
    return parseFloat(parseFloat(value).toFixed(decimalPlaces))
}

export function capitalize(value) {
    return value[0].toUpperCase() + value.slice(1)
}
