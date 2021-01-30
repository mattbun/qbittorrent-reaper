const Promise = require('bluebird');
const api = require('qbittorrent-api-v2');

const readConfig = require('./lib/config');
const { subtractFromToday, convertQBDateToDate } = require('./lib/date');

const config = readConfig();

(async () => {
  console.info(`Connecting to qbittorrent at ${config.host}...`);
  const qbittorrent = await api.connect(config.host, config.user, config.password);

  console.info('Connected! Getting torrents...');
  const torrents = await qbittorrent.torrents();

  const earliestTorrentDate = subtractFromToday(config.maxAge);
  console.log(`Looking for torrents added before ${earliestTorrentDate}`);
  const oldTorrents = torrents
    .map(torrent => ({
      hash: torrent.hash,
      name: torrent.name,
      added_on: convertQBDateToDate(torrent.added_on),
    }))
    .filter(torrent => torrent.added_on < earliestTorrentDate);

  await Promise.each(oldTorrents, torrent => {
    process.stdout.write(`Removing ${torrent.name}...`);

    if (!config.isDryRun) {
      // TODO actually delete the torrent
      process.stdout.write('TODO...');
    }

    process.stdout.write(' Done\n');
  });
})().catch(error => console.error(error));
