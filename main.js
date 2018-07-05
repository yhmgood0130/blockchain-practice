const SHA256 = require('crypto-js/sha256');

class Transaction{
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transaction, previousHash = '') {
		this.timestamp = timestamp;
		this.previousHash = previousHash;
		this.transaction = transaction;
		this.hash = this.calculateHash();
		this.nounce = 0;
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transaction) + this.nounce).toString();
	}


	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nounce++;
			this.hash = this.calculateHash();
		}

		console.log("Block mined: " + this.hash);
	}
}

class BlockChain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock(){
		return new Block(0,"06/25/2018", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully minded!");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
		
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;
		for(const block of this.chain) {
			for(const trans of block.transaction) {
				console.log(trans.toAddress, address);
				
				if(trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if(trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}

		return balance;
	}
	isChainValid() {
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}

			return true;
		}
	}
}

let moeCoin = new BlockChain();
moeCoin.createTransaction(new Transaction("address1", "address2", 100));
moeCoin.createTransaction(new Transaction("address2", "address1", 47));

console.log("\n Starting the miner...");
moeCoin.minePendingTransactions("#3232dddcvwd");

console.log("\n Balance of Moe is ", moeCoin.getBalanceOfAddress("#3232dddcvwd"));

console.log("\n Starting the miner again...");
moeCoin.minePendingTransactions("#3232dddcvwd");

console.log("\n Balance of Moe is ", moeCoin.getBalanceOfAddress("#3232dddcvwd"));


// console.log("Is blockchain valid? " + moeCoin.isChainValid());

// moeCoin.chain[1].transaction = { amount: 619 };

// console.log("Is blockchain valid? " + moeCoin.isChainValid());

// console.log(JSON.stringify(moeCoin, null, 4));