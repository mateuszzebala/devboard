import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { toBoolStr } from '../utils/utils'

const StyledWrapper = styled.span`
    a {
        text-decoration: none;
        color: ${({ theme, accent }) => accent ? theme.accent : theme.primary};
        font-size: 20px;
        display: inline-block;
        position: relative;
        &::after {
            content: '';
            display: inline-block;
            height: 2.5px;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            transition: width 0.3s, left 0.3s;
            border-radius: 10px;
            background-color: ${({ theme, accent }) => accent ? theme.accent : theme.primary};
        }
        &:hover::after {
            width: ${({ animation }) => (animation ? '100%' : '0')};
            left: 0;
        }
    }
`

export const Link = ({ children, animation = true, accent, ...props }) => {
    return (
        <StyledWrapper tabIndex={0} animation={toBoolStr(animation)} accent={accent}>
            <RouterLink {...props}>{children}</RouterLink>
        </StyledWrapper>
    )
}
