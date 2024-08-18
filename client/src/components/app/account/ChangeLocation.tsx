import { observer } from "mobx-react-lite";
import { Segment, Label, Button, Container, Header } from "semantic-ui-react";
import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "@/components/common/form/MyTextInput";
import { useStore } from "@/stores/store";
import * as Yup from "yup";

export default observer(function ChangeLocation() {
  const { memberStore } = useStore();
  const { member } = memberStore;

  if (member === null) return <>Problem loading ChangeLocation</>;

  return (
    <>
      <Formik
        initialValues={{ city: member.city, country: member.country, error: null }}
        validationSchema={Yup.object({
          city: Yup.string().required("New City is required"),
          country: Yup.string().required("New Country is required"),
        })}
        onSubmit={(values, { setErrors, resetForm }) =>
          memberStore
            .changeLocation(values)
              .catch((error) => setErrors({ error: "Failed to change locaiton" }))
        }
      >
        {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
          <>
            <Segment.Group>
              <Segment>Change Location</Segment>
              <Segment>
                <Form
                  className="ui form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <Header content="New City" sub color="teal" />
                  <MyTextInput
                    placeholder="New City"
                    name="city"
                  />
                  <Header content="New Country" sub color="teal" />
                  <MyTextInput
                    placeholder="New Country"
                    name="country"
                  />
                  <Button
                    disabled={!isValid || !dirty || isSubmitting}
                    loading={isSubmitting}
                    positive
                    content="Update Location"
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
