import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import { PiInfinity } from 'react-icons/pi'

import nextflow from '@/assets/images/nextflow.svg'
import nextflowDark from '@/assets/images/nextflow_dark.svg'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)
    const theme = useTheme()

    return (
        <div className='flex items-end'>
            <PiInfinity size='2em' color='#000000' />
            {customization.isDarkMode ? <img src={nextflowDark} className='h-8' /> : <img src={nextflow} className='h-8' />}
        </div>
    )
}

export default Logo
