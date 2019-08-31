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
              <h2>Confirm your Email</h2>
              <p>Check your email for a reset code. Enter it here and create a new password.</p>
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
              <ErrorMessage name="username" render={msg => <div className="Error">{msg}</div>} />

              <Field name="authCode">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Reset Code</label>
                  <input type="text" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="authCode" render={msg => <div className="Error">{msg}</div>} />

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
              <ErrorMessage name="newPassword" render={msg => <div className="Error">{msg}</div>} />

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
