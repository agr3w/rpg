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
  Chip,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  MusicNote as MusicNoteIcon,
  Map as MapIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Folder as FolderIcon,
  ExpandMore,
} from "@mui/icons-material";

import { auth } from "APIs/firebaseConfig";
import { signOut } from "firebase/auth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
// ✅ Importar ícone de segurança para o menu admin
import SecurityIcon from '@mui/icons-material/Security'; 
import InfoIcon from '@mui/icons-material/Info';
import NewReleasesIcon from '@mui/icons-material/NewReleases'; // Para novidades
import WarningIcon from '@mui/icons-material/Warning'; // Para avisos
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Para Lore
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Para Erros

// ✅ Importamos a lógica para saber qual elemento estamos
import { getElementFromPath } from "theme/elementTokens";
import { useSystem } from "hooks/useSystem";

// ✅ 1. CRIAR COMPONENTE ISOLADO DE PROGRESSO (Fora do Nav principal)
// Isso evita que o Nav inteiro renderize a cada pixel de scroll
// const ScrollProgress = React.memo(({ accent, accent2 }) => {
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001,
//   });

//   return (
//     <motion.div
//       style={{
//         scaleX,
//         height: "3px",
//         background: `linear-gradient(90deg, ${accent2}, ${accent})`,
//         transformOrigin: "0%",
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         opacity: 0.95,
//         willChange: "transform", // Dica para a GPU
//       }}
//     />
//   );
// });

