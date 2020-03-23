const NEUTRINO_DECIMAL = 1e6;
const neutrinoPrice = 95; // Like 0.95$
const nodeMinedNeutrino = 5 * NEUTRINO_DECIMAL;

const testStaker = '3PQSC3ysFKPvYba86VK84ZZKhS5ZRb725vz';
const testJsonRoute = 'https://api.myjson.com/bins/cf7og';

function calculateRewardForHeightRange(
    totalProfit,
    currentHeight,
    lastPaymentHeight,
    balancesForHeight
) {
    const blocksDiff = currentHeight - lastPaymentHeight;
    const profitPerBlock = totalProfit / blocksDiff;

    const rewards = {};
    for (let i = 1; i <= blocksDiff; i++) {
        const paymentHeight = currentHeight + i;
        const balances = balancesForHeight[paymentHeight];

        let totalBalance = Object.keys(balances).reduce(
            (acc, address) => acc + balances[address],
            0
        );

        for (let address in Object.keys(balances)) {
            const amount = balances[address];
            const share = amount / totalBalance;

            const rewardOnBlock = share * profitPerBlock;
            if (!rewards[address]) {
                rewards[address] = rewardOnBlock;
            } else {
                rewards[address] += rewardOnBlock;
            }
        }
    }
}
function createMassRewardTXs(balances, rpdConfig, { sender, assetId }) {
    const transfers = [];

    let total = 0;
    for (const address in balances) {
        const value = balances[address];
        const roundedValue = Math.round(value);
        if (roundedValue > 0) {
            total += roundedValue;
            transfers.push({ amount: roundedValue, recipient: address });
        }
    }

    const paymentsCount = 100;
    const maxRewardTXsCount = Math.ceil(transfers.length / 100);
    const rewardTXs = Array(maxRewardTXsCount);
    const lenTransfers = transfers.length;

    for (let i = 0; i < lenTransfers; i += paymentsCount) {
        let endIndex = i + paymentsCount;

        if (endIndex > lenTransfers) {
            endIndex = lenTransfers;
        }
        const currentTransfers = transfers.slice(i, endIndex);
        // const rewardTx = massTransfer({
        //   transfers: currentTransfers
        // })
        // rewardTXs.push(rewardTx)
    }
}

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
describe('test rewards', () => {
    it('compute direct reward', async () => {
        const balances = testJson;
        const totalProfit = 1000 * NEUTRINO_DECIMAL;

        const lastPaymentHeight = 1983858; // 22.03.2020, 17:56:09
        const currentHeight = 1900000

        const rewards = calculateRewardForHeightRange(
            totalProfit,
            currentHeight,
            lastPaymentHeight,
            balances
        );
    });
});
