import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { TextField, Grid } from "@mui/material";
import emailIcon from "../../Images/email.png";
import passwordIcon from "../../Images/password.png";

const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const onLogin = async (values, actions) => {
    console.log(values);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      console.log(response.body);
      if (response.ok) {
        console.log("Login successful");
        const responseData = await response.json();
        if (
          responseData.success &&
          responseData.isAdmin &&
          values.email === "adminrou'a@Postly.com" &&
          values.password === "Adminadmin1*"
        ) {
          window.location.href = "/AdminDashboard";
        } else {
          window.location.href = "/home";
        }
      } else {
        alert("incorrect email or password");
        const errorData = await response.json();
        console.error("Login error:", errorData);
      }
    } catch (error) {
      console.error("Login request failed:", error);
    } finally {
      actions.resetForm();
    }
  };

  const handleSignUpClick = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <Formik initialValues={initialValues} onSubmit={onLogin}>
        {({ errors, touched }) => (
          <Form className="inputs">
            <Grid container spacing={2}>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  <Link to="/signup">
                    Don't have an account? Click here to create a new account
                  </Link>
                </div>
              </Grid>
              <div className="submit-container">
                <button type="submit" className="submit">
                  LOGIN
                </button>
              </div>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
}
