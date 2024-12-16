"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortedSongs = void 0;
exports.getFilePath = getFilePath;
exports.formatStringToSlug = formatStringToSlug;
function getFilePath(files, field) {
    var _a, _b;
    return ((_b = (_a = files === null || files === void 0 ? void 0 : files[field]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename) || "";
}
function formatStringToSlug(str) {
    const accentsMap = {
        àáạảãâầấậẩẫăằắặẳẵ: "a",
        èéẹẻẽêềếệểễ: "e",
        ìíịỉĩ: "i",
        òóọỏõôồốộổỗơờớợởỡ: "o",
        ùúụủũưừứựửữ: "u",
        ỳýỵỷỹ: "y",
        đ: "d",
        ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ: "A",
        ÈÉẸẺẼÊỀẾỆỂỄ: "E",
        ÌÍỊỈĨ: "I",
        ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ: "O",
        ÙÚỤỦŨƯỪỨỰỬỮ: "U",
        ỲÝỴỶỸ: "Y",
        Đ: "D",
    };
    // Thay thế các ký tự có dấu bằng ký tự không dấu
    for (const pattern in accentsMap) {
        const regex = new RegExp("[" + pattern + "]", "g");
        str = str.replace(regex, accentsMap[pattern]);
    }
    // Chuyển chuỗi về dạng chữ thường
    return str.toLowerCase();
}
const getSortedSongs = (sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    let order = [];
    switch (sortBy) {
        case "newest":
            order = [["createdAt", "DESC"]];
            break;
        case "oldest":
            order = [["createdAt", "ASC"]];
            break;
        case "most_likes":
            order = [["likes", "DESC"]];
            break;
        case "most_listens":
            order = [["listens", "DESC"]];
            break;
        default:
            order = [["createdAt", "DESC"]]; // Sắp xếp mặc định là mới nhất
            break;
    }
    return order;
});
exports.getSortedSongs = getSortedSongs;
//# sourceMappingURL=commonUtils.js.map