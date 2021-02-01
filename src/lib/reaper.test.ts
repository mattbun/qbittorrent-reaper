import { removeOldTorrents } from './reaper';
import * as libDate from './date';

beforeEach(() => {
  jest.spyOn(console, 'info').mockImplementation(jest.fn());
});

describe('removeOldTorrents', () => {
  it('removes old torrents', async () => {
    jest.spyOn(libDate, 'subtractFromToday').mockReturnValue(new Date(0));
    const mockTorrents = [
      {
        id: 'some id',
      },
    ];
    const client = {
      baseUrl: 'some base url',
      connect: jest.fn(),
      getTorrentsAddedBefore: jest.fn().mockResolvedValue(mockTorrents),
      deleteTorrents: jest.fn(),
    };

    await removeOldTorrents(client, {
      deleteFiles: true,
      dryRun: false,
      maxAge: '7d',
    });

    expect(client.connect).toHaveBeenCalledTimes(1);
    expect(client.connect).toHaveBeenCalledWith();

    expect(libDate.subtractFromToday).toHaveBeenCalledTimes(1);
    expect(libDate.subtractFromToday).toHaveBeenCalledWith('7d');

    expect(client.getTorrentsAddedBefore).toHaveBeenCalledTimes(1);
    expect(client.getTorrentsAddedBefore).toHaveBeenCalledWith(new Date(0));

    expect(client.deleteTorrents).toHaveBeenCalledTimes(1);
    expect(client.deleteTorrents).toHaveBeenCalledWith(['some id'], true);
  });

  it('passes false for deleteFiles when deleting torrents', async () => {
    const mockTorrents = [
      {
        id: 'some id',
      },
    ];
    const client = {
      baseUrl: 'some base url',
      connect: jest.fn(),
      getTorrentsAddedBefore: jest.fn().mockResolvedValue(mockTorrents),
      deleteTorrents: jest.fn(),
    };

    await removeOldTorrents(client, {
      deleteFiles: false,
      dryRun: false,
      maxAge: '7d',
    });

    expect(client.deleteTorrents).toHaveBeenCalledWith(['some id'], false);
  });

  it('skips deleting torrents if there are no torrents to delete', async () => {
    const mockTorrents = [];
    const client = {
      baseUrl: 'some base url',
      connect: jest.fn(),
      getTorrentsAddedBefore: jest.fn().mockResolvedValue(mockTorrents),
      deleteTorrents: jest.fn(),
    };

    await removeOldTorrents(client, {
      deleteFiles: true,
      dryRun: false,
      maxAge: '7d',
    });

    expect(client.deleteTorrents).not.toHaveBeenCalled();
  });

  it('skips deleting torrents if dryRun is true', async () => {
    const mockTorrents = [];
    const client = {
      baseUrl: 'some base url',
      connect: jest.fn(),
      getTorrentsAddedBefore: jest.fn().mockResolvedValue(mockTorrents),
      deleteTorrents: jest.fn(),
    };

    await removeOldTorrents(client, {
      deleteFiles: true,
      dryRun: true,
      maxAge: '7d',
    });

    expect(client.deleteTorrents).not.toHaveBeenCalled();
  });
});
