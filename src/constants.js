import { css } from "styled-components"

// Media queries for styled components
const SIZES = {
    // Extra large devices (large desktops, 1200px and up)
    xlarge: "1200",
    // Large devices (desktops, 992px and up)
    large: "992",
    // Medium devices (tablets, 768px and up)
    medium: "768",
    // Small devices (landscape phones, 576px and up)
    small: "576",
}

// Iterate through the sizes and create a media template
// This allows to the use of media queries using globally set sizes
// i.e. ${media.medium`background: blue;`};
export const media = Object.keys(SIZES).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media (min-width: ${SIZES[label] / 16}em) {
            ${css(...args)};
        }
    `
    return acc
}, {})

// Colors
export const colors = {
    darkTableRow: "#e6e7eb",
    lightTableRow: "#ffffff",
}
