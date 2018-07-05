const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.previousHash = previousHash;
		this.data = data;
		this.hash = this.calculateHash();
		this.nounce = 0;
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nounce).toString();
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
		this.difficulty = 4;
	}

	createGenesisBlock(){
		return new Block(0,"06/25/2018", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
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

console.log("Mining block 1...");

moeCoin.addBlock(new Block(1, "07/01/2018", { amount: 13}))

console.log("Mining block 2...");
moeCoin.addBlock(new Block(1, "07/04/2018", { amount: 26}));;

// console.log("Is blockchain valid? " + moeCoin.isChainValid());

// moeCoin.chain[1].data = { amount: 619 };

// console.log("Is blockchain valid? " + moeCoin.isChainValid());

// console.log(JSON.stringify(moeCoin, null, 4));