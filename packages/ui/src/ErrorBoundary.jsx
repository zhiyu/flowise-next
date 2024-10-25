import PropTypes from 'prop-types'

import { Box, Card, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { IconCopy } from '@tabler/icons-react'

const ErrorBoundary = ({ error }) => {
    const theme = useTheme()

    const copyToClipboard = () => {
        const errorMessage = `Status: ${error.response.status}\n${error.response.data.message}`
        navigator.clipboard.writeText(errorMessage)
    }

    return (
        <Box sx={{ padding: '120px 20px' }}>
            <Stack flexDirection='column' sx={{ alignItems: 'center', gap: 3 }}>
                <Stack flexDirection='column' sx={{ alignItems: 'center', gap: 1 }}>
                    <Typography variant='h2'>出错啦!</Typography>
                </Stack>
                <Card variant='outlined'>
                    <Box sx={{ position: 'relative', px: 2, py: 3 }}>
                        <pre style={{ margin: 0 }}>
                            <code>{`Status: ${error.response.status}`}</code>
                            <br />
                            <code>{error.response.data.message}</code>
                        </pre>
                    </Box>
                </Card>
                <Typography variant='body1' sx={{ fontSize: '1.1rem', textAlign: 'center', lineHeight: '1.5' }}>
                    请稍后重试。
                </Typography>
            </Stack>
        </Box>
    )
}

ErrorBoundary.propTypes = {
    error: PropTypes.object
}

export default ErrorBoundary
