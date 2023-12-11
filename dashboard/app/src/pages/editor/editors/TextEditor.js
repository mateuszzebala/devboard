import React from 'react'
import styled from 'styled-components'
import { centerEllipsis, range } from '../../../utils/utils'
import { FETCH } from '../../../api/api'
import { ENDPOINTS } from '../../../api/endpoints'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loading } from '../../../atoms/Loading'
import { Button } from '../../../atoms/Button'
import { useParams } from 'react-router-dom'
import { HiDownload, HiOutlinePlay } from 'react-icons/hi'
import { APPS } from '../../../apps/apps'
import { LINKS } from '../../../router/links'
import { LuSave } from 'react-icons/lu'
import { MainTemplate } from '../../../templates/MainTemplate'
import { BiEditAlt } from 'react-icons/bi'
import { convertTerminalTextToHTML } from '../../../utils/utils'
import { useModalForm } from '../../../utils/hooks'
import { EditorChooser } from '../../../atoms/modalforms/EditorChooser'
import { ChooseRunner } from '../../../atoms/modalforms/ChooseRunner'
import { BsFolder2Open } from 'react-icons/bs'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { GETCONFIG, SETCONFIG } from '../../../api/configuration'
import { TbReplaceFilled } from 'react-icons/tb'
import { SelectFile } from '../../../atoms/modalforms/SelectFile'
import { FiCode, FiDownload, FiEdit, FiPlay, FiSave } from 'react-icons/fi'

const StyledWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    gap: 5px;
    overflow-y: scroll;
`

const StyledTextArea = styled.textarea`
    border: 0;
    width: 100%;
    height: ${({ height }) => height * 30 + 'px'};
    line-height: 1.2;
    font-size: 20px;
    resize: none;
    white-space: pre;
    overflow-wrap: normal;
    padding: 0;
    font-family: 'Fira Mono', monospace;
    overflow: scroll;
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.secondary};
    &:focus {
        outline: none;
    }
    &::-webkit-scrollbar {
        height: 0;
    }
`
const StyledLines = styled.div`
    font-size: 20px;
    display: flex;
    padding: 0;
    width: 40px;
    height: ${({ height }) => height * 30 + 'px'};
    line-height: 1.2;
    flex-direction: column;
    text-align: right;
    color: ${({ theme }) => theme.tertiary};
    span{
        font-family: 'Fira Mono', monospace !important;
        font-weight: bold;
    }
    &::-webkit-scrollbar {
        height: 0;
        width: 0;
    }
`

const StyledLoading = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
`

const StyledIde = styled.div`
    display: flex;
    height: 100%;
`

const StyledTerminal = styled.pre`
    font-family: 'Fira Mono', monospace;
    color: ${({ theme }) => theme.primary};
    font-size: 20px;
    overflow: scroll;
    max-width: 80vw;
    max-height: 70vh;
    min-height: 70vh;
    min-width: 80vw;
`

const Lines = ({ max }) => {
    const linesRef = React.useRef()

    return (
        <StyledLines ref={linesRef}>
            {range(1, max).map((line) => (
                <span key={line}>{line + 1}</span>
            ))}
        </StyledLines>
    )
}

const Terminal = ({ terminalContent }) => (
    <StyledTerminal
        dangerouslySetInnerHTML={{
            __html: convertTerminalTextToHTML(terminalContent),
        }}
    />
)

