const QBITTORRENT_DEFAULT_HOST = 'localhost';
const QBITTORRENT_DEFAULT_PORT = 8080;
const QBITTORRENT_DEFAULT_PROTOCOL = 'http';

export function readConfig() {
  return {
    host: process.env.QBITTORRENT_HOST || QBITTORRENT_DEFAULT_HOST,
    port:
      parseInt(process.env.QBITTORRENT_PORT, 10) || QBITTORRENT_DEFAULT_PORT,
    protocol: process.env.QBITTORRENT_PROTOCOL || QBITTORRENT_DEFAULT_PROTOCOL,
    user: process.env.QBITTORRENT_USER,
    password: process.env.QBITTORRENT_PASSWORD,
    maxAge: process.env.MAX_TORRENT_AGE,
    isDryRun: !!process.env.DRY_RUN,
    deleteFiles: !!process.env.DELETE_FILES,
  };
}
