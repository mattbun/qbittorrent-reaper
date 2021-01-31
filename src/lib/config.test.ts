import { readConfig } from './config';

describe('readConfig', () => {
  it('reads environment variables to populate a config object', () => {
    process.env = {
      QBITTORRENT_HOST: 'some host',
      QBITTORRENT_PORT: '1111',
      QBITTORRENT_PROTOCOL: 'abcd',
      QBITTORRENT_USER: 'some user',
      QBITTORRENT_PASSWORD: 'some secret password',
      MAX_TORRENT_AGE: '2d',
      DELETE_FILES: '1',
      DRY_RUN: '1',
    };

    const result = readConfig();

    expect(result).toStrictEqual({
      host: 'some host',
      port: 1111,
      protocol: 'abcd',
      user: 'some user',
      password: 'some secret password',
      maxAge: '2d',
      deleteFiles: true,
      isDryRun: true,
    });
  });

  it('defaults to host localhost', () => {
    process.env.QBITTORRENT_HOST = undefined;

    const result = readConfig();

    expect(result.host).toStrictEqual('localhost');
  });

  it('defaults to port 8080', () => {
    process.env.QBITTORRENT_PORT = undefined;

    const result = readConfig();

    expect(result.port).toStrictEqual(8080);
  });

  it('defaults to protocol http', () => {
    process.env.QBITTORRENT_PROTOCOL = undefined;

    const result = readConfig();

    expect(result.protocol).toStrictEqual('http');
  });

  it('sets isDryRun to false if DRY_RUN is unset', () => {
    process.env.DRY_RUN = undefined;

    const result = readConfig();

    expect(result.isDryRun).toStrictEqual(false);
  });

  it('sets deleteFiles to false if DELETE_FILES is unset', () => {
    process.env.DELETE_FILES = undefined;

    const result = readConfig();

    expect(result.deleteFiles).toStrictEqual(false);
  });
});
