import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth } from 'aws-amplify';

import Loading from '../../components/shared/Loading';

const ForgotPasswordConfirm = ({ history }) => {
  let authError = null;

  return (
    <div className="ForgotPasswordConfirm">
      <Formik
        initialValues={{ username: '', authCode: '', newPassword: '' }}
        validate={(values) => {
          let errors = {};
          if (!values.username) {
            errors.username = 'Required';
          }
          if (!values.authCode) {
            errors.authCode = 'Required';
          }
          if (!values.newPassword) {
            errors.newPassword = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            Auth.forgotPasswordSubmit(values.username, values.authCode, values.newPassword)
            .then(() => {
                history.push('/sign-in');
              });

            setSubmitting(false);

          } catch (err) {
            console.log('error: ', err);
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
                  <label>Auth Code</label>
                  <input type="text" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="authCode" component="div" />

              <Field name="newPassword">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>New Password</label>
                  <input type="password" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="newPassword" component="div" />

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

export default withRouter(ForgotPasswordConfirm);
