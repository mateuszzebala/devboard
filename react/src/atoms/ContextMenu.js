import React from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../utils/hooks'

const StyledWrapper = styled.div`
    display: inline-block;
`
const StyledContextMenu = styled.div`
    position: fixed;
    left: ${({ x }) => x + 'px'};
    top: ${({ y }) => y + 'px'};
    background-color: ${({ theme }) => theme.contextMenu.background};
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-shadow: 0 0 5px -3px black;
    border-radius: 2px 10px 10px 10px;
`
const StyledContextMenuItem = styled.button`
    background-color: transparent;
    border: 0;
    font-size: 25px;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 0.2s;
    border-radius: 5px;
    padding: 5px;
    span {
        font-size: 20px;
    }
    &:hover {
        background-color: #00000011;
    }
`

// data {}[] = {icon: Icon, text: string, todo: Function}

export const ContextMenu = ({ data, children }) => {
    const [show, setShow] = React.useState(false)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const thisRef = React.useRef()
    const handleContextMenu = (e) => {
        if (!show) e.preventDefault()
        setPosition({ x: e.clientX, y: e.clientY })
        setShow(true)
    }
    useOnClickOutside(thisRef, () => {
        setShow(false)
    })
    return (
        <>
            <StyledWrapper onContextMenu={handleContextMenu}>
                {children}
            </StyledWrapper>
            {show && (
                <StyledContextMenu x={position.x} y={position.y} ref={thisRef}>
                    {data.map((item) => (
                        <StyledContextMenuItem
                            onClick={item.todo ? item.todo : () => {}}
                            key={item.text}
                        >
                            {item.icon ? item.icon : <span></span>}
                            <span>{item.text}</span>
                        </StyledContextMenuItem>
                    ))}
                </StyledContextMenu>
            )}
        </>
    )
}