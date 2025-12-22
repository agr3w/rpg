import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
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
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Switch,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  MusicNote as MusicNoteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

import { useAuth } from "contexts/AuthContext";
import { auth, database } from "APIs/firebaseConfig";

const PATH_LABELS = {
  "": "Início",
  ficheiro: "Fichas",
  fichas: "Fichas",
  livros: "Livros",
  musicas: "Músicas",
  anotacoes: "Anotações",
  mapas: "Mapas",
  login: "Login",
  "Registrar-se": "Registrar",
};

const Nav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // menu / drawer
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // notifications
  const [notifCount, setNotifCount] = useState(0);

  // theme toggle (persists to localStorage and sets data-theme attr)
  const [dark, setDark] = useState(() => {
    const v = localStorage.getItem("rpg-theme");
    return v === "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("rpg-theme", dark ? "dark" : "light");
  }, [dark]);

  // breadcrumbs
  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((seg, idx, arr) => ({ label: PATH_LABELS[seg] ?? seg, path: `/${arr.slice(0, idx + 1).join("/")}` }));

  // auth menu handlers
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSupportClick = () => {
    window.location.href = "mailto:suzanakampa12@gmail.com";
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (err) {
      console.error("Erro durante o logout:", err);
    } finally {
      handleClose();
    }
  };

  // subscribe notifications
  useEffect(() => {
    if (!user) {
      setNotifCount(0);
      return;
    }
    const uid = user.uid;
    const notifRef = database.ref(`notifications/${uid}`);
    const handle = (snap) => {
      const val = snap.val();
      const unread = val ? Object.values(val).filter((n) => !n.read).length : 0;
      setNotifCount(unread);
    };
    notifRef.on("value", handle);
    return () => notifRef.off("value", handle);
  }, [user]);

  // small helper to mark active link style
  const linkSx = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "primary.main" : "text.primary",
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.32 }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(6px)" }} role="navigation" aria-label="Main navigation">
        <Toolbar sx={{ gap: 2 }}>
          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton aria-label="Abrir menu" onClick={() => setDrawerOpen(true)} edge="start" size="large">
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ textDecoration: "none", color: "text.primary", fontWeight: 700, mr: 2 }}
          >
            RPG Organizer
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    
            <Button component={NavLink} to="/" color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>
              Início
            </Button>
            <Button component={NavLink} to="/ajuda" color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>
              Suporte
            </Button>

            {/* profile / avatar */}
            {user ? (
              <>
                <Tooltip title={user.email || "Conta"}>
                  <IconButton onClick={handleMenuOpen} size="large" sx={{ ml: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontWeight: 700 }}>
                      {user.email ? user.email.charAt(0).toUpperCase() : <FiUser />}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: 220 } }}>
                  <MenuItem disabled sx={{ whiteSpace: "normal", py: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user.displayName || user.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { navigate("/perfil"); handleClose(); }}>Perfil</MenuItem>
                  <MenuItem onClick={() => { navigate("/minhas-campanhas"); handleClose(); }}>Minhas Campanhas</MenuItem>
                  <MenuItem onClick={() => { navigate("/configuracoes"); handleClose(); }}>Configurações</MenuItem>
                  <MenuItem onClick={() => { navigate("/faturamento"); handleClose(); }}>Faturamento</MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate("/recentes"); }}>Recentes</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleSupportClick}>Suporte / FAQ</MenuItem>
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button component={NavLink} to="/login">Entrar</Button>
                <Button component={NavLink} to="/Registrar-se" variant="contained" color="primary">Registrar</Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* optional global progress bar for navigation / requests (hook into app-level state if available) */}
        {/* <LinearProgress /> */}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} aria-label="Menu principal">
        <Box sx={{ width: 280 }} role="presentation" onKeyDown={(e) => e.key === "Escape" && setDrawerOpen(false)}>
          <List>
            <ListItem button component={NavLink} to="/" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Início" />
            </ListItem>
            <ListItem button component={NavLink} to="/fichas" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
              <ListItemText primary="Fichas" />
            </ListItem>
            <ListItem button component={NavLink} to="/livros" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
              <ListItemText primary="Livros" />
            </ListItem>
            <ListItem button component={NavLink} to="/musicas" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon><MusicNoteIcon /></ListItemIcon>
              <ListItemText primary="Músicas" />
            </ListItem>
            <ListItem button component={NavLink} to="/anotacoes" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon><SaveIcon /></ListItemIcon>
              <ListItemText primary="Anotações" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><NotificationsIcon /></ListItemIcon>
              <ListItemText primary={`Notificações (${notifCount})`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><HistoryIcon /></ListItemIcon>
              <ListItemText primary="Recentes" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleSupportClick}>
              <ListItemText primary="Suporte / FAQ" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </motion.div>
  );
};

export default Nav;
