import React from "react";
import { Card, CardActionArea, CardContent, CardActions, Typography, Button, Stack } from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link as RouterLink } from "react-router-dom";
import { deleteArrayFolder } from "../folderDelete";
import styles from "./FoldersCard.module.css";

const FoldersCard = ({ folder }) => {
  const handleDeleteFolder = () => {
    deleteArrayFolder(folder.id);
    window.location.reload(); // mantém comportamento atual (depois podemos remover via Context)
  };

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/folders/${folder.id}`}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <FolderRoundedIcon />
            <Typography sx={{ fontWeight: 950 }} noWrap>
              {folder?.name || "Pasta"}
            </Typography>
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Abrir pasta
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          onClick={handleDeleteFolder}
          variant="contained"
          color="secondary"
          startIcon={<DeleteRoundedIcon />}
          fullWidth
        >
          Deletar
        </Button>
      </CardActions>
    </Card>
  );
};

export default FoldersCard;
