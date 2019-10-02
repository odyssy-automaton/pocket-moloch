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
                const bcprocessor = new BcProcessorService();
                const extimatedTxs = [];
                console.log('devices', currentWallet.accountDevices);
                currentWallet.accountDevices.items
                  .filter((device) => device.state !== 'Deployed')
                  .forEach((device) => {
                    extimatedTxs.push(
                      sdk.estimateAccountDeviceDeployment(
                        device.device.address,
                      ),
                    );
                  });
                console.log(extimatedTxs);

                await Promise.all(extimatedTxs);
                const totalGas = extimatedTxs.reduce((total, estimated) =>
                  total.add(estimated.totalCost),
                );
                console.log('total gas', totalGas);
                if (ethToWei(currentWallet.eth).lt(totalGas)) {
                  alert(
                    `you need more gas, at least: ${web3Service.fromWei(
                      totalGas.toString(),
                    )}`,
                  );
                }

                const data = await Promise.all(
                  extimatedTxs.forEach((estimate) => {
                    return sdk.submitAccountTransaction(estimate);
                  }),
                );
                console.log(data);

                console.log(currentWallet.accountDevices.items.split(','));

                bcprocessor.setTx(
                  data,
                  currentUser.attributes['custom:account_address'],
                  'Deploy all recovery Devices for contract wallet.',
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                >
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
