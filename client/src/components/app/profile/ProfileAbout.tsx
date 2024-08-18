import { Member } from "@/models/member";
import { observer } from "mobx-react-lite";
import {
  Grid,
  Header,
  Flag,
  Image,
  Icon,
  Segment,
  Label,
} from "semantic-ui-react";
import ProfileFollow from "./ProfileFollow";
import { NativeFlag, LearnFlag } from "@/components/common/options/flagHelper";
import { format, formatDistanceToNow } from "date-fns";

interface Props {
  member: Member;
}

export default observer(function ProfileAbout({ member }: Props) {
  return (
    <>
      <Grid columns={2} container stackable className="profileAbout">
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment.Group>
              <Segment>Languages</Segment>
              <Segment>
                <Header sub>native in</Header>
                <NativeFlag native={member.native} />
                {member.native}
                <Header sub>learning</Header>
                <LearnFlag learn={member.learn} />
                {member.learn}
                <Header sub>level of learning</Header>
                <Icon name="graduation cap" color="grey" /> {member.level}
              </Segment>
            </Segment.Group>
            <Segment.Group>
              <Segment>Bio</Segment>
              <Segment>{member.bio}</Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment.Group>
              <Segment>Location</Segment>
              <Segment>
                <Icon name="globe"></Icon>
                {member.city}, {member.country}
              </Segment>
            </Segment.Group>
            <Segment.Group>
              <Segment>Interests</Segment>
              <Segment>
                {member.interests && (
                  <Label.Group color="blue">
                    <Label as="a">{member.interests}</Label>
                  </Label.Group>
                )}
              </Segment>
            </Segment.Group>
            <Segment.Group>
              <Segment>Last Active</Segment>
              <Segment>
                <>
                  <Icon name="clock outline" />{" "}
                  {formatDistanceToNow(new Date(member.lastActive))} ago
                </>
              </Segment>
            </Segment.Group>
            <Segment.Group>
              <Segment>Joined</Segment>
              <Segment>
                <>
                  <Icon name="calendar alternate outline" />
                  {format(new Date(member.created), "dd MMM yyyy")}
                </>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
});
