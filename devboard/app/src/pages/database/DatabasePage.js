import React from 'react'
import { MainTemplate } from '../../templates/MainTemplate'
import styled from 'styled-components'
import { ENDPOINTS } from '../../api/endpoints'
import { FETCH } from '../../api/api'
import { useNavigate } from 'react-router-dom'
import { LINKS } from '../../router/links'
import { APPS } from '../../apps/apps'
import { BsPersonFillGear, BsQrCode, BsTable } from 'react-icons/bs'
import { BiWrench } from 'react-icons/bi'
import { FiEye, FiKey, FiMail, FiUser, FiUsers } from 'react-icons/fi'

const IconByModel = {
    user: <FiUser />,
    group: <FiUsers />,
    session: <FiKey />,
    requestlog: <FiEye />,
    permission: <BsPersonFillGear />,
    configuration: <BiWrench />,
    qrcodeauth: <BsQrCode/>,
    account: <FiUser/>,
    email: <FiMail/>
}

const StyledModels = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    a {
        color: ${({ theme }) => theme.primary};
        text-decoration: none;
    }
`
const StyledModel = styled.button`
    padding: 25px 40px;
    background-color: ${({ theme }) => theme.quaternary};
    color: ${({ theme }) => theme.primary};
    border-radius: 5px;
    border: 0;
    flex-direction: column;
    cursor: pointer;
    width: 100%;
    font-size: 15px;
    display: flex;
    gap: 12px;
    text-transform: uppercase;
    align-items: center;
    transition: transform 0.2s, outline-width 0.2s;
    outline: 0 solid ${({theme})=>theme.quaternary}88;
    &:hover, &:focus {
        outline-width: 5px;
        transform: scale(0.95);
    }
    svg{
        font-size: 28px;
    }
`

const StyledAppName = styled.span`
    font-size: 15px;
`

const StyledApp = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    h1 {
        font-size: 20px;
    }
`

export const DatabasePage = () => {
    const [models, setModels] = React.useState([])
    const navigate = useNavigate()

    React.useEffect(() => {
        FETCH(ENDPOINTS.database.models()).then((data) => {
            const newModels = {}
            Object.keys(data.data.models).forEach((modelName) => {
                if (!newModels[data.data.models[modelName]])
                    newModels[data.data.models[modelName]] = []
                newModels[data.data.models[modelName]].push(modelName)
            })
            setModels(newModels)
        })
    }, [])

    return (
        <MainTemplate app={APPS.database} title={'MODELS'}>
            {Object.keys(models).map((app) => (
                <StyledApp key={app}>
                    <StyledAppName>{app.toUpperCase()}</StyledAppName>
                    <StyledModels>
                        {models[app].map((model) => (
                            <StyledModel
                                key={model}
                                onClick={() =>
                                    navigate(LINKS.database.model(model))
                                }
                            >
                                {IconByModel[model.toLowerCase()] ? (
                                    IconByModel[model.toLowerCase()]
                                ) : (
                                    <BsTable />
                                )}
                                {model}
                            </StyledModel>
                        ))}
                    </StyledModels>
                </StyledApp>
            ))}
        </MainTemplate>
    )
}
