import { observer } from "mobx-react-lite";
import { Header, Segment, Label, Button } from "semantic-ui-react";
import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "@/components/common/form/MyTextInput";
import { useStore } from "@/stores/store";
import MySelectInput from "@/components/common/form/MySelectInput";
import { languageOptions, levelOptions } from "@/components/common/options/categoryOptions";
import * as Yup from "yup";
import { Member } from "@/models/member";
import MyTextAreaInput from "../../common/form/MyTextArea";

interface Props {
  member: Member;
}

export default observer(function ProfileSettings({ member }: Props) {
  const { memberStore } = useStore();
  const { loading } = memberStore;

  const initialValues = {
    displayName: member.displayName,
    native: member.native,
    learn: member.learn,
    level: member.level,
    bio: member.bio,
    interests: member.interests,
    error: null,
  };

  const validationSchema = Yup.object({
    displayName: Yup.string().required("Fullname is required"),
    native: Yup.string().required("Native language is required"),
    learn: Yup.string().required("Learning language is required"),
    level: Yup.string().required("Level of learning language is required"),
    bio: Yup.string().required("Bio is required").nullable(),
    interests: Yup.string().required("Interests is required").nullable(),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setErrors }) =>
          memberStore
            .updateMember(values)
            .catch((error) => setErrors({ error: "Failed to update profile" }))
        }
      >
        {({ handleSubmit, isSubmitting, errors, isValid, dirty, values }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <Segment.Group>
              <Segment>Profile Settings</Segment>
              <Segment>
                <Header content="Fullname" sub color="teal" />
                <MyTextInput placeholder="Fullname" name="displayName" />
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
                <Header content="Level of learning language" sub color="teal" />
                <MySelectInput
                  options={levelOptions}
                  name="level"
                  placeholder={`${values.learn} Level`}
                />
                <Header content="Bio" sub color="teal" />
                <MyTextAreaInput placeholder="Bio" name="bio" rows={5} />
                <Header content="Interest" sub color="teal" />
                <MyTextInput placeholder="Interest" name="interests" />
                <Button
                  disabled={!isValid || !dirty || isSubmitting}
                  loading={isSubmitting}
                  positive
                  content="Update Profile"
                  type="submit"
                  fluid
                />
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
          </Form>
        )}
      </Formik>
    </>
  );
});
