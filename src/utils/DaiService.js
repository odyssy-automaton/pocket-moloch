import Web3Service from '../utils/Web3Service';
import DaiAbi from '../contracts/guildbank.json';
import config from '../config';

export default class DaiService {
  contractAddr;
  web3Service;
  contract;
  gbAbi;

  constructor(contractAddr) {
    this.contractAddr = config.DAI_CONTRACT_ADDRESS;
    this.web3Service = new Web3Service();
    this.daiAbi = DaiAbi;

    this.initContract();
  }

  async initContract() {
    this.contract = await this.web3Service.initContract(
      this.daiAbi,
      this.contractAddr,
    );
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
