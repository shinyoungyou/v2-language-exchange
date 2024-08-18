import { Member } from "@/models/member";
import { observer } from "mobx-react-lite";
import {
  Tab,
} from "semantic-ui-react";
import ProfileAbout from "./ProfileAbout";
import ProfilePhotos from "./ProfilePhotos";
import { useStore } from '@/stores/store';

interface Props {
  member: Member;
}

export default observer(function ProfileBody({ member }: Props) {
  const {memberStore: {activeTab, setActiveTab}} = useStore();

  const panes = [
    { menuItem: `About ${member.displayName}`, render: () => <ProfileAbout member={member} /> },
    { menuItem: "Photos", render: () => <ProfilePhotos member={member} /> },
    // { menuItem: 'Followers', render: () => <ProfileFriends /> },
  ];

  return (
    <Tab
      menu={{ secondary: true, pointing: true }}
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
      activeIndex={activeTab}
    />
  );
});
