import React from "react";
import { Formik, Form, Field } from "formik";
import "./signup.css";
import { signupSchema } from "../../schemas";
import { TextField, Grid } from "@mui/material";
import userIcon from "../../Images/person.png";
import emailIcon from "../../Images/email.png";
import passwordIcon from "../../Images/password.png";
import axios from "axios";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

export default function Signup() {
  const onSubmit = async (values, actions) => {
    console.log("Submitting form with values:", values);
    const { username, email, password } = values;
    const userData = { username, email, password };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Sign-up successful");
        window.location.href = "/login";
      } else {
        console.error("Sign-up error:", response.data);
      }
    } catch (error) {
      console.error("Sign-up request failed:", error.response.data);
    } finally {
      actions.resetForm();
    }
  };

  const handleCancel = (resetForm) => {
    resetForm();
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
        {({ values, errors, touched, resetForm }) => (
          <Form className="inputs">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="input">
                  <img src={userIcon} alt="User icon" className="input-icon" />
                  <Field
                    as={TextField}
                    name="username"
                    className="input-field"
                    placeholder="Name"
                    error={!!errors.username && touched.username}
                    helperText={
                      errors.username && touched.username ? errors.username : ""
                    }
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
                <button
                  type="button"
                  className="submit"
                  onClick={() => handleCancel(resetForm)}
                >
                  Cancel
                </button>
              </div>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
}
