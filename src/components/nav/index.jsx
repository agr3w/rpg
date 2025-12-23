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

// ✅ Marca D20 inline (sem assets)
function D20Mark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false">
      <path
        d="M32 3 6 18v28l26 15 26-15V18L32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M32 3 20 22l12 39 12-39L32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M6 18h52M20 22 6 46m38-24 14 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
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
      // opcional: toast/snackbar
    }
  }, [navigate]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 });

  // ✅ Indicador “marcador de página” para rota ativa (usa .active do NavLink)
  const bookmarkSx = useMemo(
    () => ({
      position: "relative",
      "&.active": {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.10),
      },
      "&.active::after": {
        content: '""',
        position: "absolute",
        right: 10,
        top: "50%",
        width: 10,
        height: 18,
        transform: "translateY(-50%)",
        background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.95)}, ${alpha(
          theme.palette.primary.main,
          0.85
        )})`,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
        borderRadius: 2,
        opacity: 0.9,
      },
    }),
    [theme]
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1100,

          // ✅ Textura leve de pergaminho (barata)
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.33,
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(0,0,0,0.00) 0px,
                rgba(0,0,0,0.00) 18px,
                rgba(0,0,0,0.045) 19px,
                rgba(0,0,0,0.00) 26px
              )
            `,
          },
        }}
      >
        <Toolbar sx={{ gap: 1.5, position: "relative" }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* ✅ Hierarquia do título + Brasão/D20 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                color: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha("#000", 0.10)}`,
                flex: "0 0 auto",
              }}
            >
              <D20Mark size={22} />
            </Box>

            <Box sx={{ lineHeight: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  letterSpacing: 2.2,
                  textTransform: "uppercase",
                  opacity: 0.75,
                  whiteSpace: "nowrap",
                }}
              >
                RPG Organizer
              </Typography>

              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: theme.palette.primary.main,
                  textShadow: "0 1px 0 rgba(255,255,255,0.35)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: { xs: 180, sm: 360, md: 520 },
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={NavLink}
                  to={item.path}
                  end={item.path === "/"}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 1.25,
                    "&:hover": { backgroundColor: alpha("#000", 0.04) },
                    ...bookmarkSx,
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1 }}>
            <IconButton color="inherit" aria-label="notificações">
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

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: 290,
            // ✅ textura leve no Drawer também
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.25,
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  rgba(0,0,0,0.00) 0px,
                  rgba(0,0,0,0.00) 18px,
                  rgba(0,0,0,0.045) 19px,
                  rgba(0,0,0,0.00) 26px
                )
              `,
            },
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, position: "relative" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha("#000", 0.10)}`,
              flex: "0 0 auto",
            }}
          >
            <D20Mark size={24} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={900} noWrap>
              {auth.currentUser?.displayName || "Aventureiro"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }} noWrap>
              {auth.currentUser?.email || "—"}
            </Typography>
          </Box>

          <Box sx={{ ml: "auto" }}>
            <Avatar src={auth.currentUser?.photoURL || undefined} sx={{ bgcolor: theme.palette.secondary.main }}>
              {auth.currentUser?.displayName?.[0] || "U"}
            </Avatar>
          </Box>
        </Box>

        {/* ✅ Divisor com “runa” */}
        <Divider
          sx={{
            borderColor: alpha("#000", 0.10),
            position: "relative",
            "&::after": {
              content: '"✦"',
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              color: alpha(theme.palette.primary.main, 0.55),
              background: "transparent",
              paddingInline: 1,
            },
          }}
        />

        <List sx={{ py: 1, position: "relative" }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                onClick={handleCloseDrawer}
                sx={{
                  "&.active": { color: theme.palette.primary.main },
                  ...bookmarkSx,
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