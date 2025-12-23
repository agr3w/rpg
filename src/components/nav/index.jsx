import React, { useCallback, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  MusicNote as MusicNoteIcon,
  Save as SaveIcon,
  Map as MapIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import { auth } from "APIs/firebaseConfig";
import { signOut } from "firebase/auth";

const PAGE_TITLES = {
  "/": "Início",
  "/fichas": "Fichas",
  "/livros": "Biblioteca",
  "/musicas": "Bardo",
  "/anotacoes": "Anotações",
  "/mapas": "Cartografia",
  "/criar-ficha": "Nova Lenda",
};

function getTitleFromPath(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes("folders")) return "Pastas";
  if (pathname.includes("ficha-completa")) return "Ficha Detalhada";
  return "RPG Organizer";
}

const Nav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = useMemo(
    () => [
      { text: "Início", icon: <HomeIcon />, path: "/" },
      { text: "Fichas", icon: <LibraryBooksIcon />, path: "/fichas" },
      { text: "Livros", icon: <LibraryBooksIcon />, path: "/livros" },
      { text: "Músicas", icon: <MusicNoteIcon />, path: "/musicas" },
      { text: "Mapas", icon: <MapIcon />, path: "/mapas" },
      { text: "Anotações", icon: <SaveIcon />, path: "/anotacoes" },
    ],
    []
  );

  const title = useMemo(() => getTitleFromPath(location.pathname), [location.pathname]);

  const handleMenuOpen = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch {
      // opcional: mostrar toast/snackbar
    }
  }, [navigate]);

  // Scroll progress (desliga se reduced motion)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1100,

          // ✅ sem backdropFilter (custa caro e dá “stutter” em muitos PCs)
          // A textura/gradiente agora vem do theme (MuiAppBar)
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              letterSpacing: 1.1,
              textTransform: "uppercase",
              color: theme.palette.primary.main,
              textShadow: "0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            {title}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={NavLink}
                  to={item.path}
                  // ✅ evita "/" ficar active em tudo
                  end={item.path === "/"}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 1.25,
                    "&.active": {
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.10),
                    },
                    "&:hover": {
                      backgroundColor: alpha("#000", 0.04),
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Tooltip title="Conta">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 0.5 }}>
                <Avatar
                  alt="Avatar"
                  src={auth.currentUser?.photoURL || undefined}
                  sx={{ bgcolor: theme.palette.secondary.main, width: 36, height: 36 }}
                >
                  {auth.currentUser?.displayName?.[0] || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { mt: 1.5, minWidth: 200 } }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Perfil
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {!prefersReducedMotion && (
          <motion.div
            style={{
              scaleX,
              height: "3px",
              background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              transformOrigin: "0%",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              opacity: 0.95,
            }}
          />
        )}
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer} PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar src={auth.currentUser?.photoURL || undefined} sx={{ bgcolor: theme.palette.secondary.main }}>
            {auth.currentUser?.displayName?.[0] || "U"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={900} noWrap>
              {auth.currentUser?.displayName || "Aventureiro"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }} noWrap>
              {auth.currentUser?.email || "—"}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List sx={{ py: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                onClick={handleCloseDrawer}
                sx={{
                  "&.active": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default React.memo(Nav);