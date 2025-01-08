export interface IMood {
  id: string;
  title: string;
  description?: string;
}

export interface MoodRequestDto {
  title: string;
  description?: string;
}
