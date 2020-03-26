const { massTransfer } = require('@waves/waves-transactions');

const AttachmentEnum = {
    referral: 'sp',
    direct: '',
};

const TRANSACTION_TYPE = {
    ISSUE: 3,
    TRANSFER: 4,
    REISSUE: 5,
    BURN: 6,
    EXCHANGE: 7,
    LEASE: 8,
    CANCEL_LEASE: 9,
    ALIAS: 10,
    MASS_TRANSFER: 11,
    DATA: 12,
    SET_SCRIPT: 13,
    SPONSORSHIP: 14,
    SET_ASSET_SCRIPT: 15,
    INVOKE_SCRIPT: 16,
};

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

function createMassRewardTXs(balances, { attachment, assetId, seed }) {
    const transfers = [];

    // let total = 0;
    for (const address in balances) {
        const value = balances[address];
        const roundedValue = Math.round(value);
        if (roundedValue > 0) {
            // total += roundedValue;
            transfers.push({ amount: roundedValue, recipient: address });
        }
    }
    const paymentsCount = 100;
    const maxRewardTXsCount = Math.ceil(transfers.length / 100);
    const rewardTXs = Array(maxRewardTXsCount);
    const lenTransfers = transfers.length;

    for (let i = 0; i < lenTransfers; i += paymentsCount) {
        let endIndex = i + paymentsCount;
        const isEndIndexBigger = endIndex > lenTransfers;

        if (isEndIndexBigger) {
            endIndex = lenTransfers;
        }
        const currentTransfers = transfers.slice(i, endIndex);
        const rewardTx = massTransfer({
            type: TRANSACTION_TYPE.MASS_TRANSFER,
            transfers: currentTransfers,
            attachment,
            assetId,
        });

        rewardTXs.push(rewardTx);

        if (isEndIndexBigger) {
            break;
        }
    }
}

module.exports = {
    calculateRewardForHeightRange,
    createMassRewardTXs,
    AttachmentEnum,
};
