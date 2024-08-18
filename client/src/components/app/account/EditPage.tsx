import { observer } from "mobx-react-lite";
import EditProfile from "./EditProfile";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { useStore } from "@//stores/store";
import HeaderDetail from "@/components/layout/HeaderDetail";
import { Container } from "semantic-ui-react";
import ProfileHeader from "../profile/ProfileHeader";

export default observer(function EditPage() {
  const { username } = useParams();
  const { memberStore, userStore: { user } } = useStore();
  const { loadingMember, loadMember, member } = memberStore;

  useEffect(() => {
    if (username) loadMember(username);
  }, [loadMember, username]);

  if (loadingMember)
    return <LoadingComponent inverted content="Loading profile..." />;

  if (member === null) return <h2>Problem loading profile</h2>;
  if (member?.username !== user?.username) return <h2>Problem loading profile</h2>;

  return (
    <>
      <HeaderDetail member={member} />
      <Container style={{ paddingTop: "7em" }}>
        <ProfileHeader member={member} isEdit={true} />
        <EditProfile member={member} />
      </Container>
    </>
  );
});
