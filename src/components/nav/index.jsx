import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion"; // Adicionei useScroll e useSpring
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  useMediaQuery,
  useTheme
} from "@mui/material";

// Ícones
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  MusicNote as MusicNoteIcon,
  Save as SaveIcon,
  Map as MapIcon, // Ícone para mapas
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";

// Seus contextos e configs
import { auth } from "APIs/firebaseConfig"; 
import { signOut } from "firebase/auth";

// Mapeamento de rotas para título (simples e direto)
const PAGE_TITLES = {
  "/": "Início",
  "/fichas": "Fichas",
  "/livros": "Biblioteca",
  "/musicas": "Bardo",
  "/anotacoes": "Anotações",
  "/mapas": "Cartografia",
  "/criar-ficha": "Nova Lenda"
};

const Nav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  // Estados locais para UI apenas (Menu e Drawer)
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // --- OTIMIZAÇÃO DE PERFORMANCE (Scroll) ---
  // O Framer Motion gerencia isso fora do ciclo de render do React
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Funções de controle
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const getTitle = () => {
    // Tenta achar o título exato, se não achar, procura se a rota contém (ex: /folders/123)
    const path = location.pathname;
    if (PAGE_TITLES[path]) return PAGE_TITLES[path];
    if (path.includes("folders")) return "Pastas";
    if (path.includes("ficha-completa")) return "Ficha Detalhada";
    return "RPG Organizer";
  };

  // Itens do Menu (para não repetir código no Drawer e na Toolbar)
  const menuItems = [
    { text: "Início", icon: <HomeIcon />, path: "/" },
    { text: "Fichas", icon: <LibraryBooksIcon />, path: "/fichas" },
    { text: "Livros", icon: <LibraryBooksIcon />, path: "/livros" },
    { text: "Músicas", icon: <MusicNoteIcon />, path: "/musicas" },
    { text: "Mapas", icon: <MapIcon />, path: "/mapas" },
    { text: "Anotações", icon: <SaveIcon />, path: "/anotacoes" },
  ];

  return (
    <>
      <AppBar
        position="sticky" // Sticky é melhor que fixed para não cobrir conteúdo
        elevation={0} // Removemos a sombra padrão para usar a nossa customizada
        sx={{
          // --- EFEITO GLASSMORPHISM ---
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Branco translúcido
          backdropFilter: 'blur(12px)', // O efeito de vidro fosco
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          color: theme.palette.text.primary,
          top: 0,
          zIndex: 1100,
        }}
      >
        <Toolbar>
          {/* Menu Mobile Icon */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Título da Página Dinâmico */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: theme.palette.primary.main,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
          >
            {getTitle()}
          </Typography>

          {/* Menu Desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={NavLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    "&.active": {
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      backgroundColor: "rgba(131, 60, 11, 0.08)"
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)"
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Área do Usuário (Notificações e Avatar) */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error"> {/* Conecte seu notifCount aqui */}
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Tooltip title="Configurações da Conta">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                <Avatar 
                  alt="Avatar" 
                  src={auth.currentUser?.photoURL} 
                  sx={{ bgcolor: theme.palette.secondary.main }}
                >
                  {auth.currentUser?.displayName?.[0] || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            {/* Menu Dropdown do Usuário */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { mt: 1.5, minWidth: 180 }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* --- BARRA DE PROGRESSO OTIMIZADA --- */}
        {/* Substituímos o LinearProgress do MUI por uma div do Framer Motion */}
        <motion.div
          style={{
            scaleX, // A mágica acontece aqui: ligado direto ao scroll
            height: "4px",
            background: theme.palette.secondary.main, // Dourado do seu tema
            transformOrigin: "0%",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0
          }}
        />
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
            sx: { width: 250, backgroundColor: theme.palette.background.default }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #ccc' }}>
            <Avatar src={auth.currentUser?.photoURL} />
            <Typography variant="subtitle1" noWrap>
                {auth.currentUser?.displayName || "Aventureiro"}
            </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem 
                button 
                key={item.text} 
                component={NavLink} 
                to={item.path}
                onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Nav;