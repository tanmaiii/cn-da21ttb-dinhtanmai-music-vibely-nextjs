"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const contants_1 = require("../utils/contants");
const Permissions_1 = __importDefault(require("./Permissions"));
const RolePermissions_1 = __importDefault(require("./RolePermissions"));
const User_1 = __importDefault(require("./User"));
// Bảng loại quyền
let Roles = class Roles extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], Roles.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(contants_1.SIZE.TITLE),
        unique: true,
    }),
    __metadata("design:type", String)
], Roles.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Permissions_1.default, () => RolePermissions_1.default) // Một loại role có nhiều quyền
    ,
    __metadata("design:type", Array)
], Roles.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => User_1.default) // Bao gồm nhiều người dùng
    ,
    __metadata("design:type", Array)
], Roles.prototype, "users", void 0);
Roles = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "roles",
        modelName: "Roles",
         
    })
], Roles);
exports.default = Roles;
//# sourceMappingURL=Roles.js.map