export const TextEditor = () => {
    const [searchParams] = useSearchParams()
    const { type } = useParams()
    const modalForm = useModalForm()
    const navigate = useNavigate()
    const [data, setData] = React.useState({})
    const [liked, setLiked] = React.useState(false)
    const [value, setValue] = React.useState(false)
    const [command, setCommand] = React.useState('')
    const [loading, setLoading] = React.useState(true)
    const [runLoading, setRunLoading] = React.useState(false)
    const [saveLoading, setSaveLoading] = React.useState(false)

    const addToLast = async () => {
        GETCONFIG('editor_last').then((value) => {
            SETCONFIG('editor_last', {
                files: [
                    ...new Set([searchParams.get('path'), ...value.files]),
                ].slice(0, 50),
            })
        })
        GETCONFIG('editor_liked').then((value) => {
            setLiked(value.files.includes(searchParams.get('path')))
        })
    }

    React.useEffect(() => {
        addToLast()
    }, [])

    React.useEffect(() => {
        GETCONFIG('editor_liked').then((value) => {
            if (liked) {
                SETCONFIG('editor_liked', {
                    files: [searchParams.get('path'), ...value.files],
                })
            } else {
                SETCONFIG('editor_liked', {
                    files: value.files.filter(
                        (file) => file !== searchParams.get('path')
                    ),
                })
            }
        })
    }, [liked])

    const handleSave = () => {
        value !== false && setSaveLoading(true)
        value !== false &&
            FETCH(ENDPOINTS.editor.save.text(searchParams.get('path')), {
                content: value,
            }).then(() => {
                setSaveLoading(false)
            })
    }

    React.useEffect(() => {
        FETCH(ENDPOINTS.files.file(searchParams.get('path')))
            .then((data) => {
                setValue(data.data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [searchParams])

    React.useEffect(() => {
        FETCH(ENDPOINTS.editor.json(searchParams.get('path'))).then((data) => {
            setData(data.data)
        })
    }, [searchParams])

    return (
        <MainTemplate
            app={{
                name: 'TEXT EDITOR',
                icon: FiCode,
                link: LINKS.editor.index()
            }}
            title={centerEllipsis(searchParams.get('path'), 50)}
            submenuChildren={
                <>
                    <Button
                        second
                        tooltip={'SAVE FILE'}
                        size={1.4}
                        subContent={'SAVE'}
                        onKey={{
                            key: 's',
                            ctrlKey: true,
                            prevent: true,
                        }}
                        icon={<FiSave />}
                        loading={saveLoading}
                        onClick={handleSave}
                    />
                    <Button
                        second
                        subContent={'FOLDER'}
                        to={LINKS.files.indexPath(data.parent)}
                        tooltip={'GO TO FOLDER'}
                        size={1.4}
                        icon={<APPS.files.icon />}
                    />
                    <Button
                        second
                        tooltip={'DOWNLOAD FILE'}
                        subContent={'DOWNLOAD'}
                        size={1.4}
                        target={'_blank'}
                        download="true"
                        to={ENDPOINTS.files.file(searchParams.get('path'))}
                        icon={<FiDownload />}
                    />
                    <Button
                        second
                        icon={<FiEdit />}
                        subContent={'EDITOR'}
                        size={1.4}
                        tooltip={'CHOOSE EDITOR'}
                        onKey={{
                            key: 'e',
                            prevent: true,
                            ctrlKey: true,
                        }}
                        onClick={() => {
                            modalForm({
                                content: EditorChooser,
                                icon: <FiEdit />,
                                title: 'CHOOSE EDITOR TYPE',
                                todo: (editorType) => {
                                    navigate(
                                        LINKS.editor.edit(
                                            searchParams.get('path'),
                                            editorType
                                        )
                                    )
                                },
                            })
                        }}
                    />
                    <Button second icon={<TbReplaceFilled />} size={1.4} subContent={'REPLACE'}/>
                    <Button
                        second
                        onClick={() => {
                            setLiked((prev) => !prev)
                        }}
                        tooltip={'LIKE'}
                        subContent={liked ? 'UNLIKE' : 'LIKE'}
                        onKey={{
                            key: 'l',
                            prevent: true,
                            ctrlKey: true,
                        }}
                        size={1.4}
                        icon={liked ? <AiFillHeart /> : <AiOutlineHeart />}
                    />
                    |
                    <Button
                        second
                        size={1.4}
                        subContent={'RUN'}
                        onKey={{
                            key: 'F5',
                            prevent: true,
                        }}
                        onClick={() => {
                            if (value !== false && command) {
                                setRunLoading(true)
                                FETCH(
                                    ENDPOINTS.editor.save.run(
                                        searchParams.get('path')
                                    ),
                                    { command, content: value }
                                ).then((data) => {
                                    setRunLoading(false)
                                    modalForm({
                                        content: Terminal,
                                        title: 'TERMINAL',
                                        minimizeIcon: true,
                                        icon: <APPS.terminal.icon />,
                                        terminalContent:
                                            data.data.output + data.data.errors,
                                    })
                                })
                            } else {
                                modalForm({
                                    content: ChooseRunner,
                                    title: 'RUN',
                                    icon: <FiPlay />,
                                    filename: data.filename,

                                    todo: (val) => {
                                        setCommand(val)
                                    },
                                })
                            }
                        }}
                        icon={<FiPlay />}
                    ></Button>
                    <span
                        onClick={() => {
                            modalForm({
                                content: ChooseRunner,
                                title: 'RUN',
                                icon: <HiOutlinePlay />,
                                filename: data.filename,

                                todo: (val) => {
                                    setCommand(val)
                                },
                            })
                        }}
                    >
                        {command}
                    </span>
                </>
            }
        >
            {loading && (
                <StyledLoading>
                    <Loading size={2} />
                </StyledLoading>
            )}

            {!loading && (
                <StyledIde>
                    <StyledWrapper>
                        <Lines
                            max={value.split('\n').length}
                            height={value.split('\n').length}
                        />
                        <StyledTextArea
                            onKeyDown={(e) => {
                                if (e.key == 'Tab') {
                                    e.preventDefault()
                                    var start = e.target.selectionStart
                                    var end = e.target.selectionEnd
                                    e.target.value =
                                        e.target.value.substring(0, start) +
                                        '\t' +
                                        e.target.value.substring(end)
                                    e.target.selectionStart =
                                        e.target.selectionEnd = start + 1
                                    setValue(e.target.value)
                                }
                            }}
                            preformate
                            spellCheck={false}
                            height={value.split('\n').length}
                            onChange={(e) => {
                                setValue(e.target.value)
                            }}
                            value={value}
                        />
                    </StyledWrapper>
                </StyledIde>
            )}
        </MainTemplate>
    )
}
