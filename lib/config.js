module.exports = function readConfig() {
  return {
    host: process.env.QBITTORRENT_HOST,
    user: process.env.QBITTORRENT_USER,
    password: process.env.QBITTORRENT_PASSWORD,
    maxAge: process.env.MAX_TORRENT_AGE,
    isDryRun: !!process.env.DRY_RUN,
  };
}
