import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ethToWei } from '@netgum/utils'; // returns BN

import McDaoService from '../../utils/McDaoService';
import Web3Service from '../../utils/Web3Service';

import BcProcessorService from '../../utils/BcProcessorService';
import Loading from '../shared/Loading';

import {
  CurrentUserContext,
  LoaderContext,
  CurrentWalletContext,
} from '../../contexts/Store';

const RageQuit = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const web3Service = new Web3Service();

  return (
    <>
      {loading && <Loading />}
      <h2>Rage Quit</h2>
      <p>Enter the amount of shares you want to burn.</p>
      <p>
        Note: ragequit At any time, so long as a member has not voted YES on any
        proposal in the voting period or grace period, they can irreversibly
        destroy some of their shares and receive a proportional sum of value from
        the Guild Bank.
      </p>
      <Formik
        initialValues={{
          amount: '',
          addr: currentUser.attributes['custom:account_address'],
        }}
        validate={(values) => {
          let errors = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const sdk = currentUser.sdk;
          const daoService = new McDaoService();
          const bcprocessor = new BcProcessorService();
          const bnZed = ethToWei(0);

          setLoading(true);
          const data = await daoService.rageQuit(
            values.addr,
            values.amount,
            true,
          );

          try {
            const estimated = await sdk.estimateAccountTransaction(
              daoService.contractAddr,
              bnZed,
              data,
            );

            // console.log(estimated);
            if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
              alert(
                `you need more gas, at least: ${web3Service.fromWei(
                  estimated.totalCost.toString(),
                )}`,
              );
              setLoading(false);
              setSubmitting(false);
              return false;
            }

            const hash = await sdk.submitAccountTransaction(estimated);
            bcprocessor.setTx(
              hash,
              currentUser.attributes['custom:account_address'],
              `Rage Quit (╯°□°）╯︵ ┻━┻ : ${values.amount}`,
              true,
            );
          } catch (err) {
            console.log(err);
            alert(`Something went wrong. please try again`);
          }

          setLoading(false);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="Form">
            <Field name="amount">
              {({ field, form }) => (
                <div className={field.value ? 'Field HasValue' : 'Field '}>
                  <label>Amount</label>
                  <input
                    min="0"
                    type="number"
                    inputMode="numeric"
                    step="any"
                    {...field}
                  />
                </div>
              )}
            </Field>
            <ErrorMessage
              name="amount"
              render={(msg) => <div className="Error">{msg}</div>}
            />
            <button type="submit" disabled={isSubmitting}>
              Rage Quit (╯°□°）╯︵ ┻━┻
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RageQuit;
