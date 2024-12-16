"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = exports.SIZE = exports.ROLES = void 0;
const ROLES = {
    ADMIN: "Admin",
    ARTIST: "Artist",
    USER: "User",
};
exports.ROLES = ROLES;
const PERMISSIONS = {
    MANAGE_USERS: "MANAGE_USERS",
    READ_SONGS: "READ_SONGS",
    CREATE_SONGS: "CREATE_SONGS",
    UPDATE_SONGS: "UPDATE_SONGS",
    DELETE_SONGS: "DELETE_SONGS",
    READ_PLAYLISTS: "READ_PLAYLISTS",
    CREATE_PLAYLIST: "CREATE_PLAYLISTS",
    UPDATE_PLAYLISTS: "UPDATE_PLAYLISTS",
    DELETE_PLAYLISTS: "DELETE_SONGS",
    PLAY_SONGS: "PLAY_SONGS",
};
exports.PERMISSIONS = PERMISSIONS;
const SIZE = {
    TITLE: 255,
    DESCRIPTION: 500,
    PATH: 255,
    NAME: 255,
    EMAIL: 255,
    PASSWORD_MIN: 5,
    PASSWORD_MAX: 16,
    UUID: 36,
};
exports.SIZE = SIZE;
//# sourceMappingURL=contants.js.map