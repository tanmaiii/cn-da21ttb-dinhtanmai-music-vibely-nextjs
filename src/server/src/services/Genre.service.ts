import path from "path";
import Genre from "../models/Genre";
import fs from "fs";

export const attributesGenre = ["id", "title", "description"];

export default class GenreService {
  static async getAll() {
    return Genre.findAll();
  }

  static async getById(id: string) {
    return Genre.findByPk(id);
  }

  static async create(genre: Partial<Genre>) {
    return Genre.create(genre);
  }

  static async update(id: string, genre: Partial<Genre>) {
    if (genre.imagePath) {
      const oldGenre = await Genre.findByPk(id);
      const imageOldGenre = oldGenre?.imagePath;
      if (imageOldGenre) {
        try {
          // Cố gắng xóa ảnh cũ
          fs.unlinkSync(`./uploads/images/${imageOldGenre}`);
        } catch (error) {
          console.error("Lỗi khi xóa ảnh cũ:", error);
          // Không throw lỗi để tránh làm gián đoạn việc cập nhật
        }
      }
    }

    return Genre.update(genre, { where: { id } });
  }

  static async delete(id: string) {
    const genre = await Genre.findByPk(id);
    if (genre) {
      const imagePath = genre.imagePath;
      if (imagePath) {
        try {
          fs.unlinkSync(`./uploads/images/${imagePath}`);
        } catch (error) {
          console.error("Lỗi khi xóa ảnh:", error);
          // Không throw lỗi để tránh làm gián đoạn việc xóa
        }
      }

      await Genre.destroy({ where: { id } });
    }
  }
}
