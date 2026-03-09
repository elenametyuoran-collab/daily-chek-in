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
  console.log('=== Mood Vote Contract Deployer ===\n');

  const privateKey = await ask('Paste your private key and press Enter: ');

  if (!privateKey || privateKey.length < 60) {
    console.error('Error: key too short, check and try again.');
    process.exit(1);
  }

  const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);
  console.log('\nDeployer address:', address);

  let contractCode = fs.readFileSync(
    path.join(__dirname, '../contracts/mood-vote.clar'),
    'utf8'
  );
  contractCode = contractCode
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[^\x00-\x7F]/g, '');

  console.log('Building transaction...');
  const network = new StacksMainnet();

  const tx = await makeContractDeploy({
    contractName: 'mood-vote-v1',
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
  console.log('\nContract address:', `${address}.mood-vote-v1`);
  console.log('\nAdd to frontend/.env.local:');
  console.log(`NEXT_PUBLIC_MOOD_VOTE_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_MOOD_VOTE_NAME=mood-vote-v1`);
}

deploy().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
