


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


module.exports = {
    calculateRewardForHeightRange,
    createMassRewardTXs
}