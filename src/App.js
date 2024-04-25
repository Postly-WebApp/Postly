import React from "react";
import './App.css';
import { Formik, Form, Field } from "formik";
import { TextField, Grid } from "@mui/material";
import emailIcon from './png/email.png';
import passwordIcon from './png/password.png';


const initialValues = {
  email: "",
  password: "",
};

const App = () => {
  const onLogin = async (values, actions) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log('Login successful');
        window.location.href = "/home";
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData);
      }
    } catch (error) {
      console.error('Login request failed:', error);
    } finally {
      actions.resetForm();
    }
  };

  const handleSignUpClick = () => {
    window.location.href = "/signup";
  };

  const handleCancel = (actions) => {
    actions.resetForm();
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={onLogin}
      >
        {({ errors, touched }) => (
          <Form className="inputs">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="input">
                  <img src={emailIcon} alt="Email icon" className="input-icon" />
                  <Field
                    as={TextField}
                    type="email"
                    name="email"
                    className="input-field"
                    placeholder="Email"
                    error={!!errors.email && touched.email}
                    helperText={errors.email && touched.email ? errors.email : ""}
                    fullWidth
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="input">
                  <img src={passwordIcon} alt="Password icon" className="input-icon" />
                  <Field
                    as={TextField}
                    type="password"
                    name="password"
                    className="input-field"
                    placeholder="Password"
                    error={!!errors.password && touched.password}
                    helperText={errors.password && touched.password ? errors.password : ""}
                    fullWidth
                  />
                </div>
              </Grid>
              <div className="submit-container">
                <button type="submit" className="submit">Login</button>
              </div>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
