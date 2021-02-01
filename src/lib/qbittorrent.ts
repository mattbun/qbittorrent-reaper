import got from 'got';

import { convertEpochSecondsToDate } from './date';
import { BitTorrentClient, Torrent } from './reaper';

export type QBTorrent = {
  name: string;
  hash: string;
  added_on: number;
};

export class QBittorrentClient implements BitTorrentClient {
  baseUrl: string;
  username: string;
  password: string;
  cookie: string;

  constructor({
    host,
    port,
    protocol,
    username,
    password,
  }: {
    host: string;
    port: number;
    protocol: string;
    username: string;
    password: string;
  }) {
    this.baseUrl = `${protocol}://${host}:${port}`;
    this.username = username;
    this.password = password;
  }

  getHeaders() {
    return {
      Referer: this.baseUrl,
      Origin: this.baseUrl,
      Cookie: this.cookie,
    };
  }

  parseTorrent(torrent: QBTorrent): Torrent {
    return {
      id: torrent.hash,
      name: torrent.name,
      addedOn: convertEpochSecondsToDate(torrent.added_on),
    };
  }

  async connect() {
    const response = await got(`${this.baseUrl}/api/v2/auth/login`, {
      searchParams: {
        username: this.username,
        password: this.password,
      },
      headers: this.getHeaders(),
      responseType: 'text',
    });

    // TODO handle login errors better
    this.cookie = response.headers['set-cookie'][0];
  }

  async getTorrents() {
    const response = await got<Array<QBTorrent>>(
      `${this.baseUrl}/api/v2/torrents/info`,
      {
        headers: this.getHeaders(),
        searchParams: {
          sort: 'added_on',
        },
        responseType: 'json',
      }
    );

    return response.body.map(this.parseTorrent);
  }

  async getTorrentsAddedBefore(earliestAllowedDate: Date) {
    const response = await got<Array<QBTorrent>>(
      `${this.baseUrl}/api/v2/torrents/info`,
      {
        headers: this.getHeaders(),
        searchParams: {
          sort: 'added_on',
        },
        responseType: 'json',
      }
    );

    return response.body
      .map(this.parseTorrent)
      .filter((torrent) => torrent.addedOn < earliestAllowedDate);
  }

  async deleteTorrents(hashes: Array<String>, deleteFiles: boolean) {
    // TODO keep?
    if (hashes.length < 1) {
      return;
    }

    await got(`${this.baseUrl}/api/v2/torrents/delete`, {
      headers: this.getHeaders(),
      searchParams: {
        hashes: hashes.join('|'),
        deleteFiles: deleteFiles ? 'true' : 'false',
      },
      responseType: 'json',
    });
  }
}
