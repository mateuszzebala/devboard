import React from 'react'
import styled from 'styled-components'
import { LogItem } from './LogItem'
import { FETCH } from '../../../api/api'
import { ENDPOINTS } from '../../../api/endpoints'

const StyledWrapper = styled.div`
    box-shadow: 0 0 5px -3px ${({ theme }) => theme.primary};
    padding: 10px;
    height: 100%;
    width: 100%;
    min-width: 400px;
    border-radius: 10px;
`

const StyledList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
    max-height: 100%;
    min-height: 100%;
    overflow: scroll;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`


export const LogsList = ({reloadEachSecond=false}) => {
    const [logs, setLogs] = React.useState([])

    const handleReload = () => {
        FETCH(ENDPOINTS.home.logs()).then((data) => {
            setLogs(data.data.logs)
        })
    }

    React.useEffect(() => {
        handleReload()
        if(reloadEachSecond){
            const interval = setInterval(() => {
                handleReload()
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        <StyledWrapper>
            <StyledList onClick={handleReload}>
                {Object.keys(logs).map((index) => (
                    <LogItem key={index} {...logs[index]} />
                ))}
            </StyledList>
        </StyledWrapper>
    )
}
