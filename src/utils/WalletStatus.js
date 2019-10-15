import Web3Service from "./Web3Service";

export const WalletStatuses = {
  Unknown: 'Unknown',
  Connected: 'Connected',
  NotConnected: 'Not Connected',
  Connecting: 'Connecting',
  UnDeployedNeedsDevices: 'Not Deployed Needs Devices',
  UnDeployed: 'Not Deployed',
  LowGas: 'Low Gas',
  DeployedNeedsDevices: 'Deployed Needs Devices',
  DeployedNewDevice: 'Deployed New Device',
};

export const currentStatus = (currentWallet, currentUser, state = null) => {
  const web3Service = Web3Service;
  const _accountDevices = currentWallet.accountDevices;
  const _state = state || currentWallet.state || '';
  // NotConnected user should see signup flow
  if (_state === WalletStatuses.NotConnected) {
    return WalletStatuses.NotConnected;
  }

  if (_state === WalletStatuses.Connecting) {
    return WalletStatuses.Connecting;
  }

  // UnDeployedNeedsDevices user needs to add at least one recovery
  if (_state === 'Created' && !_accountDevices) {
    return WalletStatuses.UnDeployedNeedsDevices;
  }

  // UnDeployed user needs to deploy wallet
  if (
    _accountDevices &&
    _accountDevices.items.length > 1 &&
    _state === 'Created'
  ) {
    return WalletStatuses.UnDeployed;
  }

  // LowGas user needs to add gas
  if (
    _state === 'Created' &&
    web3Service.fromWei(currentUser.sdk.state.account.balance.real.toString()) <
      0.001
  ) {
    return WalletStatuses.LowGas;
  }

  // DeployedNeedsDevices user has deployed but needs another device option
  if (
    _state === 'Deployed' &&
    _accountDevices &&
    _accountDevices.items.length < 2
  ) {
    return WalletStatuses.DeployedNeedsDevices;
  }

  // DeployedNewDevice user should see option to recover or add
  if (
    _state === 'Deployed' &&
    _accountDevices &&
    !_accountDevices.items.some(
      (item) => item.device.address === currentUser.sdk.state.deviceAddress,
    )
  ) {
    return WalletStatuses.DeployedNewDevice;
  }

  return WalletStatuses.Connected
};
