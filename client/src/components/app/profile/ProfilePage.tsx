import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { useStore } from "@//stores/store";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import HeaderDetail from "@/components/layout/HeaderDetail";
import { Container } from "semantic-ui-react";
import { Member } from "@/models/member";

export default observer(function ProfilePage() {
  const { username } = useParams();
  const { memberStore } = useStore();
  const { loadingMember, loadMember, member } = memberStore;

  useEffect(() => {
    if (username) loadMember(username);
  }, [loadMember, username]);

  if (loadingMember)
    return <LoadingComponent inverted content="Loading profile..." />;

  if (!member) return <h2>Problem loading profile</h2>;

  return (
    <>
      <HeaderDetail member={member} />
      <Container style={{ paddingTop: "7em" }}>
        <ProfileHeader member={member} isEdit={false} />
        <ProfileBody member={member} />
      </Container>
    </>
  );
});
