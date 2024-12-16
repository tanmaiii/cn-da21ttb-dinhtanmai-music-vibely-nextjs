import errorSVG from "@/public/errorimg.b8621065.svg";
import avatar from "@/public/images/avatar.png";
import favorites from "@/public/images/liked-songs.png";
import playlist from "@/public/images/playlist.png";
import song from "@/public/images/song.png";
import logo from "@/public/images/logo.png";

export const paths = {
  HOME: "/",
  LOGIN: "/login",
  TRENDING: "/trending",
  LIVE: "/live",
  ROOM: "/room",
  REGISTER: "/register",
  PROFILE: "/profile",
  PAYLIST: "/playlist",
  SONG: "/song",
  ARTIST: "/artist",
  UPLOAD: "/upload",
  FAVORITES: "/favorites",
  GENRE: "/genre",
  SEARCH: "/search",
  SETTINGS: "/settings",
  NOT_FOUND: "/404",
  ADMIN: "/admin",
};

export const sidebarLinks = [
  {
    title: "",
    items: [
      {
        title: "Home",
        paths: [paths.HOME],
        icon: "fa-light fa-house",
      },
      {
        title: "Search",
        paths: [paths.SEARCH],
        icon: "fa-light fa-magnifying-glass",
      },
      {
        title: "Trending",
        paths: [paths.TRENDING],
        icon: "fa-light fa-fire",
      },
      {
        title: "Room",
        paths: [paths.ROOM],
        icon: "fa-light fa-users-medical",
      },
    ],
  },
  {
    title: "COLLECTION",
    items: [
      {
        title: "Playlist",
        paths: [paths.PAYLIST],
        icon: "fa-light fa-album",
      },
      {
        title: "Favorites",
        paths: [paths.FAVORITES],
        icon: "fa-light fa-heart",
      },
    ],
  },
  {
    title: "DISCOVER",
    items: [
      {
        title: "Artist",
        paths: [paths.ARTIST],
        icon: "fa-light fa-user",
      },
    ],
  },
];

export const navSongPage = [
  {
    id: 1,
    name: "About",
  },
  {
    id: 2,
    name: "Lyrics",
  },
  {
    id: 3,
    name: "Comments",
  },
  {
    id: 4,
    name: "Similar Songs",
  },
];

export const IMAGES = {
  AVATAR: avatar,
  SONG: song,
  PLAYLIST: playlist,
  FAVORITES: favorites,
  ERROR: errorSVG,
  LOGO: logo,
};

export const navRoomPage = [
  {
    id: 1,
    name: "Chat",
  },
  {
    id: 2,
    name: "Request",
  },
  {
    id: 3,
    name: "Members",
  },
];

export const sidebarAdminLinks = [
  {
    title: "",
    items: [
      {
        title: "Home",
        paths: [paths.ADMIN],
        icon: "fa-light fa-house",
      },
      {
        title: "Songs",
        paths: [paths.ADMIN + paths.SONG],
        icon: "fa-light fa-music",
      },
      {
        title: "Genres",
        paths: [paths.ADMIN + paths.GENRE],
        icon: "fa-sharp fa-light fa-list-music",
      },
      {
        title: "Artists",
        paths: [paths.ADMIN + paths.ARTIST],
        icon: "fa-light fa-user",
      },
      {
        title: "Playlists",
        paths: [paths.ADMIN + paths.PAYLIST],
        icon: "fa-light fa-album",
      },
      {
        title: "Rooms",
        paths: [paths.ADMIN + paths.ROOM],
        icon: "fa-light fa-users-medical",
      },
    ],
  },
];
