import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/store";
import { Button, Input, Icon, Image, Label, Header } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { UserParams } from "@/models/userParams";
import { useState, useEffect } from "react";

import TooltipSlider, { handleRender } from "@/components/common/TooltipSlider";
import "rc-slider/assets/index.css";

export default observer(function MemberFilters() {
  const { memberStore, userStore } = useStore();
  const { user } = userStore;

  const [userParams, setUserParams] = useState<UserParams>(
    memberStore.userParams
  );

  const [display, setDisplay] = useState("none");

  useEffect(() => {
    console.log(userParams);
  }, [userParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userParams);
    memberStore.setUserParams(userParams);
  };

  const handleReset = () => {
    setUserParams(new UserParams(user!));
    setDisplay("none");
  };

  const handleOrder = (order: string) => {
    setUserParams((prev) => ({ ...prev, orderBy: order }));
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    memberStore.searchMembers(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="memberFilter">
          <Input
          transparent
            iconPosition='left'
            placeholder="Find members or countries..."
            onChange={(e) => handleSearchChange(e)}
            icon="search"
          />
          <Button
          inverted
          basic
            type="button"
            onClick={() => setDisplay("flex")}
            circular
            icon
          >
            <Image
              width="23rem"
              src="https://cdn-icons-png.flaticon.com/512/5369/5369247.png"
            />
          </Button>
        </div>

        <div className="filterDropdown" style={{ display }}>
          <Header className="filterHeader" color="blue">
            <Icon name="filter" />
            Filters
          </Header>
          <Icon onClick={() => setDisplay("none")} name="cancel" />

          <div className="firstBtnGroup">
            <Button.Group primary>
              <Button type="submit" onClick={() => handleOrder("lastActive")}>
                Last Active
              </Button>
              <Button type="submit" onClick={() => handleOrder("created")}>
                New members
              </Button>
            </Button.Group>
          </div>

          <div>
            <span>Age</span>

            <span className="ageRange">
              <input
                onChange={handleChange}
                name="minAge"
                value={userParams.minAge}
                placeholder="Age from: "
              />{" "}
              -{" "}
              <input
                onChange={handleChange}
                name="maxAge"
                value={userParams.maxAge}
                placeholder="Age to: "
              />
            </span>

            <TooltipSlider
              range
              min={18}
              max={50}
              onChange={(value) =>
                setUserParams((prev) => ({
                  ...prev,
                  minAge: (value as number[])[0],
                  maxAge: (value as number[])[1],
                }))
              }
              defaultValue={[userParams.minAge, userParams.maxAge]}
              tipFormatter={(value) => `${value}`}
              tipProps={undefined}
            />
          </div>

          <div className="genderFilter">
            Gender:{" "}
            <Label as="label">
              <input
                onChange={handleChange}
                type="radio"
                name="gender"
                value="All"
                checked={userParams.gender === "All"}
              />{" "}
              <Icon name="users" />
              All
            </Label>
            <Label as="label">
              <input
                onChange={handleChange}
                type="radio"
                name="gender"
                value="Female"
                checked={userParams.gender === "Female"}
              />{" "}
              <Icon name="female" />
              Females
            </Label>
            <Label as="label">
              <input
                onChange={handleChange}
                type="radio"
                name="gender"
                value="Male"
                checked={userParams.gender === "Male"}
              />{" "}
              <Icon name="male" />
              Males
            </Label>
          </div>

          <Button.Group>
            <Button type="submit" onClick={handleReset}>
              Reset
            </Button>
            <Button.Or />
            <Button
              color="blue"
              onClick={() => setDisplay("none")}
              type="submit"
            >
              Apply
            </Button>
          </Button.Group>
        </div>
      </form>
    </>
  );
});
