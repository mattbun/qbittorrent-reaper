const QBITTORRENT_DEFAULT_PORT = 8080;

export function readConfig() {
  return {
    host: process.env.QBITTORRENT_HOST,
    port:
      parseInt(process.env.QBITTORRENT_PORT, 10) || QBITTORRENT_DEFAULT_PORT,
    useHttps: !!process.env.USE_HTTPS,
    user: process.env.QBITTORRENT_USER,
    password: process.env.QBITTORRENT_PASSWORD,
    maxAge: process.env.MAX_TORRENT_AGE,
    isDryRun: !!process.env.DRY_RUN,
    deleteFiles: !!process.env.DELETE_FILES,
  };
}
