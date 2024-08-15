import {
  Button,
  Container,
  Dropdown,
  Menu,
  Image,
  Header,
} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";

interface Props {
  content: string;
}

export default observer(function HeaderMenu({ content }: Props) {
  const {
    userStore: { user, logout },
  } = useStore();
  return (
    <Menu borderless fixed="top" className="headerMenu">
      <Container>

        <Menu.Item position="left" as={NavLink} to='/'>
        <img
            src={require("@/assets/img/logo.png")}
            alt="logo"
            style={{ marginRight: 10 }}
          />
          <p className="headerLogoText">language exchange</p>
        </Menu.Item>
        <Menu.Item as={NavLink} to="/" header>
        <Header content={content} textAlign="center" size="medium" className="headerCenter"/>
        
        </Menu.Item>
        <Menu.Item position="right">
          <Image
            avatar
            spaced="right"
            src={user?.photoUrl || require("@/assets/img/user.png")}
          />
          <Dropdown pointing="top right" text={user?.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to={`/members/${user?.username}`}
                text="My Profile"
                icon="user"
              />
              <Dropdown.Item onClick={logout} text="Logout" icon="power" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
});
