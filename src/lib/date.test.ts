import { subtractFromToday, convertEpochSecondsToDate } from './date';

const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
jest.useFakeTimers('modern').setSystemTime(new Date(sevenDaysInMs).getTime());

describe('convertSecondsToDate', () => {
  it('converts from seconds to a date', () => {
    expect(convertEpochSecondsToDate(1)).toStrictEqual(new Date(1000));
  });
});

describe('subtractFromToday', () => {
  it('subtracts a duration from today', () => {
    expect(subtractFromToday('7d')).toStrictEqual(new Date(0));
  });
});