const PAGE_TITLES = {
  "/": "Início",
  "/diario": "Diário de Campanha",
  "/npcs": "NPCs",
  "/quests": "Quests",
  "/fichas": "Fichas",
  "/livros": "Biblioteca",
  "/Taverna-do-Bardo": "Taverna do Bardo",
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

// --- CONFIGURAÇÃO DE TEXTURAS POR ELEMENTO ---
const NAV_VARIANTS = {
  // 🔥 FOGO: Madeira queimada, cinzas e brasas
  fire: {
    before: `
      linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)),
      repeating-linear-gradient(90deg, transparent 0px, transparent 12px, rgba(0,0,0,0.35) 13px, transparent 22px),
      repeating-linear-gradient(25deg, transparent 0px, transparent 26px, rgba(0,0,0,0.25) 27px, transparent 34px),
      radial-gradient(circle at 50% 0%, rgba(0,0,0,0.6) 0%, transparent 70%)
    `,
    after: `
      radial-gradient(1px 1px at 12% 40%, rgba(255,255,255,0.35) 0%, transparent 60%),
      radial-gradient(2px 2px at 46% 22%, rgba(255,255,255,0.22) 0%, transparent 60%),
      radial-gradient(80% 140% at 50% 110%, rgba(255,100,0,0.15) 0%, transparent 60%)
    `,
    mixBlendBefore: "multiply",
    mixBlendAfter: "screen",
  },

  // 🧪 VENENO: Metal corroído, lodo e bolhas
  poison: {
    before: `
      linear-gradient(180deg, rgba(10,20,10,0.6), rgba(10,20,10,0.8)),
      radial-gradient(circle at 20% 20%, rgba(0,0,0,0.2) 0%, transparent 20%),
      radial-gradient(circle at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 25%),
      repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, transparent 2px, transparent 8px)
    `,
    after: `
      radial-gradient(circle at 30% 50%, rgba(100,255,50,0.08) 0%, transparent 40%),
      radial-gradient(circle at 70% 50%, rgba(100,255,50,0.05) 0%, transparent 40%),
      linear-gradient(0deg, rgba(50,200,50,0.05) 0%, transparent 30%)
    `,
    mixBlendBefore: "multiply",
    mixBlendAfter: "overlay",
  },

  // ❄️ GELO: Vidro fosco, cristais e ar frio
  ice: {
    before: `
      linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%),
      repeating-linear-gradient(60deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 15px),
      linear-gradient(180deg, rgba(10,30,50,0.4), rgba(10,30,50,0.6))
    `,
    after: `
      radial-gradient(circle at 50% 0%, rgba(200,240,255,0.15) 0%, transparent 70%),
      linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)
    `,
    mixBlendBefore: "overlay",
    mixBlendAfter: "screen",
  },

  // ⚡ RAIO: Estática, linhas nítidas e energia
  lightning: {
    before: `
      linear-gradient(90deg, rgba(0,0,0,0.5), rgba(0,0,0,0.7)),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px),
      linear-gradient(0deg, rgba(0,0,50,0.2) 0%, transparent 100%)
    `,
    after: `
      radial-gradient(circle at 50% 100%, rgba(100,150,255,0.15) 0%, transparent 60%),
      linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%)
    `,
    mixBlendBefore: "multiply",
    mixBlendAfter: "screen",
  },

  // 🌌 VAZIO: Escuridão, estrelas e etéreo
  void: {
    before: `
      linear-gradient(180deg, rgba(5,0,10,0.8), rgba(5,0,10,0.95)),
      radial-gradient(circle at 50% 50%, rgba(40,0,60,0.2) 0%, transparent 80%)
    `,
    after: `
      radial-gradient(1px 1px at 10% 10%, white 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 60%, white 0%, transparent 100%),
      radial-gradient(2px 2px at 80% 30%, rgba(200,150,255,0.5) 0%, transparent 100%),
      radial-gradient(circle at 50% 120%, rgba(138,43,226,0.15) 0%, transparent 50%)
    `,
    mixBlendBefore: "multiply",
    mixBlendAfter: "screen",
  },

  // 📜 PERGAMINHO (Padrão): Madeira polida e couro
  parchment: {
    before: `
      linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4)),
      repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(0,0,0,0.05) 5px, transparent 10px),
      radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)
    `,
    after: `
      linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 10%),
      radial-gradient(circle at 50% 100%, rgba(0,0,0,0.1) 0%, transparent 50%)
    `,
    mixBlendBefore: "multiply",
    mixBlendAfter: "overlay",
  },
};

// Mapeamento de ícones e cores por tipo
const NOTIF_TYPES = {
  info: { icon: AutoStoriesIcon, color: "#29b6f6", label: "Lore Update" },
  success: { icon: NewReleasesIcon, color: "#66bb6a", label: "Novidade" },
  warning: { icon: WarningIcon, color: "#ffa726", label: "Atenção" },
  error: { icon: ReportProblemIcon, color: "#ef5350", label: "Crítico" },
};

const Nav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toolsAnchorEl, setToolsAnchorEl] = useState(null);
  
  // ✅ Estado para o menu de notificações
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  
  const toolsMenuOpen = Boolean(toolsAnchorEl);
  const [toolsOpen, setToolsOpen] = useState(false);

  // ✅ Dados do Sistema
  const system = useSystem();
  const announcement = system.announcement;
  const hasAnnouncement = announcement && announcement.message;

  // ✅ SEU UID DE ADMIN (Para mostrar o botão no perfil)
  const MY_ADMIN_UID = "hKYEhI9JIEPOS2RSON7tsviLzjV2";
  const isAdmin = auth.currentUser?.uid === MY_ADMIN_UID;

  // --- CÓDIGO QUE FALTAVA ---
  
  // ✅ 1. Estado para controlar se é novo
  const [isNewNotification, setIsNewNotification] = useState(false);

  // ✅ 2. Efeito para verificar o localStorage
  useEffect(() => {
    if (hasAnnouncement && announcement.id) {
      const lastSeenId = localStorage.getItem("rpg_last_announcement_id");
      // Se o ID do sistema for diferente do salvo, é novo!
      if (lastSeenId !== String(announcement.id)) {
        setIsNewNotification(true);
      } else {
        setIsNewNotification(false);
      }
    } else {
      setIsNewNotification(false);
    }
  }, [hasAnnouncement, announcement?.id]);

  // ✅ 3. Helper para pegar estilo da notificação atual
  const notifStyle = NOTIF_TYPES[announcement?.type] || NOTIF_TYPES.info;
  const NotifIcon = notifStyle.icon;

  // --- FIM DO CÓDIGO QUE FALTAVA ---

  // ✅ Identifica o elemento atual da rota
  const currentElement = useMemo(() => getElementFromPath(location.pathname), [location.pathname]);
  const navVariant = NAV_VARIANTS[currentElement] || NAV_VARIANTS.parchment;

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
      { text: "Taverna do Bardo", icon: <MusicNoteIcon />, path: "/Taverna-do-Bardo" },
      { text: "Biblioteca Arcana", icon: <EditNoteIcon />, path: "/Biblioteca-Arcana" },
      { text: "NPCs", icon: <PeopleAltRoundedIcon />, path: "/npcs" },
      { text: "Quests", icon: <FactCheckRoundedIcon />, path: "/quests" },
    ],
    []
  );

  const title = useMemo(() => getTitleFromPath(location.pathname), [location.pathname]);

  const handleMenuOpen = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  
  // ✅ Handlers de Notificação
  const handleNotifOpen = useCallback((event) => {
    setNotifAnchorEl(event.currentTarget);
    if (hasAnnouncement && announcement.id) {
      localStorage.setItem("rpg_last_announcement_id", String(announcement.id));
      setIsNewNotification(false); // Para de piscar instantaneamente
    }
  }, [hasAnnouncement, announcement]);

  const handleNotifClose = useCallback(() => setNotifAnchorEl(null), []);

  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleToolsMenuOpen = useCallback((event) => setToolsAnchorEl(event.currentTarget), []);
  const handleToolsMenuClose = useCallback(() => setToolsAnchorEl(null), []);

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

  useEffect(() => {
    setDrawerOpen(false);
    setToolsAnchorEl(null);
    setAnchorEl(null);
  }, [location.pathname]);

  // ✅ Estilo dinâmico para Menus e Drawers
  const dynamicPaperSx = useMemo(
    () => ({
      backgroundColor: "var(--rpg-navBg)",
      border: "1px solid var(--rpg-stroke)",
      overflow: "hidden",
      isolation: "isolate",
      boxShadow: "0 14px 35px rgba(0,0,0,0.22)",
      // Camada de Textura (Before)
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: "var(--rpg-woodOpacity)", // Controla intensidade via CSS var
        backgroundImage: navVariant.before,
        mixBlendMode: navVariant.mixBlendBefore,
        transition: "background-image 0.5s ease",
      },
      // Camada de Efeito/Brilho (After)
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: "var(--rpg-emberOpacity)",
        backgroundImage: navVariant.after,
        mixBlendMode: navVariant.mixBlendAfter,
        transition: "background-image 0.5s ease",
      },
    }),
    [navVariant]
  );

  const toolsMenuPaperSx = useMemo(
    () => ({
      mt: 1.25,
      minWidth: 240,
      borderRadius: 2,
      ...dynamicPaperSx,
      "& .MuiMenu-list": { position: "relative", zIndex: 1, py: 0.75 },
    }),
    [dynamicPaperSx]
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
          // ✅ FORÇAMOS a cor de fundo da variável, ignorando o tema padrão
          backgroundColor: "var(--rpg-navBg) !important", 
          borderBottom: "1px solid var(--rpg-stroke)",
          position: "sticky",
          overflow: "hidden",
          isolation: "isolate",
          transition: "background-color 0.5s ease, border-color 0.5s ease",
          "& .MuiToolbar-root": { position: "relative", zIndex: 1 },
          
          // ✅ Textura Dinâmica
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: "var(--rpg-woodOpacity)",
            backgroundImage: navVariant.before,
            mixBlendMode: navVariant.mixBlendBefore,
            transition: "background-image 0.8s ease-in-out",
          },
          
          // ✅ Efeitos de Luz/Brilho Dinâmicos
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: "var(--rpg-emberOpacity)",
            backgroundImage: navVariant.after,
            mixBlendMode: navVariant.mixBlendAfter,
            transition: "background-image 0.8s ease-in-out",
          },

          // ADICIONAR will-change para evitar repaints
          willChange: "background-color",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* ✅ Hierarquia do título + Brasão/D20 (Agora clicável e com efeito) */}
          <Box 
            component={NavLink}
            to="/"
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              textDecoration: "none", // Remove sublinhado padrão de link
              cursor: "pointer",
              userSelect: "none",
              
              // --- EFEITO DE HOVER ---
              // Quando passar o mouse no container, anima o D20
              "&:hover .d20-wrapper": {
                backgroundColor: "var(--rpg-accent)", // Preenche com a cor do elemento (Fogo, Gelo, etc)
                color: "var(--rpg-navBg)", // Contraste com o fundo
                borderColor: "transparent",
                boxShadow: "0 0 20px var(--rpg-accent)", // Glow mágico
                transform: "rotate(180deg) scale(1.1)", // Giro e leve aumento
              },
              // Efeito sutil no título
              "&:hover .app-title": {
                color: "var(--rpg-accent)",
                textShadow: "0 0 8px var(--rpg-accent)",
              }
            }}
          >
            <Box
              className="d20-wrapper" // Classe alvo para o hover
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
                // Transição "elástica" para dar peso ao movimento
                transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
                  color: "var(--rpg-accent)" // Herda cor do link
                }}
              >
                RPG Organizer
              </Typography>

              <Typography
                variant="h6"
                className="app-title"
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
                  transition: "all 0.3s ease",
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
            
            {/* ✅ ÍCONE DE NOTIFICAÇÕES INTELIGENTE */}
            <IconButton 
              color="inherit" 
              aria-label="notificações"
              onClick={handleNotifOpen}
            >
              <Badge 
                badgeContent={isNewNotification ? "!" : 0} 
                sx={{ 
                  "& .MuiBadge-badge": { 
                    bgcolor: notifStyle.color, // Cor dinâmica baseada no tipo
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: 10, 
                    height: 18, 
                    minWidth: 18,
                    // Só anima se for novo
                    animation: isNewNotification ? "pulse 2s infinite" : "none",
                    "@keyframes pulse": {
                      "0%": { boxShadow: `0 0 0 0 ${alpha(notifStyle.color, 0.7)}` },
                      "70%": { boxShadow: `0 0 0 6px ${alpha(notifStyle.color, 0)}` },
                      "100%": { boxShadow: `0 0 0 0 ${alpha(notifStyle.color, 0)}` }
                    }
                  } 
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* ✅ MENU DE NOTIFICAÇÕES RICO */}
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifClose}
              PaperProps={{ sx: { ...toolsMenuPaperSx, maxWidth: 360, p: 0 } }}
            >
              <Box sx={{ p: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="overline" sx={{ opacity: 0.7, fontWeight: 700 }}>
                  Mural de Avisos
                </Typography>
                {hasAnnouncement && (
                  <Chip 
                    label={notifStyle.label} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: 10, 
                      bgcolor: alpha(notifStyle.color, 0.2), 
                      color: notifStyle.color,
                      border: `1px solid ${alpha(notifStyle.color, 0.3)}`
                    }} 
                  />
                )}
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              
              {hasAnnouncement ? (
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1.5, 
                        bgcolor: alpha(notifStyle.color, 0.1),
                        color: notifStyle.color,
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      <NotifIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {announcement.title && (
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#fff", mb: 0.5 }}>
                          {announcement.title}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                        {announcement.message}
                      </Typography>
                      
                      {/* Botão de Ação (Link) */}
                      {announcement.link && (
                        <Button
                          variant="outlined"
                          size="small"
                          href={announcement.link}
                          target="_blank" // Abre em nova aba
                          rel="noopener noreferrer"
                          sx={{ 
                            mt: 2, 
                            borderColor: alpha(notifStyle.color, 0.5),
                            color: notifStyle.color,
                            "&:hover": {
                              borderColor: notifStyle.color,
                              bgcolor: alpha(notifStyle.color, 0.1)
                            }
                          }}
                        >
                          {announcement.linkText || "Saiba Mais"}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: "center", opacity: 0.5 }}>
                  <Typography variant="body2">O vento sopra silencioso...</Typography>
                  <Typography variant="caption">Nenhum aviso no momento.</Typography>
                </Box>
              )}
            </Menu>

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
              {/* ✅ BOTÃO DE ADMIN (Só aparece para você) */}
              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/master-control");
                  }}
                  sx={{ 
                    color: "#ff4500", 
                    fontWeight: "bold",
                    bgcolor: alpha("#ff4500", 0.05),
                    "&:hover": { bgcolor: alpha("#ff4500", 0.15) }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                    <SecurityIcon fontSize="small" />
                  </ListItemIcon>
                  Painel do Mestre
                </MenuItem>
              )}

              {isAdmin && <Divider sx={{ borderColor: "rgba(255,69,0,0.2)" }} />}

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

        {/* ✅ USAR O COMPONENTE OTIMIZADO AQUI */}
        {/* {!prefersReducedMotion && (
          <ScrollProgress 
            accent="var(--rpg-accent)" 
            accent2="var(--rpg-accent2)" 
          />
        )} */}
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: 290,
            position: "relative",
            ...dynamicPaperSx, // ✅ Aplica o mesmo estilo dinâmico ao Drawer
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

          <ListItem disablePadding>
            <ListItemButton onClick={toggleToolsOpen}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Ferramentas" />
              <ExpandMore 
                sx={{ 
                  transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  color: theme.palette.primary.main
                }} 
              />
            </ListItemButton>
          </ListItem>

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