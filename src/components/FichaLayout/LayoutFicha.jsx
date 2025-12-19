import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

export default function LayoutFicha({ title, children }) {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            border: '1px solid #000', 
            borderRadius: '10px',
            backgroundColor: 'background.paper',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch' /* garante que filhos ocupem largura completa */
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold',
              mb: 3
            }}
          >
            {title}
          </Typography>

          <Box sx={{ width: '100%' }}>
            {children}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}