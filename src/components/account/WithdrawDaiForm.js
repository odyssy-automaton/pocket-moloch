import React, { useContext  } from 'react';
import Web3Service from '../../utils/Web3Service';
import DaiService from '../../utils/DaiService';
import BcProcessorService from '../../utils/BcProcessorService';
import { ethToWei } from '@netgum/utils'; // returns BN
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  CurrentUserContext,
  LoaderContext,
  CurrentWalletContext,
} from '../../contexts/Store';
import useModal from '../shared/useModal';
import Loading from '../shared/Loading';

const WithdrawDaiForm = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const { toggle } = useModal();

  return (
    <>
      {loading && <Loading />}

      <h2>Withdraw Dai from your wallet address</h2>
      <Formik
        initialValues={{
          amount: '',
          addr: currentUser.attributes['custom:account_address'],
          dist: '',
        }}
        validate={(values) => {
          let errors = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }
          if (!values.dist) {
            errors.dist = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const sdk = currentUser.sdk;
          const daiService = new DaiService();
          const web3Service = new Web3Service();
          const bcprocessor = new BcProcessorService();

          const bnZed = ethToWei(0);

          setLoading(true);
          try {
            const data = await daiService.transfer(
              values.addr,
              values.dist,
              web3Service.toWei(values.amount),
              true,
            );

            const estimated = await sdk.estimateAccountTransaction(
              daiService.contractAddr,
              bnZed,
              data,
            );

            console.log(estimated);
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
              `Withdraw dai: ${values.amount}`,
              true,
            );
          } catch (err) {
            console.log(err);
            alert(`Something went wrong. please try again`);
          }

          resetForm();
          setLoading(false);
          setSubmitting(false);
          toggle('daiWithdrawForm');
        }}
      >
        {({ isSubmitting }) => (
          <Form className="Form">
            <Field name="dist">
              {({ field, form }) => (
                <div className={field.value ? 'Field HasValue' : 'Field '}>
                  <label>Destination</label>
                  <input type="text" {...field} />
                </div>
              )}
            </Field>
            <ErrorMessage
              name="dist"
              render={(msg) => <div className="Error">{msg}</div>}
            />
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
              Withdraw
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default WithdrawDaiForm;
