import { useStore } from "@/stores/store";

import { Member } from "@/models/member";
import { observer } from "mobx-react-lite";
import { Grid, Image, Button, Icon } from "semantic-ui-react";
import { NativeFlag, LearnFlag } from "@/components/common/options/flagHelper";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import user_avatar from "@/assets/img/user.png";

interface Props {
    member: Member;
    isEdit: boolean;
}

export default observer(function ProfileHeader({ member, isEdit }: Props) {
    const {
        memberStore: { isCurrentUser, setActiveTab, loading },
    } = useStore();
    const navigate = useNavigate();

    const [content, setContent] = useState("Following");

    const handleMainPhoto = () => {
        setActiveTab(1);
    };
    // function handleFollow(username: string) {
    //   member.following ? unfollow(username) : follow(username);
    // }

    return (
        <Grid columns={2} container stackable>
            <Grid.Row>
                <Grid.Column>
                    <Image
                        size="medium"
                        circular
                        centered
                        src={member.photoUrl || user_avatar}
                    />
                </Grid.Column>
                <Grid.Column className="flexBoxContainer">
                    <div>
                        <h3 className="profileHeading">
                            {member.displayName}, {member.age}
                        </h3>
                        <h4 className="profileHeading">
                            Native in <NativeFlag native={member.native} />{" "}
                            Learning <LearnFlag learn={member.learn} />
                        </h4>
                        <h4 className="profileHeading">
                            {/* <Rating icon='heart' defaultRating={2} maxRating={3} /> */}
                            <Icon name="graduation cap" color="grey" />{" "}
                            {member.level}
                        </h4>
                        <p className="profileHeading">
                            {member.city}, {member.country}
                        </p>
                    </div>

                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column className="followGrid">
                                <Icon size="large" name="users" />N Followers
                            </Grid.Column>
                            <Grid.Column className="followGrid">
                                <Icon size="large" name="add user" />N Following
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {isEdit && isCurrentUser && (
                        <Button fluid color="blue" onClick={() => navigate(-1)}>
                            Done
                        </Button>
                    )}
                    {isEdit === false && isCurrentUser && (
                        <>
                            <Button basic onClick={handleMainPhoto}>
                                <Icon name="photo" />
                                Change main photo
                            </Button>
                            <Button
                                fluid
                                color="blue"
                                as={NavLink}
                                to={`/edit/${member.username}`}
                            >
                                <Icon name="setting" />
                                Edit profile
                            </Button>
                        </>
                    )}
                    {isCurrentUser === false && (
                        <>
                            <Button
                                fluid
                                basic
                                as={NavLink}
                                to={`/members/${member.username}/messages`}
                            >
                                <Icon name="chat" />
                                Message
                            </Button>
                            <Button
                                onMouseEnter={() => setContent("Unfollow")}
                                onMouseLeave={() => setContent("Following")}
                                loading={loading}
                                fluid
                                color="blue"
                                // onClick={() => handleFollow(member.username)}
                                className={
                                    true ? "followBtn unfollow" : "followBtn"
                                }
                            >
                                {true ? (
                                    <Icon
                                        name={
                                            content === "Following"
                                                ? "users"
                                                : "remove user"
                                        }
                                    />
                                ) : (
                                    <Icon name="add user" />
                                )}
                                {true ? content : "Follow"}
                            </Button>
                        </>
                    )}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
});
