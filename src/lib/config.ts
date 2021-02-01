const QBITTORRENT_DEFAULT_HOST = 'localhost';
const QBITTORRENT_DEFAULT_PORT = 8080;
const QBITTORRENT_DEFAULT_PROTOCOL = 'http';

export type Options = {
  deleteFiles: boolean;
  dryRun: boolean;
  maxAge: string;
};

export type Config = {
  qbittorrent: {
    protocol: string;
    host: string;
    port: number;
    username: string;
    password: string;
  };
  options: Options;
};

export function readConfig(): Config {
  return {
    qbittorrent: {
      protocol:
        process.env.QBITTORRENT_PROTOCOL || QBITTORRENT_DEFAULT_PROTOCOL,
      host: process.env.QBITTORRENT_HOST || QBITTORRENT_DEFAULT_HOST,
      port:
        parseInt(process.env.QBITTORRENT_PORT, 10) || QBITTORRENT_DEFAULT_PORT,
      username: process.env.QBITTORRENT_USERNAME,
      password: process.env.QBITTORRENT_PASSWORD,
    },
    options: {
      deleteFiles: !!process.env.DELETE_FILES,
      dryRun: !!process.env.DRY_RUN,
      maxAge: process.env.MAX_TORRENT_AGE,
    },
  };
}
