import { Member, Photo } from "@/models/member";
import { observer } from "mobx-react-lite";
import { Header, Image, Icon, Button } from "semantic-ui-react";
import { SyntheticEvent, useState } from "react";
import { useStore } from "@/stores/store";
import AddPhotoForm from "@/components/common/imageUpload/AddPhotoForm";

interface Props {
  member: Member;
}

export default observer(function ProfilePhotos({ member }: Props) {
  const {
    modalStore,
    memberStore: { isCurrentUser, setMainPhoto, deletePhoto, loading },
  } = useStore();

  const [target, setTarget] = useState('');

  function handleSetMain(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  }

  function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }

  return (
    <div className="profilePhotos">
      <Image.Group size="small">
        {member.photos.map((p) => (
          <span key={p.id} className={isCurrentUser ? "isCurrentUser hoverActions": "hoverActions"}>
            <Image
              label={
                p.isMain && { corner: "left", color: "blue", icon: "star" }
              }
              key={p.id}
              src={p.url}
            />
            <Button.Group>
              <Button 
                name={p.id} 
                // loading={target === p.id && loading}
                disabled={p.isMain}
                onClick={e => handleSetMain(p, e)}
                icon>
                <Icon name="star" color="blue" />
              </Button>
              <Button
                name={p.id} 
                disabled={p.isMain}
                // loading={target === p.id && loading}
                onClick={e => handleDeletePhoto(p, e)}
                icon>
                <Icon name="delete" color="red" />
              </Button>
            </Button.Group>
          </span>
        ))}
        {isCurrentUser && (
          <Image>
            <button
              onClick={() => modalStore.openModal(<AddPhotoForm />)}
              className="addPhotoButton"
            >
              <Icon name="plus" color="grey" size="large" />
            </button>
          </Image>
        )}
      </Image.Group>
      {isCurrentUser && <Header
        textAlign="center"
        subheader="Hover to change main or delete your photos."
      />}
    </div>
  );
});
