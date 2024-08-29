import { Message } from "@/models/message";
import { useStore } from "@/stores/store";
import { formatDistanceToNow } from "date-fns";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Comment, Image, Icon, Loader, Dropdown } from "semantic-ui-react";
import user_avatar from "@/assets/img/user.png";
import translate_img from "@/assets/img/translate.png";
import { useNavigate } from "react-router-dom";

interface Props {
    message: Message;
    direction: "from" | "to";
}

export default observer(function MessageContent({ message, direction }: Props) {
    const [translate, setTranslate] = useState<string>("");
    const {
        userStore: { user },
        messageStore: { deleteMessage },
    } = useStore();

    const [translateLoading, setTranslateLoading] = useState(false);

	const navigate = useNavigate();

    const handleTranslate = async (message: string) => {
        let apiUrl = `https://api.mymemory.translated.net/get?q=${message}&langpair=autoDetect|${user?.native}`;
        setTranslateLoading(true);
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                setTranslate(data.responseData.translatedText);
            })
            .finally(() => setTranslateLoading(false));
    };

    return (
        <div
            className={`messageWrapper ${
                direction === "from" ? "messageFrom" : "messageTo"
            }`}
        >
            {direction === "from" && (
                <Image
                    width="45rem"
                    circular
                    src={message.senderPhotoUrl || user_avatar}
                />
            )}
            <Comment>
                <Comment.Content>
                    {direction === "from" && (
                        <Comment.Author as="a">
                            {message.senderUsername}
                        </Comment.Author>
                    )}
                    <Comment.Metadata>
                        <div>
                            {formatDistanceToNow(new Date(message.messageSent))}{" "}
                            ago
                        </div>
                    </Comment.Metadata>
                    <Comment.Text>
                        <div className="originalText">{message.content}</div>
                        {translate && (
                            <div className="translatedText">{translate}</div>
                        )}
                        {translateLoading && (
                            <div className="translatedText">
                                <Loader active inline size="tiny" />
                            </div>
                        )}
                    </Comment.Text>
                    {direction === "to" && <Icon name="check" color={message.dateRead 
                  ? "green" : "grey"} />}
                </Comment.Content>
            </Comment>
            <Dropdown
                pointing="top right"
                icon={<Icon name="ellipsis horizontal" />}
            >
                <Dropdown.Menu>
                    {translate ? (
                        <Dropdown.Item
                            onClick={() => setTranslate("")}
                            text="Fold"
                            icon="chevron up"
                        />
                    ) : (
                        <Dropdown.Item
                            onClick={() => handleTranslate(message.content)}
                            text="Translate"
                            icon={
                                <Image
                                    size="mini"
                                    src={translate_img}
                                    disabled={translateLoading}
                                />
                            }
                        />
                    )}
                    <Dropdown.Item
                        text="Delete for me"
                        icon="trash"
                        onClick={(_) => {deleteMessage(message.id); navigate(0);}}
                    />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
});
