import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import AuthComponent from "components/SingIn";
import { useTheme } from "@mui/material/styles";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

export default function Login() {
  const theme = useTheme();

  return (
    <>
      <Container maxWidth="md" sx={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
        <motion.div initial="hidden" animate="show" variants={pageVariants} style={{ width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "primary.main" }}>
              Bem-vindo de volta, aventureiro
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>Entre para acessar suas campanhas e recursos</Typography>
          </Box>

          <Paper elevation={0} sx={{ display: "flex", justifyContent: "center", p: { xs: 1, md: 0 } }}>
            <AuthComponent />
          </Paper>
        </motion.div>
      </Container>
    </>
  );
}
