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
const RolePermissions_1 = __importDefault(require("./RolePermissions"));
const Roles_1 = __importDefault(require("./Roles"));
// Bảng quyền
let Permissions = class Permissions extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], Permissions.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(contants_1.SIZE.TITLE),
        unique: true,
    }),
    __metadata("design:type", String)
], Permissions.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: true,
        type: sequelize_typescript_1.DataType.STRING(contants_1.SIZE.DESCRIPTION),
    }),
    __metadata("design:type", String)
], Permissions.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Roles_1.default, () => RolePermissions_1.default) // Một loại role có nhiều quyền
    ,
    __metadata("design:type", Array)
], Permissions.prototype, "roles", void 0);
Permissions = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "permissions",
        modelName: "Permissions",
         
    })
], Permissions);
exports.default = Permissions;
//# sourceMappingURL=Permissions.js.map