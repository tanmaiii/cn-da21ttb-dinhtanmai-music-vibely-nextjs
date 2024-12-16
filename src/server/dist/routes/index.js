"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_routes_1 = __importDefault(require("./user.routes"));
const song_routes_1 = __importDefault(require("./song.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const genre_routes_1 = __importDefault(require("./genre.routes"));
const playlist_routes_1 = __importDefault(require("./playlist.routes"));
const role_routes_1 = __importDefault(require("./role.routes"));
const artists_routes_1 = __importDefault(require("./artists.routes"));
exports.default = () => {
    // Define your routes here
    /**
     * @openapi
     * tags:
     *  - name: Auth
     *    description: Authentication
     *    externalDocs:
     *      description: Find out more
     *  - name: Users
     *    description: User management
     *    externalDocs:
     *     description: Find out more
     *  - name: Songs
     *    description: Song management
     *    externalDocs:
     *      description: Find out more
     */
    router.use("/auth", auth_routes_1.default);
    router.use("/user", user_routes_1.default);
    router.use("/song", song_routes_1.default);
    router.use("/genre", genre_routes_1.default);
    router.use("/playlist", playlist_routes_1.default);
    router.use("/role", role_routes_1.default);
    router.use("/artist", artists_routes_1.default);
    return router;
};
//# sourceMappingURL=index.js.map