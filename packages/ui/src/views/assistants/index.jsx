import { useEffect, useState } from 'react'

// material-ui
import { Box, Stack, Button, Skeleton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import AssistantEmptySVG from '@/assets/images/assistant_empty.svg'
import { StyledButton } from '@/ui-component/button/StyledButton'
import AssistantDialog from './AssistantDialog'
import LoadAssistantDialog from './LoadAssistantDialog'

// API
import assistantsApi from '@/api/assistants'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'
import { PiPlus, PiUpload } from 'react-icons/pi'

// ==============================|| CHATFLOWS ||============================== //

const Assistants = () => {
    const theme = useTheme()
    const getAllAssistantsApi = useApi(assistantsApi.getAllAssistants)

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showLoadDialog, setShowLoadDialog] = useState(false)
    const [loadDialogProps, setLoadDialogProps] = useState({})

    const loadExisting = () => {
        const dialogProp = {
            title: 'Load Existing Assistant'
        }
        setLoadDialogProps(dialogProp)
        setShowLoadDialog(true)
    }

    const onAssistantSelected = (selectedOpenAIAssistantId, credential) => {
        setShowLoadDialog(false)
        addNew(selectedOpenAIAssistantId, credential)
    }

    const addNew = (selectedOpenAIAssistantId, credential) => {
        const dialogProp = {
            title: '添加助手',
            type: 'ADD',
            cancelButtonName: '取消',
            confirmButtonName: '添加',
            selectedOpenAIAssistantId,
            credential
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (selectedAssistant) => {
        const dialogProp = {
            title: '编辑助手',
            type: 'EDIT',
            cancelButtonName: '取消',
            confirmButtonName: '保存',
            data: selectedAssistant
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getAllAssistantsApi.request()
    }

    useEffect(() => {
        getAllAssistantsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAssistantsApi.loading)
    }, [getAllAssistantsApi.loading])

    useEffect(() => {
        if (getAllAssistantsApi.error) {
            setError(getAllAssistantsApi.error)
        }
    }, [getAllAssistantsApi.error])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader title='OpenAI 助手'>
                        <Button variant='contained' onClick={loadExisting} startIcon={<PiUpload size='0.8em' />}>
                            导入
                        </Button>
                        <StyledButton variant='contained' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            添加
                        </StyledButton>
                    </ViewHeader>
                    {isLoading ? (
                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                            <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                            <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                            <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                        </Box>
                    ) : (
                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                            {getAllAssistantsApi.data &&
                                getAllAssistantsApi.data.map((data, index) => (
                                    <ItemCard
                                        data={{
                                            name: JSON.parse(data.details)?.name,
                                            description: JSON.parse(data.details)?.instructions,
                                            iconSrc: data.iconSrc
                                        }}
                                        key={index}
                                        onClick={() => edit(data)}
                                    />
                                ))}
                        </Box>
                    )}
                    {!isLoading && (!getAllAssistantsApi.data || getAllAssistantsApi.data.length === 0) && (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '20vh', width: 'auto' }}
                                    src={AssistantEmptySVG}
                                    alt='AssistantEmptySVG'
                                />
                            </Box>
                            <div>No Assistants Added Yet</div>
                        </Stack>
                    )}
                </Stack>
            )}
            <LoadAssistantDialog
                show={showLoadDialog}
                dialogProps={loadDialogProps}
                onCancel={() => setShowLoadDialog(false)}
                onAssistantSelected={onAssistantSelected}
                setError={setError}
            ></LoadAssistantDialog>
            <AssistantDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AssistantDialog>
        </>
    )
}

export default Assistants
