import { observer } from "mobx-react-lite";
import { Grid, Header, Segment, Button } from "semantic-ui-react";
import { useStore } from "@/stores/store";
import ProfileSettings from "./ProfileSettings";
import { Member } from "@/models/member";
import ChangePassword from "./ChangePassword";
import ChangeLocation from "./ChangeLocation";

interface Props {
  member: Member;
}

export default observer(function EditProfile({ member }: Props) {
  return (
    <>
      <Grid columns={2} container stackable>
        <Grid.Row>
          <Grid.Column width={10}>
          <ProfileSettings member={member} />
          </Grid.Column>
          <Grid.Column width={6}>   
            <ChangePassword />
            <ChangeLocation />
            {/* <Segment.Group>
              <Segment>Danger Zone</Segment>
              <Segment>
                <Header content="Delete this account" sub color="red" />
                <Button negative disabled>Deactivate account</Button>
              </Segment>
            </Segment.Group> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
});
