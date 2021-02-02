import got from 'got';

import { QBittorrentClient } from './qbittorrent';

const connectionOptions = {
  protocol: 'http',
  host: 'some.host',
  port: 8675,
  username: 'some user',
  password: 'secret password',
};

const mockTorrents = [
  {
    hash: 'abc',
    name: 'def',
    added_on: 1,
  },
  {
    hash: 'ghi',
    name: 'jkl',
    added_on: 10,
  },
];

describe('qbittorrent client', () => {
  describe('constructor', () => {
    it('initializes a qbittorrent client', () => {
      const client = new QBittorrentClient(connectionOptions);

      expect(client.baseUrl).toStrictEqual('http://some.host:8675');
      expect(client.username).toStrictEqual('some user');
      expect(client.password).toStrictEqual('secret password');
    });
  });

  describe('connect', () => {
    it('authenticates with qbittorrent', async () => {
      jest.spyOn(got, 'get').mockResolvedValue({
        headers: {
          'set-cookie': ['some cookie'],
        },
      });
      const client = new QBittorrentClient(connectionOptions);

      await client.connect();

      expect(got.get).toHaveBeenCalledTimes(1);
      expect(got.get).toHaveBeenCalledWith(
        `${client.baseUrl}/api/v2/auth/login`,
        {
          searchParams: {
            username: connectionOptions.username,
            password: connectionOptions.password,
          },
          headers: {
            Referer: client.baseUrl,
            Origin: client.baseUrl,
          },
          responseType: 'text',
        }
      );
      expect(client.cookie).toStrictEqual('some cookie');
    });
  });

  describe('getTorrentsAddedBefore', () => {
    it('gets torrents added before a given date', async () => {
      jest.spyOn(got, 'get').mockResolvedValue({
        body: mockTorrents,
      });
      const client = new QBittorrentClient(connectionOptions);
      client.cookie = 'some cookie';

      const torrents = await client.getTorrentsAddedBefore(new Date(5000));

      expect(got.get).toHaveBeenCalledTimes(1);
      expect(got.get).toHaveBeenCalledWith(
        `${client.baseUrl}/api/v2/torrents/info`,
        {
          headers: {
            Referer: client.baseUrl,
            Origin: client.baseUrl,
            Cookie: client.cookie,
          },
          searchParams: {
            sort: 'added_on',
          },
          responseType: 'json',
        }
      );
      expect(torrents).toStrictEqual([
        {
          id: 'abc',
          name: 'def',
          addedOn: new Date(1000),
        },
      ]);
    });
  });

  describe('deleteTorrents', () => {
    it('deletes a list of torrents', async () => {
      jest.spyOn(got, 'get').mockResolvedValue(undefined);
      const client = new QBittorrentClient(connectionOptions);
      client.cookie = 'some cookie';

      await client.deleteTorrents(['abc', 'def'], true);

      expect(got.get).toHaveBeenCalledTimes(1);
      expect(got.get).toHaveBeenCalledWith(
        `${client.baseUrl}/api/v2/torrents/delete`,
        {
          headers: {
            Referer: client.baseUrl,
            Origin: client.baseUrl,
            Cookie: client.cookie,
          },
          searchParams: {
            hashes: 'abc|def',
            deleteFiles: 'true',
          },
          responseType: 'json',
        }
      );
    });

    it('sets deleteFiles to "false"', async () => {
      jest.spyOn(got, 'get').mockResolvedValue(undefined);
      const client = new QBittorrentClient(connectionOptions);
      client.cookie = 'some cookie';

      await client.deleteTorrents(['abc', 'def'], false);

      expect(got.get).toHaveBeenCalledTimes(1);
      expect(got.get).toHaveBeenCalledWith(
        `${client.baseUrl}/api/v2/torrents/delete`,
        {
          headers: {
            Referer: client.baseUrl,
            Origin: client.baseUrl,
            Cookie: client.cookie,
          },
          searchParams: {
            hashes: 'abc|def',
            deleteFiles: 'false',
          },
          responseType: 'json',
        }
      );
    });
  });
});
