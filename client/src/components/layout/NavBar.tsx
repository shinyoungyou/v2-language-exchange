import {
  Button,
  Container,
  Dropdown,
  Menu,
  Image,
  Icon,
} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();
  return (
    <Menu icon="labeled" borderless fixed="bottom" className="navBar">
      <Container>
        <Menu.Item icon as={NavLink} to="/messages" name="Messages">
          <Icon name="mail" /> Messages
        </Menu.Item>
        <Menu.Item icon as={NavLink} to="/connect" name="Connect">
          <Icon name="users" /> Connect
        </Menu.Item>
        <Menu.Item icon as={NavLink} to="/location" name="Location">
          <Icon name="location arrow" /> Location
        </Menu.Item>
        <Menu.Item icon as={NavLink} to="/about" name="About">
          <Icon name="question circle" /> About
        </Menu.Item>
      </Container>
    </Menu>
  );
});
