import React from 'react'
import { BsFileEarmarkBinary, BsFolder } from 'react-icons/bs'
import styled from 'styled-components'

const StyledWrapper = styled.div`
    aspect-ratio: 1/1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    background-color: ${({ theme }) => theme.light};
    box-shadow: 0 0 5px -4px black;
    border-radius: 10px;
    height: 100px;
    width: 100px;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.3s;
    user-select: none;
    &:hover {
        background-color: ${({ theme }) => theme.primary}05;
    }
`

const StyledIcon = styled.div`
    font-size: 30px;
`

export const ItemTile = ({ filename, isFile }) => {
    return (
        <StyledWrapper>
            <StyledIcon>
                {isFile ? <BsFileEarmarkBinary /> : <BsFolder />}
            </StyledIcon>
            {filename}
        </StyledWrapper>
    )
}