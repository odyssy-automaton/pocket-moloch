import React, { useContext } from 'react';
//import BcProcessorService from '../../utils/BcProcessorService';
import Web3Service from '../../utils/Web3Service';
import { ethToWei } from '@netgum/utils'; // returns BN

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import { Formik, Form } from 'formik';
import { WalletStatuses } from '../../utils/WalletStatus';
import BcProcessorService from '../../utils/BcProcessorService';

const DeployDevices = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const web3Service = new Web3Service();
  const bcprocessor = new BcProcessorService();

  /*
  Not working :(
    */
  return (
    <>
      {currentWallet.state === WalletStatuses.Deployed &&
        currentWallet.state !== WalletStatuses.NotConnected && (
          <Formik
            onSubmit={async (values, { setSubmitting }) => {
              const sdk = currentUser.sdk;
              const extimatedTxs = [];
              currentWallet.accountDevices.items
                .filter((device) => device.state !== WalletStatuses.Deployed)
                .forEach((device) => {
                  extimatedTxs.push(
                    sdk.estimateAccountDeviceDeployment(device.device.address),
                  );
                });

              if (!extimatedTxs.length) {
                return false;
              }

              const resolvedEstimates = await Promise.all(extimatedTxs);

              const totalGas = resolvedEstimates.reduce((total, estimated) => {
                total.totalCost = total.totalCost.add(estimated.totalCost);
                return total;
              });
              if (ethToWei(currentWallet.eth).lt(totalGas)) {
                alert(
                  `you need more gas, at least: ${web3Service.fromWei(
                    totalGas.toString(),
                  )}`,
                );
                return false;
              }

              try {
                // Seems this will not work
                // trying to deploy one after the other but tx may have to be done before next one

                // resolvedEstimates.reverse().forEach(async (estimate) => {
                //   const data = await sdk.submitAccountTransaction(estimate);
                //   console.log('data', data);
                //   if(data){
                //     bcprocessor.setTx(
                //       data,
                //       currentUser.attributes['custom:account_address'],
                //       'Deploy recovery Devices for contract wallet.',
                //       true,
                //     );
                //   }

                // });

                const data = await sdk.submitAccountTransaction(
                  resolvedEstimates[0],
                );
                bcprocessor.setTx(
                  data,
                  currentUser.attributes['custom:account_address'],
                  'Deploy recovery Devices for contract wallet.',
                  true,
                );
              } catch (err) {
                alert('Something went wrong: ' + err);
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form className="Form">
                <button type="submit" disabled={isSubmitting}>
                  DeployDevices
                </button>
              </Form>
            )}
          </Formik>
        )}
    </>
  );
};

export default DeployDevices;
