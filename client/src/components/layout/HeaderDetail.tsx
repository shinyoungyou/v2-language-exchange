import {
  Button,
  Container,
  Dropdown,
  Menu,
  Image,
  Header,
  Icon,
  Label,
} from "semantic-ui-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import memberStore from "../../stores/memberStore";
import { Member } from "@/models/member";
import { formatDistanceToNow } from "date-fns";

interface Props {
  member: Member;
}

export default observer(function HeaderDetail({ member }: Props) {
  const {
    memberStore: { isCurrentUser },
    presenceStore,
  } = useStore();
  const { onlineUsers } = presenceStore;

  const navigate = useNavigate();

  return (
    <Menu borderless fixed="top" className="headerMenu">
      <Container>
        <Menu.Item onClick={() => navigate(-1)} icon>
          <Icon name="cancel" />
        </Menu.Item>
        <div className="headerUsername">
          <h3 className="profileHeading">{member?.username}</h3>
          <p className="profileHeading">
            {onlineUsers.find(username => username === member.username)? (
              <>
                <Label circular color="olive" empty /> Active now
              </>
            ) : (
              `Active ${formatDistanceToNow(new Date(member.lastActive))} ago`
            )}
          </p>
        </div>

        {!isCurrentUser && (
          <Menu.Item position="right" icon>
            <Dropdown
              pointing="top right"
              icon={<Icon name="ellipsis horizontal" />}
            >
              <Dropdown.Menu>
                <Dropdown.Item text="Follow" icon="add user" />
                <Dropdown.Item text="Report" icon="flag" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
});
