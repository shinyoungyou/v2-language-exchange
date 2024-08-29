import { Container, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
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
