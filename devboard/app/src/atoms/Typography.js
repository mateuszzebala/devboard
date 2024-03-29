import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.span`
    * {
        color: ${({theme})=>theme.primary};
        margin: 0;
    }
`

export const Typography = ({ variant, children, ...props }) => {
    const Variant = variant || 'span'
    return (
        <StyledWrapper>
            <Variant {...props}>{children}</Variant>
        </StyledWrapper>
    )
}
