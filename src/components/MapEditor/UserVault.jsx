import React, { useState } from "react";
import { Box, Typography, Button, Grid, Paper, CircularProgress, IconButton } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAssetContext } from "APIs/AssetContext";

const UserVault = () => {
  const { userAssets, uploadAsset, deleteAsset, loadingAssets } = useAssetContext();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadAsset(file);
    }
  };

  const handleDragStart = (e, url) => {
    e.dataTransfer.setData("imageUrl", url);
    e.dataTransfer.setData("type", "image");
  };

  return (
    <Box sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column" }}>
      <Button
        variant="outlined" component="label" fullWidth
        startIcon={loadingAssets ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        sx={{ mb: 2, borderColor: "#bf8f00", color: "#bf8f00", "&:hover": { borderColor: "#ffb300", bgcolor: "rgba(191, 143, 0, 0.1)" } }}
        disabled={loadingAssets}
      >
        {loadingAssets ? "Enviando..." : "Upload Imagem"}
        <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
      </Button>

      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        {userAssets.length === 0 ? (
          <Typography variant="caption" sx={{ color: "#78909c", textAlign: "center", display: "block", mt: 2 }}>
            Seu cofre está vazio.
          </Typography>
        ) : (
          <Grid container spacing={1}>
            {userAssets.map((asset) => (
              <Grid item xs={4} key={asset.id}>
                <Box sx={{ position: "relative", group: "true" }}>
                  <Paper
                    draggable
                    onDragStart={(e) => handleDragStart(e, asset.url)}
                    sx={{ 
                      width: "100%", paddingTop: "100%", position: "relative", 
                      bgcolor: "rgba(255,255,255,0.05)", cursor: "grab",
                      backgroundImage: `url(${asset.url})`, backgroundSize: "cover", backgroundPosition: "center",
                      "&:hover": { border: "1px solid #bf8f00" }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => deleteAsset(asset.id)}
                    sx={{ 
                      position: "absolute", top: 0, right: 0, bgcolor: "rgba(0,0,0,0.7)", color: "#ef5350", p: 0.5,
                      "&:hover": { bgcolor: "#000" }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default UserVault;