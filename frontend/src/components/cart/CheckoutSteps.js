import { Step, StepLabel, Stepper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';


// Using Mui stepper and step


const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
        },
        {
            label: <Typography>Confirm Order</Typography>,
        },
        {
            label: <Typography>Payment</Typography>,
        },
    ]

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 136deg, var(--dark-yellow) 0%, orange 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 136deg, var(--dark-yellow) 0%, orange 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    }));
    const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient( 136deg, var(--dark-yellow) 0%, orange 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient( 136deg, var(--dark-yellow) 0%, orange 100%)',
        }),
    }));
    function ColorlibStepIcon(props) {
        const { active, completed, className } = props;

        const icons = {
            1: <LocalShippingIcon />,
            2: <LibraryAddCheckIcon />,
            3: <AccountBalanceWalletIcon />,
        };

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    const style = {
        position: "absolute",
        top: '0.5vmax',
        width: '100%',
        Zindex: '1',
    }

return (
    <>
        <div className="stepperContainer" style={style}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((item, i) => (
                    <Step key={i}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{item.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    </>
)
}

export default CheckoutSteps