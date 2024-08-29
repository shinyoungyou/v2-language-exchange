import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Image, Segment } from "semantic-ui-react";
import user_avatar from "@/assets/img/user.png";

interface Props {
    header: string;
}

export default observer(function ProfileFollow({ header }: Props) {
    return (
        <Segment.Group>
            <Segment className="flexSpaceBetween">
                {header}
                <Link to="#"> See all members</Link>
            </Segment>
            <Segment className="followBodyWrapper">
                <div className="followBody">
                    <Image circular size="small" src={user_avatar} />
                    <h3>Lisa</h3>
                    <p>Portland, US</p>
                </div>
                <div className="followBody">
                    <Image circular size="small" src={user_avatar} />
                    <h3>Lisa</h3>
                    <p>Portland, US</p>
                </div>
                <div className="followBody">
                    <Image circular size="small" src={user_avatar} />
                    <h3>Lisa</h3>
                    <p>Portland, US</p>
                </div>
            </Segment>
        </Segment.Group>
    );
});
