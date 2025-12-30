import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";

// Conector personalizado (a linha entre os passos)
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#833c0b", // Cor primária (Couro/Ferrugem)
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#833c0b",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "rgba(0,0,0,0.12)",
    borderTopWidth: 3,
    borderRadius: 1,
    transition: "border-color 0.4s ease",
  },
}));

// Ícone do passo (a bolinha)
const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: "rgba(0,0,0,0.2)",
  display: "flex",
  height: 22,
  alignItems: "center",
  transition: "all 0.3s ease",
  ...(ownerState.active && {
    color: "#833c0b",
    transform: "scale(1.2)",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#833c0b",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    border: ownerState.active ? "2px solid #bf8f00" : "none", // Borda dourada no ativo
    boxShadow: ownerState.active ? "0 0 8px rgba(191, 143, 0, 0.6)" : "none",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

export default function FichaStepper({ activeStep, steps }) {
  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 900,
          color: "#2c1a10",
          mb: 3,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Criar Ficha
      </Typography>

      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={QontoStepIcon}
              sx={{
                "& .MuiStepLabel-label": {
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  mt: 1,
                  color: "rgba(44, 26, 16, 0.6)",
                  "&.Mui-active": {
                    color: "#833c0b",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                  },
                  "&.Mui-completed": {
                    color: "#5c4033",
                  },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}