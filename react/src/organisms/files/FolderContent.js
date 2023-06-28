import React from 'react'
import { ItemTile } from './ItemTile'
import styled from 'styled-components'
import { FETCH } from '../../api/api'
import { ENDPOINTS } from '../../api/endpoints'
import useResizeObserver from 'use-resize-observer'
import { Loading } from '../../atoms/Loading'

const StyledWrapper = styled.div`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(auto-fit, 100px);
    grid-template-rows: repeat(auto-fit, 100px);
`

const StyledSelectRect = styled.div`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    position: absolute;
    top: ${({ top }) => top}px;
    left: ${({ left }) => left}px;
    background-color: ${({ theme }) => theme.primary}88;
    border-radius: 3px;
`

const StyledError = styled.div`
    color: ${({ theme }) => theme.error};
    font-weight: bold;
    width: 100%;
    font-size: 30px;
    text-align: center;
    padding: 20px;
`

const StyledLoading = styled.div`
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
`

export const FolderContent = ({
    path,
    setPath,
    selectedItems,
    setSelectedItems,
    files,
    setFiles,
    folders,
    setFolders,
}) => {
    const [data, setData] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const { ref: contentRef } = useResizeObserver({
        onResize: () => {
            setReloadPos((prev) => prev + 1)
        },
    })

    const [reloadPos, setReloadPos] = React.useState(0)
    const [pos, setPos] = React.useState({})
    const [selectRect, setSelectRect] = React.useState({
        show: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    })

    const handleMouseDown = (e) => {
        setSelectRect({
            x1: e.clientX,
            y1: e.clientY,
            x2: e.clientX,
            y2: e.clientY,
            show: true,
        })
    }

    const handleMouseUp = (e) => {
        e.preventDefault()
        setSelectRect({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            show: false,
        })
    }

    const handleMouseMove = (e) => {
        if (selectRect.show && e.shiftKey) {
            setSelectRect((prev) => ({
                ...prev,
                x2: e.clientX,
                y2: e.clientY,
            }))
            const top =
                selectRect.y1 < selectRect.y2 ? selectRect.y1 : selectRect.y2
            const left =
                selectRect.x1 < selectRect.x2 ? selectRect.x1 : selectRect.x2
            const width = Math.abs(selectRect.x1 - selectRect.x2)
            const height = Math.abs(selectRect.y1 - selectRect.y2)
            const newSelectedItems = [...folders, ...files].filter((item) => {
                const bcr = pos[item.name]
                return (
                    bcr.x + bcr.width > left &&
                    bcr.x < left + width &&
                    bcr.y + bcr.height > top &&
                    bcr.y < top + height
                )
            })
            setSelectedItems(newSelectedItems)
        }
    }

    const handleItemSelect = (e, item) => {
        e.preventDefault()
        if (selectedItems.includes(item)) {
            const newSelectedItems = selectedItems.filter((i) => i != item)
            setSelectedItems(newSelectedItems)
        } else {
            const newSelectedItems = [...selectedItems, item]
            setSelectedItems(newSelectedItems)
        }
    }

    React.useEffect(() => {
        FETCH(ENDPOINTS.files.content(), {
            path,
        }).then((data) => {
            setData(data.data)
            setFiles(data.data.files)
            setFolders(data.data.folders)
            setLoading(false)
        })
    }, [path])

    return (
        <>
            {data.permission_error && (
                <StyledError>Permission Error</StyledError>
            )}
            {loading && (
                <StyledLoading>
                    <Loading size={2} />
                </StyledLoading>
            )}
            <StyledWrapper
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                ref={contentRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                    setSelectRect((prev) => ({
                        ...prev,
                        show: false,
                    }))
                }}
            >
                {folders.map((folder) => (
                    <ItemTile
                        access={folder.access}
                        reloadPos={reloadPos}
                        setPos={(val) => {
                            setPos((prev) => ({ ...prev, [folder.name]: val }))
                        }}
                        selected={selectedItems.includes(folder)}
                        onContextMenu={(e) => handleItemSelect(e, folder)}
                        setLocation={() => setPath(folder.path)}
                        key={folder.name}
                        filename={folder.name}
                        isFile={false}
                    />
                ))}
                {files.map((file) => (
                    <ItemTile
                        access={file.access}
                        reloadPos={reloadPos}
                        setPos={(val) => {
                            setPos((prev) => ({ ...prev, [file.name]: val }))
                        }}
                        selected={selectedItems.includes(file)}
                        onContextMenu={(e) => handleItemSelect(e, file)}
                        setLocation={() => setPath(file.path)}
                        key={file.name}
                        filename={file.name}
                        isFile={true}
                    />
                ))}
                {selectRect.show && (
                    <StyledSelectRect
                        top={
                            selectRect.y1 < selectRect.y2
                                ? selectRect.y1
                                : selectRect.y2
                        }
                        left={
                            selectRect.x1 < selectRect.x2
                                ? selectRect.x1
                                : selectRect.x2
                        }
                        width={Math.abs(selectRect.x1 - selectRect.x2)}
                        height={Math.abs(selectRect.y1 - selectRect.y2)}
                    />
                )}
            </StyledWrapper>
        </>
    )
}
