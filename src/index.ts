import * as Bluebird from 'bluebird';
import * as api from 'qbittorrent-api-v2';

import { readConfig } from './lib/config';
import { subtractFromToday } from './lib/date';
import { parseTorrent, Torrent, QBTorrent } from './lib/qbittorrent';

const config = readConfig();

(async () => {
  console.info(`Connecting to qbittorrent at ${config.host}...`);
  const qbittorrent = await api.connect(
    config.host,
    config.user,
    config.password
  );

  console.info('Connected! Getting torrents...');
  const torrents: Array<QBTorrent> = await qbittorrent.torrents();

  const earliestTorrentDate = subtractFromToday(config.maxAge);
  console.log(`Looking for torrents added before ${earliestTorrentDate}`);
  const oldTorrents = torrents
    .map(parseTorrent)
    .filter((torrent) => torrent.addedOn < earliestTorrentDate)
    .sort((a, b) => a.addedOn.getTime() - b.addedOn.getTime());

  await Bluebird.each<Torrent>(oldTorrents, (torrent) => {
    process.stdout.write(`Removing ${torrent.name}...`);

    if (!config.isDryRun) {
      // TODO actually delete the torrent
      process.stdout.write('TODO...');
    }

    process.stdout.write(' Done\n');
  });
})().catch((error) => console.error(error));
