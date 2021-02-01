import { readConfig } from './lib/config';
import { QBittorrentClient } from './lib/qbittorrent';
import { removeOldTorrents } from './lib/reaper';

const { qbittorrent: qbConfig, options } = readConfig();

const qbittorrent = new QBittorrentClient(qbConfig);
removeOldTorrents(qbittorrent, options).catch((error) => console.error(error));
