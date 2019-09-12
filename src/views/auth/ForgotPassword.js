import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth } from 'aws-amplify';

import Loading from '../../components/shared/Loading';

const ForgotPassword = ({ history }) => {
  let authError = null;

  return (
    <div className="ForgotPassword">
      <Formik
        initialValues={{ username: '' }}
        validate={(values) => {
          let errors = {};
          if (!values.username) {
            errors.username = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await Auth.forgotPassword(values.username)
                history.push('/forgot-password-confirm');
             

            setSubmitting(false);

          } catch (err) {
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
              <h2>Forgot Password?</h2>
              <p>Enter your pseudonym and we'll shoot a confirmation email to the address attached.</p>
              {authError &&
                <div className="Form__auth-error">{authError.message}</div>}
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

export default withRouter(ForgotPassword);
