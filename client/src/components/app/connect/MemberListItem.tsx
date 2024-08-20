import { Card, Icon, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Member } from '@/models/member';
import user_avatar from "@/assets/user.png"

interface Props {
  member: Member;
}

export default observer(function MemberListItem({ member }: Props) {

  return (
    <>
      <Card>
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src={member.photoUrl || user_avatar}
          />
          <Card.Header>
            {member.username}, {member.age}
          </Card.Header>
          <Card.Meta>{member.city}</Card.Meta>
          <Card.Description>
            {member.bio}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button as={Link} to={`/members/${member.username}`} basic color="green">
                <Icon name="user" />
            </Button>
            <Button as={Link} to={`/members/${member.username}/messages`} basic color="blue">
            <Icon name="mail" />
            </Button>
          </div>
        </Card.Content>
      </Card>
    </>
  );
});
