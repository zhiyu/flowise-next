import { useEffect, useState, useRef } from 'react'

// material-ui
import { Box, Stack, Button, ButtonGroup, Skeleton, ToggleButtonGroup, ToggleButton } from '@mui/material'

// project imports
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import ToolEmptySVG from '@/assets/images/tools_empty.svg'
import ToolDialog from './ToolDialog'
import { ToolsTable } from '@/ui-component/table/ToolsListTable'

// API
import toolsApi from '@/api/tools'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'
import { useTheme } from '@mui/material/styles'
import { PiPlus, PiGridFour, PiListDashes, PiUpload } from 'react-icons/pi'

// ==============================|| CHATFLOWS ||============================== //

const Tools = () => {
    const theme = useTheme()
    const getAllToolsApi = useApi(toolsApi.getAllTools)

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [view, setView] = useState(localStorage.getItem('toolsDisplayStyle') || 'list')

    const inputRef = useRef(null)

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('toolsDisplayStyle', nextView)
        setView(nextView)
    }

    const onUploadFile = (file) => {
        try {
            const dialogProp = {
                title: 'Add New Tool',
                type: 'IMPORT',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Save',
                data: JSON.parse(file)
            }
            setDialogProps(dialogProp)
            setShowDialog(true)
        } catch (e) {
            console.error(e)
        }
    }

    const handleFileUpload = (e) => {
        if (!e.target.files) return

        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            onUploadFile(result)
        }
        reader.readAsText(file)
    }

    const addNew = () => {
        const dialogProp = {
            title: '添加工具',
            type: 'ADD',
            cancelButtonName: '取消',
            confirmButtonName: '添加'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (selectedTool) => {
        const dialogProp = {
            title: '编辑工具',
            type: 'EDIT',
            cancelButtonName: '取消',
            confirmButtonName: '保存',
            data: selectedTool
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getAllToolsApi.request()
    }

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    function filterTools(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 || data.description.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    useEffect(() => {
        getAllToolsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllToolsApi.loading)
    }, [getAllToolsApi.loading])

    useEffect(() => {
        if (getAllToolsApi.error) {
            setError(getAllToolsApi.error)
        }
    }, [getAllToolsApi.error])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader title='工具'>
                        <Button variant='contained' color='primary' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            创建工具
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                color='secondary'
                                variant='contained'
                                onClick={() => inputRef.current.click()}
                                startIcon={<PiUpload size='0.8em' />}
                            >
                                导入
                            </Button>
                            <input
                                style={{ display: 'none' }}
                                ref={inputRef}
                                type='file'
                                hidden
                                accept='.json'
                                onChange={(e) => handleFileUpload(e)}
                            />
                        </Box>

                        {/* <ToggleButtonGroup
                            sx={{ ml: 10, borderRadius: 2, maxHeight: 36 }}
                            value={view}
                            color='primary'
                            exclusive
                            onChange={handleChange}
                        >
                            <ToggleButton value='card' title='Card View'>
                                <PiGridFour size='1.2rem' />
                            </ToggleButton>
                            <ToggleButton value='list' title='List View'>
                                <PiListDashes size='1.2rem' />
                            </ToggleButton>
                        </ToggleButtonGroup> */}
                    </ViewHeader>
                    {!view || view === 'card' ? (
                        <>
                            {isLoading ? (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                </Box>
                            ) : (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    {getAllToolsApi.data &&
                                        getAllToolsApi.data.map((data, index) => (
                                            <ItemCard data={data} key={index} onClick={() => edit(data)} />
                                        ))}
                                </Box>
                            )}
                        </>
                    ) : (
                        <ToolsTable data={getAllToolsApi.data} isLoading={isLoading} onSelect={edit} />
                    )}
                    {!isLoading && (!getAllToolsApi.data || getAllToolsApi.data.length === 0) && (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img style={{ objectFit: 'cover', height: '20vh', width: 'auto' }} src={ToolEmptySVG} alt='ToolEmptySVG' />
                            </Box>
                            <div>No Tools Created Yet</div>
                        </Stack>
                    )}
                </Stack>
            )}
            <ToolDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></ToolDialog>
        </>
    )
}

export default Tools
