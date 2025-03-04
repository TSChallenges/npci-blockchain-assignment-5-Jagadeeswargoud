const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('asset-management');

        await contract.submitTransaction('CreateAsset', 'asset1', 'Alice', 100);
        console.log('Transaction has been submitted');

        const result = await contract.evaluateTransaction('ReadAsset', 'asset1');
        console.log(`Asset details: ${result.toString()}`);

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

main();
