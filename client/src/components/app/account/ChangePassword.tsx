import { observer } from "mobx-react-lite";
import { Segment, Label, Button, Container, Header } from "semantic-ui-react";
import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "@/components/common/form/MyTextInput";
import { useStore } from "@/stores/store";
import * as Yup from "yup";

export default observer(function ChangePassword() {
  const { userStore } = useStore();

  return (
    <>
      <Formik
        initialValues={{ old: "", new: "", confirm: "", error: null }}
        validationSchema={Yup.object({
          old: Yup.string().required("Old Password is required"),
          new: Yup.string().required("New Password is required"),
          confirm: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("new")], "Passwords must match"),
        })}
        onSubmit={(values, { setErrors, resetForm }) =>
          userStore
            .changePassword(values)
            .then(() => {
              resetForm();
            })
            .catch((error) => setErrors({ error: "Invalid password" }))
        }
      >
        {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
          <>
            <Segment.Group>
              <Segment>Change Password</Segment>
              <Segment>
                <Form
                  className="ui form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <Header content="Old Password" sub color="teal" />
                  <MyTextInput
                    placeholder="Old Password"
                    name="old"
                    type="password"
                  />
                  <Header content="New Password" sub color="teal" />
                  <MyTextInput
                    placeholder="New Password"
                    name="new"
                    type="password"
                  />
                  <Header content="Confirm Password" sub color="teal" />
                  <MyTextInput
                    placeholder="Confirm Password"
                    name="confirm"
                    type="password"
                  />
                  <Button
                    disabled={!isValid || !dirty || isSubmitting}
                    loading={isSubmitting}
                    positive
                    content="Update Password"
                    type="submit"
                    fluid
                  />
                </Form>
              </Segment>
            </Segment.Group>
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
          </>
        )}
      </Formik>
    </>
  );
});
