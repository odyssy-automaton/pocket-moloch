import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth } from 'aws-amplify';

import Loading from '../../components/shared/Loading';

const Confirm = ({ history }) => {
  let authError = null;

  return (
    <div className="Confirm">
      <Formik
        initialValues={{ username: '', authCode: '' }}
        validate={(values) => {
          let errors = {};
          if (!values.authCode) {
            errors.authCode = 'Required';
          }
          if (!values.username) {
            errors.username = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await Auth.confirmSignUp(values.username, values.authCode, {
              forceAliasCreation: false,
            }).then(() => {
              history.push('/sign-in');
            });
          } catch (err) {
            console.log('error confirming signing up: ', err);
            authError = err;
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => {
          if (isSubmitting) {
            return <Loading />;
          }

          return (
            <Form className="Form">
              {authError ? (
                <div className="Form__auth-error">{authError.message}</div>
              ) : null}
              <Field name="username">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Pseudonym</label>
                  <input type="text" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="username" component="div" />
              <Field name="authCode">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Confirmation Code</label>
                  <input type="text" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="authCode" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(Confirm);
