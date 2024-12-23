export default interface IArtist {
  id: string;
  name: string;
  slug?: string;
  imagePath?: string;
  roleId?: string;
  followers: number;
  songs: number;
  playlists: number;
}
