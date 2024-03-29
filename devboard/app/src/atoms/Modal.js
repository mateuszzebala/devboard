import React from 'react'
import styled from 'styled-components'
import { IoClose } from 'react-icons/io5'
import { MdOutlineMinimize } from 'react-icons/md'
import { toBoolStr } from '../utils/utils'
import { useGlobalKey } from '../utils/hooks'

const StyledCurtain = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: ${({ transparentCurtain }) =>
        transparentCurtain ? 'transparent' : '#00000044'};
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    animation: fadeIn 0.2s ease;
`

const StyledWrapper = styled.div`
    z-index: ${({zIndex})=>zIndex};
    max-width: 100vw;
    max-height: 100vh;
    padding: 12px;
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.primary};
    
    border-radius: 10px;
    @keyframes fade-in {
        from {
            opacity: 0;
            /* transform: translate(0, 20px) scale(1.3) rotateX(30deg); */
        }
        to {
            opacity: 1;
            /* transform: translate(0, 0) scale(1) rotateX(0deg); */
        }
    }
    animation: fade-in 0.3s forwards;
`

const StyledCaption = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 20px;
    padding-bottom: 10px;
    white-space: nowrap;
    align-items: center;
`

const StyledTitle = styled.span`
    font-weight: bold;
    font-size: 20px;
`

const StyledIcon = styled.span`
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
`

const StyledCircleButton = styled.button`
    background-color: transparent;
    border: 0;
    font-size: 30px;
    display: inline-flex;
    flex-direction: column;
    color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    width: 35px;
    height: 35px;
    justify-content: center;
    transition: background-color 0.2s;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.primary}22;
    }
    &:focus {
        outline: none;
    }
`

const StyledContent = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 90vh;
`

const StyledMinimize = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 30px -10px ${({ theme }) => theme.primary};
    position: absolute;
    left: 50%;
    bottom: 30px;
    padding: 10px;
    border-radius: 7px;
    font-size: 20px;
    transform: translateX(-50%);
    z-index: 30;
    @keyframes fadein {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    animation: fadein 0.3s ease;
`

export const Modal = ({
    open,
    setOpen,
    minimize, 
    setMinimize,
    minimizeIcon = false,
    title = '',
    children,
    icon = '',
    transparentCurtain = false,
    escape = true,
    zIndex = 0,
}) => {
    const curtainRef = React.useRef()

    React.useEffect(() => {
        setMinimize(false)
    }, [children, title, icon])

    useGlobalKey(
        () => {
            setOpen(false)
        },
        'Escape',
        escape
    )

    if (!open) return ''
    if (minimize)
        return (
            ''
        )
    return (
        <StyledCurtain
            transparentCurtain={toBoolStr(transparentCurtain)}
            ref={curtainRef}
            onClick={(e) => {
                e.target === curtainRef.current && setOpen(false)
            }}
        >
            <StyledWrapper zIndex={zIndex + 10000}>
                <StyledCaption>
                    <div>
                        {minimizeIcon && (
                            <StyledCircleButton
                                onClick={() => {
                                    setMinimize(true)
                                }}
                            >
                                <MdOutlineMinimize />
                            </StyledCircleButton>
                        )}
                        <StyledCircleButton
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            <IoClose />
                        </StyledCircleButton>
                    </div>
                    <StyledTitle>{title}</StyledTitle>
                    <StyledIcon>{icon}</StyledIcon>
                </StyledCaption>
                <StyledContent>{children}</StyledContent>
            </StyledWrapper>
        </StyledCurtain>
    )
}
