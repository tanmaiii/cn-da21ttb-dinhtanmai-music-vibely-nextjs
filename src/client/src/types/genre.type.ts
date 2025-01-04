export interface IGenre {
  id: string;
  title: string;
  description?: string;
  imagePath?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GenreRequestDto {
  title: string;
  description?: string;
  imagePath?: string;
  color?: string;
}
