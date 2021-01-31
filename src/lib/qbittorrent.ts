import { convertQBDateToDate } from './date';

export type QBTorrent = {
  name: string;
  hash: string;
  added_on: number;
};

export type Torrent = {
  hash: string;
  name: string;
  addedOn: Date;
};

export function parseTorrent(torrent: QBTorrent): Torrent {
  return {
    hash: torrent.hash,
    name: torrent.name,
    addedOn: convertQBDateToDate(torrent.added_on),
  };
}
