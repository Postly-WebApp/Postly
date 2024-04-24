import React from "react";
import { Formik, Form, Field } from "formik";
import "./App.css";
import { signupSchema } from "./schemas";
import { TextField, Grid, Button } from "@mui/material";
import userIcon from "./Assets/person.png";
import emailIcon from "./Assets/email.png";
import passwordIcon from "./Assets/password.png";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const App = () => {
  const onSubmit = async (values, actions) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Sign-up successful");
        window.location.href = "/home";
      } else {
        const errorData = await response.json();
        console.error("Sign-up error:", errorData);
      }
    } catch (error) {
      console.error("Sign-up request failed:", error);
    } finally {
      actions.resetForm();
    }
  };

  const handleCancel = (actions) => {
    actions.resetForm();
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, resetForm }) => (
          <Form className="inputs">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="input">
                  <img src={userIcon} alt="User icon" className="input-icon" />
                  <Field
                    as={TextField}
                    name="name"
                    className="input-field"
                    placeholder="Name"
                    error={!!errors.name && touched.name}
                    helperText={errors.name && touched.name ? errors.name : ""}
                    fullWidth
                  />
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="input">
                  <img
                    src={emailIcon}
                    alt="Email icon"
                    className="input-icon"
                  />
                  <Field
                    as={TextField}
                    type="email"
                    name="email"
                    className="input-field"
                    placeholder="Email"
                    error={!!errors.email && touched.email}
                    helperText={
                      errors.email && touched.email ? errors.email : ""
                    }
                    fullWidth
                  />
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="input">
                  <img
                    src={passwordIcon}
                    alt="Password icon"
                    className="input-icon"
                  />
                  <Field
                    as={TextField}
                    type="password"
                    name="password"
                    className="input-field"
                    placeholder="Password"
                    error={!!errors.password && touched.password}
                    helperText={
                      errors.password && touched.password ? errors.password : ""
                    }
                    fullWidth
                  />
                </div>
              </Grid>

              <div className="submit-container">
                <button type="submit" className="submit">
                  Sign Up
                </button>
                <button type="button" className="submit" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
