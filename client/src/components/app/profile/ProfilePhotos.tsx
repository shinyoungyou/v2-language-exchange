import { Member, Photo } from "@/models/member";
import { observer } from "mobx-react-lite";
import { Header, Image, Icon, Button } from "semantic-ui-react";
import { useState } from "react";
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

    const [target, setTarget] = useState("");

    function handleSetMain(photo: Photo) {
        setTarget(`setMain-${photo.id}`);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo) {
        setTarget(`deletePhoto-${photo.id}`);
        deletePhoto(photo);
    }

    return (
        <div className="profilePhotos">
            <Image.Group size="small">
                {member.photos.map((p) => (
                    <span
                        key={p.id}
                        className={
                            isCurrentUser
                                ? "isCurrentUser hoverActions"
                                : "hoverActions"
                        }
                    >
                        <Image
                            label={
                                p.isMain && {
                                    corner: "left",
                                    color: "blue",
                                    icon: "star",
                                }
                            }
                            key={p.id}
                            src={p.url}
                        />
                        <Button.Group>
                            <Button
                                name={`setMain-${p.id}`}
                                loading={
                                    target === `setMain-${p.id}` && loading
                                }
                                disabled={p.isMain}
                                onClick={(_) => handleSetMain(p)}
                                icon
                            >
                                <Icon name="star" color="blue" />
                            </Button>
                            <Button
                                name={`deletePhoto-${p.id}`}
                                disabled={p.isMain}
                                loading={
                                    target === `deletePhoto-${p.id}` && loading
                                }
                                onClick={(_) => handleDeletePhoto(p)}
                                icon
                            >
                                <Icon name="delete" color="red" />
                            </Button>
                        </Button.Group>
                    </span>
                ))}
                {isCurrentUser && (
                    <Image>
                        <button
                            onClick={() =>
                                modalStore.openModal(<AddPhotoForm />)
                            }
                            className="addPhotoButton"
                        >
                            <Icon name="plus" color="grey" size="large" />
                        </button>
                    </Image>
                )}
            </Image.Group>
            {isCurrentUser && (
                <Header
                    textAlign="center"
                    subheader="Hover to change main or delete your photos."
                />
            )}
        </div>
    );
});
