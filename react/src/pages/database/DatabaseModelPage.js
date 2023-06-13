import React from 'react'
import { MainTemplate } from '../../templates/MainTemplate'
import { useNavigate, useParams } from 'react-router'
import { FETCH } from '../../api/api'
import { ENDPOINTS } from '../../api/endpoints'
import styled from 'styled-components'
import { links } from '../../router/links'
import { FloatingActionButton } from '../../atoms/FloatingActionButton'
import { FaCheck, FaPlus } from 'react-icons/fa'
import { Button } from '../../atoms/Button'
import { Paginator } from '../../atoms/Paginator'
import { Input } from '../../atoms/Input'
import { Select } from '../../atoms/Select'
import { APPS } from '../../apps/apps'
import { ModelTable } from '../../organisms/database/ModelTable'
import { Counter } from '../../atoms/Counter'

const StyledWrapper = styled.div`
    max-width: 100%;
    flex-direction: column;
    gap: 20px;
    overflow-x: scroll;
    padding: 30px 0;
    display: flex;
    align-items: flex-start;
    &::-webkit-scrollbar {
        height: 0;
    }
    table {
        width: 100%;
    }
`

const StyledMenu = styled.div`
    display: flex;
    padding: 0 10px;
    gap: 10px;
    align-items: center;
`

const StyledFooter = styled.div`
    display: flex;
    padding: 0 10px;
    gap: 20px;
    align-items: center;
    justify-content: center;
    width: 100%;
`

export const DatabaseModelPage = () => {
    const { modelName } = useParams()
    const [page, setPage] = React.useState(0)
    const [action, setAction] = React.useState(null)
    const [loadingActionButton, setLoadingActionButton] = React.useState(false)
    const [pages, setPages] = React.useState(2)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [length, setLength] = React.useState(10)
    const [orderBy, setOrderBy] = React.useState(null)
    const [asc, setAsc] = React.useState(true)
    const [modelData, setModelData] = React.useState(false)
    const [data, setData] = React.useState([])
    const [fields, setFields] = React.useState([])
    const [selectedItems, setSelectedItems] = React.useState([])

    const navigate = useNavigate()

    const handleRowClick = (item) => {
        navigate(links.database.item(modelName, item.pk))
    }

    React.useEffect(() => {
        FETCH(ENDPOINTS.database.model(modelName)).then((res) => {
            const resModelData = res.data
            setModelData(resModelData)
            const registeredFields = Object.keys(res.data.fields)
                .filter((field) => !resModelData.fields[field].relation.is)
                .filter((field) => resModelData.fields[field].registered)

            if (registeredFields.length === 0) {
                setFields(
                    Object.keys(res.data.fields).filter(
                        (field) => !resModelData.fields[field].relation.is
                    )
                )
            } else {
                setFields(registeredFields)
            }
        })
    }, [])

    const fetchItems = () => {
        FETCH(
            ENDPOINTS.database.items(modelName, {
                page,
                length,
                order_by: orderBy ? orderBy : 'pk',
                asc: asc.toString(),
                query: searchQuery,
            })
        ).then((res) => {
            setData(res.data)
            setPages(res.data.pages)
        })
    }

    React.useEffect(fetchItems, [page, length, orderBy, asc, searchQuery])

    const handleAction = () => {
        setLoadingActionButton(true)
        FETCH(ENDPOINTS.database.action(modelName), {
            action,
            primary_keys: selectedItems,
        }).then(() => {
            setLoadingActionButton(false)
            fetchItems()
            setSelectedItems([])
        })
    }

    return !modelData ? (
        ''
    ) : (
        <MainTemplate app={APPS.database}>
            <StyledWrapper>
                <StyledMenu>
                    <Button
                        icon={<FaCheck />}
                        onClick={() => {
                            if (selectedItems && selectedItems.length === 0)
                                setSelectedItems(
                                    data.items.map((item) => item.pk)
                                )
                            else setSelectedItems([])
                        }}
                    />
                    <Select
                        emptyName="ACTION"
                        data={modelData.actions.reduce((flds, key) => {
                            flds[key] = key.toUpperCase()
                            return flds
                        }, {})}
                        value={action}
                        setValue={setAction}
                    />
                    <Button
                        onClick={handleAction}
                        loading={loadingActionButton}
                    >
                        MAKE
                    </Button>
                    <Input
                        label={'QUERY'}
                        value={searchQuery}
                        setValue={setSearchQuery}
                    />
                    <Counter
                        value={length}
                        setValue={setLength}
                        min={1}
                        max={1000}
                        unit="rows"
                        size={1.3}
                    />
                </StyledMenu>
                <ModelTable
                    fields={fields}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    data={data}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    setAsc={setAsc}
                    modelData={modelData}
                    handleRowClick={handleRowClick}
                />

                <FloatingActionButton
                    to={links.database.putItem(modelName)}
                    icon={<FaPlus />}
                    circle
                    size={1.5}
                />
                <StyledFooter>
                    <Paginator value={page} pages={pages} setValue={setPage} />
                </StyledFooter>
            </StyledWrapper>
        </MainTemplate>
    )
}
