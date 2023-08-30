import React from 'react'
import styled from 'styled-components'
import { LeftBarItem } from '../molecules/LeftBarItem'
import { SiDjango } from 'react-icons/si'
import { APPS } from '../apps/apps'
import { FaReact } from 'react-icons/fa'
import { toBoolStr } from '../utils/utils'
import { Link } from 'react-router-dom'
import { LINKS } from '../router/links'
import Logo from '../assets/logos/with-name/logo-light-colors.png'

const StyledBar = styled.nav`
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.secondary};
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 20px 0 0;

    width: 230px;
    overflow-x: hidden;
    z-index: 2;
    transition: max-width 0.3s ease, min-width 0.3s ease;
    max-width: ${({ close }) => (close ? '0' : '200px')};
    min-width: ${({ close }) => (close ? '0' : '200px')};
    box-shadow: 0 0 10px -5px ${({ theme }) => theme.primary}88;
    gap: 10px;
    a {
        text-decoration: none;
        text-align: center;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

const StyleDashboard = styled.span`
    font-size: 25px;
    padding: 10px;
    text-align: center;
    color: ${({ theme }) => theme.secondary};
`
const StyledMenuItems = styled.div`
    overflow-y: auto;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 10px;
    flex-direction: column;
    height: 100%;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`

export const LeftBar = ({ close }) => {
    return (
        <StyledBar close={toBoolStr(close)}>
            <Link to={LINKS.home()}>
                <StyleDashboard>
                    <img width={150} src={Logo}/>
                   
                </StyleDashboard>
            </Link>
            <StyledMenuItems>
                {Object.values(APPS).map((app) => {
                    return (
                        <LeftBarItem
                            key={app.name}
                            app={app}
                            sublinks={app.sublinks && app.sublinks()}
                        />
                    )
                })}
            </StyledMenuItems>
        </StyledBar>
    )
}
