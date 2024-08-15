import { Container } from "semantic-ui-react";
import NavBar from "@/components/layout/NavBar";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";

function Main() {
  return (
    <>
      <HeaderMenu content={"Connect"}/>
      <div style={{ padding: "5em 0" }}>
        <Outlet />
      </div>
      <NavBar />
    </>
  );
}

export default observer(Main);
