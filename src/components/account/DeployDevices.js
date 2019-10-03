import React, { useContext } from 'react';
import BcProcessorService from '../../utils/BcProcessorService';
import Web3Service from '../../utils/Web3Service';
import { ethToWei } from '@netgum/utils'; // returns BN

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import { Formik, Form } from 'formik';

const DeployDevices = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet, setCurrentWallet] = useContext(CurrentWalletContext);
  const web3Service = new Web3Service();

  /*
  Not working :(
    */
  return (
    <>
      {currentWallet.state === 'Deployed' &&
        currentWallet.state !== 'Not Connected' && (
          <Formik
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const sdk = currentUser.sdk;
                const extimatedTxs = [];
                currentWallet.accountDevices.items
                  .filter((device) => device.state !== 'Deployed')
                  .forEach((device) => {
                    extimatedTxs.push(
                      sdk.estimateAccountDeviceDeployment(
                        device.device.address,
                      ),
                    );
                  });

                const resolvedEstimates = await Promise.all(extimatedTxs);

                const totalGas = resolvedEstimates.reduce(
                  (total, estimated) => total.totalCost.add(estimated.totalCost),
                );
                console.log('total gas', totalGas);
                if (ethToWei(currentWallet.eth).lt(totalGas)) {
                  alert(
                    `you need more gas, at least: ${web3Service.fromWei(
                      totalGas.toString(),
                    )}`,
                  );
                }

                // fails here for some reason
                // maybe nonce
                resolvedEstimates.reverse().forEach((estimate) => {
                  sdk
                    .submitAccountTransaction(estimate)
                    .then(console.log)
                    .catch(console.error);
                });

                // bcprocessor.setTx(
                //   data,
                //   currentUser.attributes['custom:account_address'],
                //   'Deploy all recovery Devices for contract wallet.',
                //   true,
                // );
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
