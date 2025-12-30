import React from "react";
import { Box, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterComponent from "components/ComponentRegistrar";
import AuthShell from "components/Auth/AuthShell";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

const Register = () => {
  return (
    <AuthShell
      title="Criar conta"
      subtitle="Crie sua conta e comece a registrar sua jornada."
      elementOverride="parchment"
    >
      <Box component={motion.div} initial="hidden" animate="show" variants={pageVariants}>
        <Stack spacing={2}>
          <Box
            sx={{
              borderRadius: 2.5,
              border: "1px solid var(--rpg-stroke)",
              bgcolor: "rgba(0,0,0,0.06)",
              p: { xs: 1, md: 2 },
            }}
          >
            <RegisterComponent />
          </Box>

          <Divider />

        </Stack>
      </Box>
    </AuthShell>
  );
};

export default Register;
