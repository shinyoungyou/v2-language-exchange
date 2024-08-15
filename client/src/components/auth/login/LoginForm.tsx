import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Container, Header, Label } from "semantic-ui-react";
import MyTextInput from "@/components/common/form/MyTextInput";
import { useStore } from "@/stores/store";
import { useState } from "react";
import * as Yup from "yup";

export default observer(function LoginForm() {
  const { userStore } = useStore();
  const [captchaIsDone, setCaptchaIsDone] = useState(false);

  const onChange = () => {
    setCaptchaIsDone(true);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", error: null }}
      validationSchema={validationSchema}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .catch((error) => setErrors({ error: "Invalid email or password" }))
      }
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Container text>
          <ul>
            <li>email: bob@test.com</li>
            <li>password: Pa$$w0rd</li>
          </ul>
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <Header
              as="h2"
              content="Welcome back"
              color="teal"
              textAlign="center"
              subheader="Please log in with your original account details"
            />
            <MyTextInput placeholder="Email" name="email" />
            <MyTextInput
              placeholder="Password"
              name="password"
              type="password"
            />
            <ErrorMessage
              name="error"
              render={() => (
                <Label
                  style={{ marginBottom: 10 }}
                  basic
                  color="red"
                  content={errors.error}
                />
              )}
            />
          
            <Button
              disabled={!isValid || !dirty || isSubmitting || !captchaIsDone}
              loading={errors == null && isSubmitting}
              positive
              content="Login"
              type="submit"
              fluid
            />
          </Form>
        </Container>
      )}
    </Formik>
  );
});
