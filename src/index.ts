import { readConfig } from './lib/config';
import { subtractFromToday } from './lib/date';
import { QBittorrentClient } from './lib/qbittorrent';

const config = readConfig();

(async () => {
  console.info(`Connecting to qbittorrent at ${config.host}...`);
  const qbittorrent = new QBittorrentClient(config.host);
  await qbittorrent.login(config.user, config.password);

  console.info('Connected! Getting torrents...');
  const allTorrents = await qbittorrent.getTorrents();

  const earliestTorrentDate = subtractFromToday(config.maxAge);
  console.log(`Looking for torrents added before ${earliestTorrentDate}`);
  const oldTorrents = allTorrents
    .filter((torrent) => torrent.addedOn < earliestTorrentDate)
    .sort((a, b) => a.addedOn.getTime() - b.addedOn.getTime());

  if (oldTorrents.length < 1) {
    console.info('Nothing to delete');
    return;
  }

  console.info('Deleting torrents...');
  oldTorrents.forEach((torrent) => console.info(`  ${torrent.name}`));

  if (!config.isDryRun) {
    await qbittorrent.deleteTorrents(oldTorrents, config.deleteFiles);
  }

  console.info('Done');
})().catch((error) => console.error(error));
