const QBITTORRENT_DEFAULT_HOST = 'localhost';
const QBITTORRENT_DEFAULT_PORT = 8080;
const QBITTORRENT_DEFAULT_PROTOCOL = 'http';

export type QBittorrentConfig = {
  protocol: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

export type Options = {
  deleteFiles: boolean;
  dryRun: boolean;
  maxAge: string;
};

export type Config = {
  qbittorrent: QBittorrentConfig;
  options: Options;
};

export function readConfig(): Config {
  const config = {
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

  if (!config.options.maxAge) {
    throw new Error('Please specify a MAX_TORRENT_AGE');
  }

  return config;
}
