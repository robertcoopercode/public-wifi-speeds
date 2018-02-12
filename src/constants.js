import { css } from "styled-components"

// Media queries for styled components
const SIZES = {
    large: "992",
    medium: "700",
    small: "376",
}

// Iterate through the sizes and create a media template
// This allows to the use of media queries using globally set sizes
// i.e. ${media.medium`background: blue;`};
export const media = Object.keys(SIZES).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media (max-width: ${SIZES[label] / 16}em) {
            ${css(...args)};
        }
    `
    return acc
}, {})
