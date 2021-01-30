const Promise = require('bluebird');
const api = require('qbittorrent-api-v2');
const parseDuration = require('parse-duration');

const {
  QBITTORRENT_HOST,
  QBITTORRENT_USER,
  QBITTORRENT_PASSWORD,
  MAX_TORRENT_AGE,
  DRY_RUN,
} = process.env;

const MILLISECONDS_IN_ONE_SECOND = 1000;

(async () => {
  console.info(`Connecting to qbittorrent at ${QBITTORRENT_HOST}...`);
  const qbittorrent = await api.connect(QBITTORRENT_HOST, QBITTORRENT_USER, QBITTORRENT_PASSWORD);

  console.info('Connected! Getting torrents...');
  const torrents = await qbittorrent.torrents();

  const earliestTorrentDate = new Date((new Date().getTime()) - parseDuration(MAX_TORRENT_AGE));
  console.log(`Looking for torrents added before ${earliestTorrentDate}`);
  const oldTorrents = torrents
    .map(torrent => ({
      hash: torrent.hash,
      name: torrent.name,
      added_on: (new Date(torrent.added_on * MILLISECONDS_IN_ONE_SECOND)),
    }))
    .filter(torrent => torrent.added_on < earliestTorrentDate);


  await Promise.each(oldTorrents, torrent => {
    process.stdout.write(`Removing ${torrent.name}...`);
    process.stdout.write(' Done\n');
  });
})().catch(error => console.error(error));
