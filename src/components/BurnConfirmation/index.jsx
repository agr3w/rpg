import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const BurnConfirmation = ({ open, onClose, onConfirm, title, description, isFolder = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#fffaf0",
          border: "3px solid #833c0b",
          backgroundImage: `linear-gradient(to bottom right, rgba(255,0,0,0.05), rgba(0,0,0,0.05))`,
          borderRadius: 2,
          maxWidth: "450px",
          boxShadow: "0 0 20px rgba(131, 60, 11, 0.4)"
        }
      }}
    >
      <Box sx={{ textAlign: "center", pt: 3 }}>
        <LocalFireDepartmentIcon sx={{ fontSize: 60, color: "#d32f2f", filter: "drop-shadow(0 0 5px orange)" }} />
      </Box>

      <DialogTitle sx={{ textAlign: "center", fontFamily: "Cinzel", fontWeight: "bold", color: "#833c0b", fontSize: "1.5rem" }}>
        {title || "Incinerar Pergaminho?"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, bgcolor: "rgba(211, 47, 47, 0.1)", p: 2, borderRadius: 1, border: "1px dashed #d32f2f" }}>
          <WarningAmberIcon color="error" />
          <Typography variant="body2" sx={{ fontFamily: '"Crimson Text", serif', fontSize: "1.1rem", color: "#5d4037" }}>
            {description || "Esta ação é irreversível. As cinzas não poderão ser lidas novamente. Tem certeza que deseja continuar?"}
          </Typography>
        </Box>
        {isFolder && (
          <Typography variant="caption" color="error" sx={{ display: "block", mt: 2, textAlign: "center", fontWeight: "bold" }}>
            Atenção: Todos os pergaminhos dentro desta gaveta também serão destruídos!
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderColor: "#5d4037", 
            color: "#5d4037", 
            fontFamily: "Cinzel",
            "&:hover": { bgcolor: "rgba(93, 64, 55, 0.1)" }
          }}
        >
          Poupar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          startIcon={<LocalFireDepartmentIcon />}
          sx={{ 
            fontFamily: "Cinzel", 
            fontWeight: "bold",
            bgcolor: "#d32f2f",
            "&:hover": { bgcolor: "#b71c1c", boxShadow: "0 0 10px rgba(255,0,0,0.5)" }
          }}
        >
          Queimar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BurnConfirmation;