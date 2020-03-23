const { createMassRewardTXs, calculateRewardForHeightRange } = require('./helpers');

const NEUTRINO_DECIMAL = 1e6;
const neutrinoPrice = 95; // Like 0.95$
const nodeMinedNeutrino = 5 * NEUTRINO_DECIMAL;

const testStaker = '3PQSC3ysFKPvYba86VK84ZZKhS5ZRb725vz';
const testJsonRoute = 'https://api.myjson.com/bins/cf7og';

describe('test rewards', () => {
    const testJson = {
        '3P1wriMwcpkHHrz5SGRuwn7wrrGKNC9HxK4': 500000000,
        '3P1xpPEXy5VCiV34zHtX7UZFKhie4Guz8NJ': 1532520,
        '3P1xvwUD5tZLGbnVAVadf5nxqQb89J5KcNt': 0,
        '3P1y1bpDE67zjnBaVnPiEaGNQ9vEV4LN6Fd': 2112952797,
        '3P1ySeZitc5V5hkLQYWyhJwqsXpXLgJMuCW': 897298,
        '3P1zdekqXGZ5zokGroupT42L6jV7t9ixDVG': 483563086,
        '3P22FqkfbQ5QL4fVYfV11Reepkx2cAWKMma': 3718941,
        '3P23HcJ8wvpNktk5PxWNaxbUaCi1SMhyzx4': 575024905,
        '3P24DP4oB4MuxAVRuome95UZWhRZVpss1ET': 0,
        '3P2512s7ebiM8GeviKVsKWoFmN3DXeWUiEr': 0,
        '3P25Dr55mHoWYGSWeBQtfdZnN7tSUe574jh': 14110854,
        '3P25WoPH6EA8P5Kf7YzCYhtkpxN6Vv2vxGZ': 10368576,
        '3P25nRnyaeZDoJVXVHHZdeUzsoWpPeAUdGi': 0,
        '3P26h9N164TbaYm3CPXQbexPXpxyVjZorQA': 0,
    };

    it('compute direct reward', async () => {
        const balances = testJson;
        const totalProfit = 1000 * NEUTRINO_DECIMAL;

        const lastPaymentHeight = 1983858; // 22.03.2020, 17:56:09
        const currentHeight = 1900000;

        const rewards = calculateRewardForHeightRange(
            totalProfit,
            currentHeight,
            lastPaymentHeight,
            balances
        );
    });
});
