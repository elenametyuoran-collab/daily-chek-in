const {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey,
  TransactionVersion,
} = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function deploy() {
  console.log('=== Daily Check-in Contract Deployer ===\n');

  const privateKey = await ask('Paste your private key and press Enter: ');

  if (!privateKey || privateKey.length < 60) {
    console.error('Error: key too short, check and try again.');
    process.exit(1);
  }

  const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);
  console.log('\nDeployer address:', address);

  let contractCode = fs.readFileSync(
    path.join(__dirname, '../contracts/daily-checkin.clar'),
    'utf8'
  );
  // Strip BOM, normalize line endings, remove non-ASCII characters
  contractCode = contractCode
    .replace(/^\uFEFF/, '')       // strip UTF-8 BOM
    .replace(/\r\n/g, '\n')       // CRLF -> LF
    .replace(/\r/g, '\n')         // CR -> LF
    .replace(/[^\x00-\x7F]/g, ''); // remove any non-ASCII

  console.log('Building transaction...');
  const network = new StacksMainnet();

  const tx = await makeContractDeploy({
    contractName: 'daily-checkin-v2',
    codeBody: contractCode,
    senderKey: privateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    clarityVersion: 3,
  });

  console.log('Broadcasting...');
  const result = await broadcastTransaction(tx, network);

  if (result.error) {
    console.error('\nError:', result.error);
    console.error('Reason:', result.reason);
    process.exit(1);
  }

  console.log('\n=== Success! ===');
  console.log('TX ID:   ', result.txid);
  console.log('Track:   ', `https://explorer.hiro.so/txid/${result.txid}?chain=mainnet`);
  console.log('\nAdd to frontend/.env.local:');
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_CONTRACT_NAME=daily-checkin-v2`);
}

deploy().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
