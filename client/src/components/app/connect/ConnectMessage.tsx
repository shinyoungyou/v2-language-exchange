import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Button, Container, Header, Comment, Loader, Icon } from "semantic-ui-react";
import { useStore } from "@/stores/store";
import HeaderDetail from "@/components/layout/HeaderDetail";
import LoadingComponent from "@/components/layout/LoadingComponent";
import MessageFrom from "./messageFrom";
import MessageTo from "./messageTo";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import Picker from "@emoji-mart/react";

export default observer(function ConnectMessage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { username } = useParams();
  const { memberStore, userStore, messageStore } = useStore();
  const { loadingMember, loadMember, member } = memberStore;
  const { user } = userStore;
  const [previewEmoji, setPreviewEmoji] = useState(false);
  const [emojiValue, setEmojiValue] = useState<string>("");

  useEffect(() => {    
    if (user && member) {
      messageStore.createHubConnection(user, member.username);
    }
    return () => {
      messageStore.clearMessages();
    };
  }, [messageStore, member, user]);

  useEffect(() => {
      setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
  }, [messageStore.messages.length]);

  useEffect(() => {
    if (username) loadMember(username);
  }, [loadMember, username]);

  useEffect(() => {
    setEmojiValue((prev: string) => prev === emojiValue ? "" : emojiValue);
  }, [emojiValue])

  const addEmoji = (e: any, setFieldValue: any, body: any) => {
    let emoji = e.native;
    setEmojiValue(emoji);
    setPreviewEmoji(false);
    setFieldValue("body",  body + emoji);
  };

  if (loadingMember)
    return <LoadingComponent inverted content="Loading profile..." />;

  if (!member) return <h2>Problem loading profile</h2>;

  return (
    <>
      <HeaderDetail member={member} />
      <Container style={{ padding: "7em 0 10em 0" }}>
        <Comment.Group>
          {messageStore.messages.map((message) =>
            message.senderUsername === user?.username ? (
              <MessageTo key={message.id} message={message} />
            ) : (
              <MessageFrom key={message.id} message={message} />
            )
          )}
        </Comment.Group>
      </Container>
      <div ref={messagesEndRef} />
      <div className="mesageForm">
        <Formik
          onSubmit={(values, { resetForm }) => {
            messageStore.sendMessage(member.username, values.body).then(() => resetForm())
          }}
          initialValues={{ body: "" }}
          validationSchema={Yup.object({
            body: Yup.string().required(),
          })}
        >
          {({ isSubmitting, values, isValid, handleChange, handleSubmit, setFieldValue }) => (
            <Container>
              <Form className="ui form">
                <Field name="body">
                  {(props: FieldProps) => (
                    <div style={{ position: "relative" }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        placeholder="Enter your message (Enter to submit, SHIFT + Enter for new line)"
                        rows={3}
                        {...props.field}
                        value={values.body + emojiValue}
                        onChange={props.field.onChange}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.shiftKey) {
                            return;
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            isValid && handleSubmit();
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
              </Form>

              <Button
                size="huge"
                basic
                className="emoji-icon"
                onClick={() => setPreviewEmoji(!previewEmoji)}
              >
                <Icon name="smile outline" />
              </Button>

              {previewEmoji && (
                <div className="chat-emoji-picker" dir="ltr">
                  <Picker
                    set="google"
                    onEmojiSelect={(e: any) => addEmoji(e, setFieldValue, values.body)}
                    previewPosition="none"
                    skinTonePosition="none"
                  />
                </div>
              )}
            </Container>
          )}
        </Formik>
      </div>
    </>
  );
});
