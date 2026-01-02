import React, { useCallback, useMemo, useState, useEffect } from "react";
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
  Collapse,
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
  Folder as FolderIcon,
  ExpandMore, // Usaremos apenas este e rotacionaremos
} from "@mui/icons-material";

import { auth } from "APIs/firebaseConfig";
import { signOut } from "firebase/auth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";

const PAGE_TITLES = {
  "/": "Início",
  "/diario": "Diário de Campanha",
  "/npcs": "NPCs",
  "/quests": "Quests",
  "/fichas": "Fichas",
  "/livros": "Biblioteca",
  "/musicas": "Bardo",
  "/anotacoes": "Anotações",
  "/mapas": "Cartografia",
  "/criar-ficha": "Nova Lenda",
  "/perfil": "Perfil",
};

function getTitleFromPath(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes("folders")) return "Pastas";
  if (pathname.includes("ficha-completa")) return "Ficha Detalhada";
  if (pathname.startsWith("/npcs/")) return "NPC";
  if (pathname.startsWith("/quests/")) return "Quest";
  return "RPG Organizer";
}

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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [toolsAnchorEl, setToolsAnchorEl] = useState(null);
  const toolsMenuOpen = Boolean(toolsAnchorEl);

  // Alterado para false: Começa fechado para manter a UI limpa
  const [toolsOpen, setToolsOpen] = useState(false);

  const mainItems = useMemo(
    () => [
      { text: "Início", icon: <HomeIcon />, path: "/" },
      { text: "Fichas", icon: <LibraryBooksIcon />, path: "/fichas" },
      { text: "Mapas", icon: <MapIcon />, path: "/mapas" },
    ],
    []
  );

  const toolsItems = useMemo(
    () => [
      { text: "Biblioteca", icon: <LibraryBooksIcon />, path: "/livros" },
      { text: "Bardo", icon: <MusicNoteIcon />, path: "/musicas" },
      { text: "Anotações", icon: <EditNoteIcon />, path: "/anotacoes" },
      { text: "NPCs", icon: <PeopleAltRoundedIcon />, path: "/npcs" },
      { text: "Quests", icon: <FactCheckRoundedIcon />, path: "/quests" },
    ],
    []
  );

  const title = useMemo(() => getTitleFromPath(location.pathname), [location.pathname]);

  const handleMenuOpen = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleToolsMenuOpen = useCallback((event) => setToolsAnchorEl(event.currentTarget), []);
  const handleToolsMenuClose = useCallback(() => setToolsAnchorEl(null), []);

  // ✅ FIX: StopPropagation evita conflitos de evento e garante renderização limpa
  const toggleToolsOpen = useCallback((e) => {
    if (e) e.stopPropagation();
    setToolsOpen((v) => !v);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  }, [navigate]);

  // Este useEffect garante que tudo se feche ao mudar de rota
  useEffect(() => {
    setDrawerOpen(false);
    setToolsAnchorEl(null);
    setAnchorEl(null);
  }, [location.pathname]);

  const toolsMenuPaperSx = useMemo(
    () => ({
      mt: 1.25,
      minWidth: 240,
      borderRadius: 2,
      backgroundColor: "var(--rpg-navBg)",
      border: "1px solid var(--rpg-stroke)",
      overflow: "hidden",
      isolation: "isolate",
      boxShadow: "0 14px 35px rgba(0,0,0,0.22)",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: "var(--rpg-woodOpacity)", 
        mixBlendMode: "multiply",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: "var(--rpg-emberOpacity)",
        backgroundImage: `
          radial-gradient(1px 1px at 12% 40%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%),
          radial-gradient(2px 2px at 46% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%),
          radial-gradient(1px 1px at 78% 52%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 60%),
          radial-gradient(7px 7px at 18% 66%, color-mix(in srgb, var(--rpg-accent2) 60%, transparent) 0%, transparent 60%),
          radial-gradient(5px 5px at 62% 42%, color-mix(in srgb, var(--rpg-accent) 55%, transparent) 0%, transparent 62%),
          radial-gradient(6px 6px at 84% 32%, color-mix(in srgb, var(--rpg-accent2) 45%, transparent) 0%, transparent 62%),
          radial-gradient(80% 140% at 50% 110%, rgba(255,120,0,0.10) 0%, rgba(255,120,0,0.00) 60%)
        `,
        mixBlendMode: "screen",
      },
      "& .MuiMenu-list": { position: "relative", zIndex: 1, py: 0.75 },
    }),
    []
  );

  const handleToolsNavigate = useCallback(
    (path) => {
      handleToolsMenuClose();
      navigate(path);
    },
    [handleToolsMenuClose, navigate]
  );

  const bookmarkSx = useMemo(
    () => ({
      position: "relative",
      "&.active": {
        color: "var(--rpg-accent)",
        backgroundColor: "rgba(0,0,0,0.06)",
      },
      "&.active::after": {
        content: '""',
        position: "absolute",
        right: 10,
        top: "50%",
        width: 10,
        height: 18,
        transform: "translateY(-50%)",
        background: "linear-gradient(180deg, var(--rpg-accent2), var(--rpg-accent))",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
        borderRadius: 2,
        opacity: 0.9,
      },
    }),
    []
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1100,
          backgroundColor: "var(--rpg-navBg)",
          borderBottom: "1px solid var(--rpg-stroke)",
          position: "sticky",
          overflow: "hidden",
          isolation: "isolate",
          "& .MuiToolbar-root": { position: "relative", zIndex: 1 },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: "var(--rpg-woodOpacity)",
            backgroundImage: `
              linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55)),

              /* veios horizontais queimados */
              repeating-linear-gradient(
                90deg,
                rgba(0,0,0,0.00) 0px,
                rgba(0,0,0,0.00) 12px,
                rgba(0,0,0,0.26) 13px,
                rgba(0,0,0,0.00) 22px
              ),

              /* micro-rachas diagonais (dão aspecto “quebrado”) */
              repeating-linear-gradient(
                25deg,
                rgba(0,0,0,0.00) 0px,
                rgba(0,0,0,0.00) 26px,
                rgba(0,0,0,0.22) 27px,
                rgba(0,0,0,0.00) 34px
              ),
              repeating-linear-gradient(
                -22deg,
                rgba(0,0,0,0.00) 0px,
                rgba(0,0,0,0.00) 30px,
                rgba(0,0,0,0.18) 31px,
                rgba(0,0,0,0.00) 40px
              ),

              /* vinheta de fuligem */
              radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.00) 70%),
              radial-gradient(120% 95% at 50% 120%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.00) 72%)
            `,
            mixBlendMode: "multiply",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: "var(--rpg-emberOpacity)",
            backgroundImage: `
              /* cinzas (pontos claros) */
              radial-gradient(1px 1px at 12% 40%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%),
              radial-gradient(2px 2px at 46% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%),
              radial-gradient(1px 1px at 78% 52%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 60%),

              /* brasas (puxam do elemento via vars) */
              radial-gradient(7px 7px at 18% 66%, color-mix(in srgb, var(--rpg-accent2) 60%, transparent) 0%, transparent 60%),
              radial-gradient(5px 5px at 62% 42%, color-mix(in srgb, var(--rpg-accent) 55%, transparent) 0%, transparent 62%),
              radial-gradient(6px 6px at 84% 32%, color-mix(in srgb, var(--rpg-accent2) 45%, transparent) 0%, transparent 62%),

              /* brilho quente bem sutil */
              radial-gradient(80% 140% at 50% 110%, rgba(255,120,0,0.10) 0%, rgba(255,120,0,0.00) 60%)
            `,
            mixBlendMode: "screen",
          },
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
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
                color: "var(--rpg-accent2)",
                background: "rgba(0,0,0,0.18)",
                border: "1px solid var(--rpg-stroke)",
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
                sx={{
                  fontWeight: 900,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: "var(--rpg-accent)",
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
              {mainItems.map((item) => (
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

              {/* ✅ Agrupador: Ferramentas (Livros/Músicas/Anotações) */}
              <Button
                color="inherit"
                startIcon={<FolderIcon />}
                onClick={handleToolsMenuOpen}
                sx={{ borderRadius: 2, px: 1.25, "&:hover": { backgroundColor: alpha("#000", 0.04) } }}
              >
                Ferramentas
              </Button>

              <Menu
                anchorEl={toolsAnchorEl}
                open={toolsMenuOpen}
                onClose={handleToolsMenuClose}
                keepMounted
                PaperProps={{ sx: toolsMenuPaperSx }}
              >
                {toolsItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => handleToolsNavigate(item.path)}
                    sx={{
                      borderRadius: 1.5,
                      mx: 0.75,
                      my: 0.25,
                      color: "inherit",
                      "&:hover": { backgroundColor: alpha("#000", 0.06) },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38, color: "inherit", opacity: 0.9 }}>
                      {item.icon}
                    </ListItemIcon>
                    <Typography sx={{ fontWeight: 800, color: "inherit" }}>{item.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
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
              PaperProps={{ sx: toolsMenuPaperSx }}
              sx={{ borderRadius: 1.5, mx: 0.75, my: 0.25, color: "inherit", "&:hover": { backgroundColor: alpha("#000", 0.06) } }}

            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/perfil");
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: "inherit", opacity: 0.9 }}>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Perfil
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon sx={{ minWidth: 38, color: "inherit", opacity: 0.9 }}>
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
              background: "linear-gradient(90deg, var(--rpg-accent2), var(--rpg-accent))",
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
            position: "relative",
            backgroundColor: "var(--rpg-navBg)",
            borderRight: "1px solid var(--rpg-stroke)",
            overflow: "hidden",
            isolation: "isolate",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: "var(--rpg-woodOpacity)",
              backgroundImage: `
                linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.55)),
                repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 12px, rgba(0,0,0,0.24) 13px, rgba(0,0,0,0) 22px),
                repeating-linear-gradient(25deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 26px, rgba(0,0,0,0.18) 27px, rgba(0,0,0,0) 34px),
                radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 70%),
                radial-gradient(120% 95% at 50% 120%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 72%)
              `,
              mixBlendMode: "multiply",
            },

            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: "var(--rpg-emberOpacity)",
              backgroundImage: `
                radial-gradient(1px 1px at 18% 26%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 60%),
                radial-gradient(2px 2px at 70% 38%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%),
                radial-gradient(7px 7px at 22% 72%, color-mix(in srgb, var(--rpg-accent2) 55%, transparent) 0%, transparent 60%),
                radial-gradient(5px 5px at 62% 56%, color-mix(in srgb, var(--rpg-accent) 50%, transparent) 0%, transparent 62%)
              `,
              mixBlendMode: "screen",
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
          {mainItems.map((item) => (
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

          {/* ✅ Grupo Ferramentas (Collapse Corrigido) */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleToolsOpen}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Ferramentas" />
              {/* Animação de rotação suave em vez de troca de ícone */}
              <ExpandMore 
                sx={{ 
                  transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  color: theme.palette.primary.main
                }} 
              />
            </ListItemButton>
          </ListItem>

          {/* ✅ FIX: Removido unmountOnExit para evitar congelamento em listas complexas */}
          <Collapse in={toolsOpen} timeout="auto">
            <List component="div" disablePadding sx={{ pl: 1 }}>
              {toolsItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={handleCloseDrawer}
                    sx={{
                      pl: 4,
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
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default React.memo(Nav);