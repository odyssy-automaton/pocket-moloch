import Web3Service from '../utils/Web3Service';
import WethService from './WethService';
import gbAbi from '../contracts/guildbank.json';

export default class GuildBankService {
  contractAddr;
  web3Service;
  contract;
  gbAbi;

  constructor(contractAddr) {
    this.contractAddr = contractAddr;
    this.web3Service = new Web3Service();
    this.wethService = new WethService();
    this.gbAbi = gbAbi;

    this.initContract();
  }

  async initContract() {
    this.contract = await this.web3Service.initContract(
      this.gbAbi,
      this.contractAddr,
    );
  }

  async getAllEvents() {
    if (!this.contract) {
      await this.initContract();
    }
    let events = await this.contract.events.allEvents({
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  }
}
