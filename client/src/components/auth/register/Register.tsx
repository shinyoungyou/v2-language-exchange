import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import {
  Button,
  Container,
  Header,
  Progress,
} from "semantic-ui-react";
import MyTextInput from "@/components/common/form/MyTextInput";
import { useStore } from "@/stores/store";
import { useState } from "react";
import * as Yup from "yup";
import ValidationError from "@/components/errors/ValidationError";
import MyDateInput from "@/components/common/form/MyDateInput";
import MySelectInput from "@/components/common/form/MySelectInput";
import {
  genderOptions,
  languageOptions,
  levelOptions,
} from "@/components/common/options/categoryOptions";


interface InitialValues {
    displayName: string,
    username: string,
    email: string,
    password: string,
    gender: string,
    birthday: string,
    native: string,
    learn: string,
    level: string,
    city: string,
    country: string,
    error: null,
}

export default observer(function Register() {
  const { userStore } = useStore();
  const {user} = userStore;

  const [percent, setPercent] = useState(user === null ? 25 : 50);

  const initialValues = {
    displayName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    birthday: "",
    native: "",
    learn: "",
    level: "",
    city: "",
    country: "",
    error: null,
  };

  const currentUserValues = {
    gender: "",
    birthday: "",
    native: "",
    learn: "",
    level: "",
    city: "",
    country: "",
    error: null,
  };

  const validationSchema = Yup.object({
    displayName: Yup.string().required("Fullname is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required("Password is required"),
    gender: Yup.string().required("Gender is required"),
    birthday: Yup.string().required("Birthday is required").nullable(),
    native: Yup.string().required("Native language is required"),
    learn: Yup.string().required("Learning language is required"),
    level: Yup.string().required("Level of learning language is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
  });

  const completeValidationSchema = Yup.object({
    gender: Yup.string().required("Gender is required"),
    birthday: Yup.string().required("Birthday is required").nullable(),
    native: Yup.string().required("Native language is required"),
    learn: Yup.string().required("Learning language is required"),
    level: Yup.string().required("Level of learning language is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
  });

  const handleProgress = (operator: string) => {
    switch (operator) {
      case "+":
        setPercent((prev) => (prev >= 100 ? 25 : prev + 25));
        break;
      case "-":
        setPercent((prev) => (prev >= 100 ? 25 : prev - 25));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Progress percent={percent} indicating />
      <Container text>
        <Formik
          initialValues={user !== null ? currentUserValues : initialValues}
          onSubmit={(values, { setErrors }) => {
            console.log("asdfasdf");
            
            console.log(values);
            if (user === null) {
              userStore.register(values as InitialValues).catch((error) => {
                setPercent(25);
                setErrors({ error });
              });
            } else {
              console.log('complete ?');
            }
            
          }}
          validationSchema={user !== null ? completeValidationSchema : validationSchema}
        >
          {({ handleSubmit, isSubmitting, errors, isValid, dirty, values }) => (
            <Form
              className="ui form error"
              onSubmit={()=> console.log('submit event')}
              autoComplete="off"
            >
              <Header
                as="h2"
                content={user !== null ? "Complete your profile" : "Create a new account"}
                color="teal"
                textAlign="center"
                subheader="Language Exchange is a global community just for language learners. By connecting one of your existing accounts, you create a profile on Language Exchange and you agree to our Privacy Policy and Terms of Service."
              />
              {user === null && percent === 25 && (
                <>
                  <Header content="Fullname" sub color="teal" />
                  <MyTextInput placeholder="Fullname" name="displayName" />
                  <Header content="Username" sub color="teal" />
                  <MyTextInput placeholder="Username" name="username" />
                  <Header content="Email address" sub color="teal" />
                  <MyTextInput placeholder="Email" name="email" type="email" />
                  <Header content="Password" sub color="teal" />
                  <MyTextInput
                    placeholder="Password"
                    name="password"
                    type="password"
                  />
                </>
              )}
              {percent === 50 && (
                <>
                  <Header content="Birthday" sub color="teal" />
                  <MyDateInput
                    name="birthday"
                    placeholderText="Birthday"
                    dateFormat="yyyy-MM-dd"
                  />
                  <Header content="Gender" sub color="teal" />
                  <MySelectInput
                    options={genderOptions}
                    name="gender"
                    placeholder="Gender"
                  />
                  <Header content="City" sub color="teal" />
                  <MyTextInput placeholder="City" name="city" />
                  <Header content="Country" sub color="teal" />
                  <MyTextInput placeholder="Country" name="country" />
                </>
              )}
              {percent === 75 && (
                <>
                  <Header content="Native language" sub color="teal" />
                  <MySelectInput
                    options={languageOptions}
                    name="native"
                    placeholder="Native language"
                  />
                  <Header content="Learning language" sub color="teal" />
                  <MySelectInput
                    options={languageOptions}
                    name="learn"
                    placeholder="Learning language"
                  />
                  <Header
                    content="Level of learning language"
                    sub
                    color="teal"
                  />
                  <MySelectInput
                    options={levelOptions}
                    name="level"
                    placeholder={`${values.learn} Level`}
                  />
                </>
              )}
              <ErrorMessage
                name="error"
                render={() => <ValidationError errors={errors.error} />}
              />
              {percent < 100 && (
                <Button
                  disabled={!isValid || !dirty || isSubmitting}
                  loading={errors == null && isSubmitting}
                  positive
                  content="Register"
                  type="submit"
                  fluid
                  onClick={() => {setPercent(100); console.log(values); handleSubmit()}}
                  style={{marginBottom: '1rem'}}
                />
              )}
            </Form>
          )}
        </Formik>
        {percent > (user === null ? 25 : 50) && percent < 100 && (
          <Button onClick={() => handleProgress("-")}>Previous</Button>
        )}
        {percent < 75 && (
          <Button floated="right" onClick={() => handleProgress("+")}>
            Next
          </Button>
        )}
      </Container>
    </div>
  );
});
