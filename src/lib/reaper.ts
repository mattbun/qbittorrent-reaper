import { Options } from './config';
import { subtractFromToday } from './date';

export type Torrent = {
  id: string;
  name: string;
  addedOn: Date;
};

export interface BitTorrentClient {
  baseUrl: string;
  connect(): Promise<void>;
  getTorrentsAddedBefore(earliestAllowedDate: Date): Promise<Array<Torrent>>;
  deleteTorrents(ids: Array<String>, deleteFiles: boolean): Promise<void>;
}

export async function removeOldTorrents(
  client: BitTorrentClient,
  { deleteFiles, dryRun, maxAge }: Options
) {
  console.info(`Connecting to qbittorrent at ${client.baseUrl}`);
  await client.connect();

  const earliestAllowedDate = subtractFromToday(maxAge);
  console.info(
    `Looking for torrents added before ${earliestAllowedDate.toLocaleString()}`
  );
  const torrents = await client.getTorrentsAddedBefore(earliestAllowedDate);

  console.info('Removing torrents...');
  torrents.forEach((torrent) => console.info(`  ${torrent.name}`));

  if (torrents.length < 1) {
    console.info('Nothing to remove!');
  } else if (!dryRun) {
    await client.deleteTorrents(
      torrents.map((torrent) => torrent.id),
      deleteFiles
    );
  }

  console.info('Done');
}
