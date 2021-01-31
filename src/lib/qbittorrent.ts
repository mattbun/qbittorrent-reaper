import got from 'got';

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

export class QBittorrentClient {
  host: string;
  cookie: string;

  constructor(host: string) {
    this.host = host;
  }

  getHeaders() {
    return {
      Referer: `http://${this.host}`,
      Origin: `http://${this.host}`,
      Cookie: this.cookie,
    };
  }

  parseTorrent(torrent: QBTorrent): Torrent {
    return {
      hash: torrent.hash,
      name: torrent.name,
      addedOn: convertQBDateToDate(torrent.added_on),
    };
  }

  async login(username: string, password: string) {
    const response = await got(`http://${this.host}/api/v2/auth/login`, {
      searchParams: {
        username,
        password,
      },
      headers: {
        Referer: `http://${this.host}`,
        Origin: `http://${this.host}`,
      },
      responseType: 'text',
    });

    this.cookie = response.headers['set-cookie'][0];
  }

  async getTorrents() {
    const response = await got<Array<QBTorrent>>(
      `http://${this.host}/api/v2/torrents/info`,
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

  async deleteTorrents(torrents: Array<Torrent>, deleteFiles: boolean) {
    if (torrents.length < 1) {
      return;
    }

    await got(`http://${this.host}/api/v2/torrents/delete`, {
      headers: this.getHeaders(),
      searchParams: {
        hashes: torrents.map((torrent) => torrent.hash).join('|'),
        deleteFiles: deleteFiles ? 'true' : 'false',
      },
      responseType: 'json',
    });
  }
}
