import fichaImg from "./CardsImgs/fichanova.png";
import mapasImg from "./CardsImgs/MapsIcon.png";
import livrosImg from "./CardsImgs/livroDragao.png";
import musicasImg from "./CardsImgs/notanova.png";
import anotacoesImg from "./CardsImgs/Caderno.png";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

export const CARDS = {
  ficha: {
    id: "ficha",
    title: "Fichas",
    description: "Crie e gerencie personagens e campanhas.",
    to: "/fichas",
    image: fichaImg,
    accent: "primary",
    badge: "Principal",
    icon: BadgeRoundedIcon, // ✅
  },
  mapas: {
    id: "mapas",
    title: "Cartografia",
    description: "Mapas, referências e exploração visual.",
    to: "/mapas",
    image: mapasImg,
    accent: "primary",
    badge: "Principal",
    icon: MapRoundedIcon, // ✅
  },
  anotacoes: {
    id: "anotacoes",
    title: "Anotações",
    description: "Organize ideias, sessões e lembretes.",
    to: "/anotacoes",
    image: anotacoesImg,
    accent: "secondary",
    badge: "Ferramenta",
    icon: EditNoteRoundedIcon, // ✅
  },
  musicas: {
    id: "musicas",
    title: "Bardo",
    description: "Trilhas, playlists e controle de ambiente.",
    to: "/musicas",
    image: musicasImg,
    accent: "secondary",
    badge: "Ferramenta",
    icon: MusicNoteRoundedIcon, // ✅
  },
  livros: {
    id: "livros",
    title: "Biblioteca",
    description: "Arquivos, PDFs e materiais de apoio.",
    to: "/livros",
    image: livrosImg,
    accent: "secondary",
    badge: "Ferramenta",
    icon: MenuBookRoundedIcon, // ✅
  },
  diario: {
    id: "diario",
    title: "Diário de Campanha",
    description: "Registre sessões, decisões, NPCs, loot e XP.",
    to: "/diario",
    image: anotacoesImg,
    accent: "primary",
    badge: "Principal",
    icon: EditNoteRoundedIcon,
  },
  npcs: {
    id: "npcs",
    title: "NPCs",
    description: "Veja e edite NPCs por campanha.",
    to: "/npcs",
    image: anotacoesImg,
    accent: "primary",
    badge: "Campanha",
    icon: PeopleAltRoundedIcon,
  },
};

// Seções prontas pra Home (fácil adicionar novos)
export const HOME_SECTIONS = [
  {
    key: "campanha",
    title: "Comece pela Campanha",
    subtitle:
      "O núcleo da plataforma: diário de sessão + fichas + mapas. Tudo conectado.",
    chipLabel: "Principal",
    accent: "primary",
    items: [CARDS.diario, CARDS.npcs, CARDS.ficha, CARDS.mapas], // ✅ add CARDS.npcs
  },
  {
    key: "ferramentas",
    title: "Ferramentas & Arquivos",
    subtitle:
      "Seu acervo: anotações, biblioteca e músicas. Aqui entram as próximas ferramentas do site.",
    chipLabel: "Extras",
    accent: "secondary",
    items: [CARDS.anotacoes, CARDS.musicas, CARDS.livros],
  },
];