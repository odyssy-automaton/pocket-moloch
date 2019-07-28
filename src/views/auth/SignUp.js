import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Auth } from 'aws-amplify';

import Loading from '../../components/shared/Loading';

const SignUp = ({ history }) => {
  const [authError, setAuthError] = useState();

  return (
    <div>
      <h2 className="Pad">Sign up with Email</h2>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validate={(values) => {
          let errors = {};
          if (!values.username) {
            errors.email = 'Required';
          }
          if (!values.email) {
            errors.email = 'Required';
          }
          if (!values.email) {
            errors.password = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          // set custom attributes to 0x0 as place holder
          try {
            await Auth.signUp({
              username: values.username,
              password: values.password,
              attributes: {
                email: values.email,
                'custom:account_address': '0x0',
                'custom:device_address': '0x0',
              },
            });
            history.push('/confirm');
          } catch (err) {
            console.log('error signing up: ', err);
            setSubmitting(false);
            setAuthError(err);
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
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Pseudonym</label>
                    <input type="text" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="username"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="email">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Email</label>
                    <input type="text" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="email"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="password">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Password</label>
                    <input type="password" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="password"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
      <Link className="AltOption" to="/sign-in">
        I already have an account
      </Link>
      <Link className="AltOption" to="/confirm">
        Confirm account
      </Link>
    </div>
  );
};

export default withRouter(SignUp);
