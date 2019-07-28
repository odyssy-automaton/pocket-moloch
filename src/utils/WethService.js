import WethAbi from '../contracts/weth.json';
import Web3Service from '../utils/Web3Service';
import config from '../config';

export default class WethService {
  contractAddr;
  web3Service;
  contract;
  wethAbi;

  constructor() {
    this.contractAddr = config.WETH_CONTRACT_ADDRESS;
    this.web3Service = new Web3Service();
    this.wethAbi = WethAbi;
    this.initContract();
  }

  async initContract() {
    this.contract = await this.web3Service.initContract(
      this.wethAbi,
      this.contractAddr,
    );
    return this.contract;
  }

  async totalSupply() {
    if (!this.contract) {
      await this.initContract();
    }
    const totalSupply = await this.contract.methods.totalSupply().call();
    return totalSupply;
  }

  async balanceOf(account, atBlock = 'latest') {
    if (!this.contract) {
      await this.initContract();
    }

    const balanceOf = await this.contract.methods
      .balanceOf(account)
      .call({}, atBlock);

    return balanceOf;
  }

  async allowance(accountAddr, contractAddr) {
    if (!this.contract) {
      await this.initContract();
    }
    const allowance = await this.contract.methods
      .allowance(accountAddr, contractAddr)
      .call();
    return allowance;
  }

  async approve(from, guy, wad, encodedPayload) {
    // guy should be moloch contract
    if (!this.contract) {
      await this.initContract();
    }

    if (encodedPayload) {
      const data = this.contract.methods.approve(guy, wad).encodeABI();
      return data;
    }

    const approve = await this.contract.methods
      .approve(guy, wad)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return approve;
  }

  async deposit(from, amount, encodedPayload) {
    if (!this.contract) {
      await this.initContract();
    }

    if (encodedPayload) {
      const data = this.contract.methods.deposit().encodeABI();
      return data;
    }

    let deposit = this.contract.methods
      .deposit()
      .send({ from, value: amount })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return deposit;
  }

  async transfer(from, dist, wad, encodedPayload) {
    if (!this.contract) {
      await this.initContract();
    }

    if (encodedPayload) {
      const data = this.contract.methods.transfer(dist, wad).encodeABI();
      return data;
    }

    const trans = await this.contract.methods
      .transfer(dist, wad)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return trans;
  }
}
