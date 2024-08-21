import { Message } from '@/models/message';
import { observer } from 'mobx-react-lite'
import { Image, Comment } from 'semantic-ui-react'
import { useStore } from '@/stores/store';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import user_avatar from "@/assets/img/user.png";

interface Props {
  message: Message;
}
export default observer(function MessageListItem({message}: Props) {
  const { userStore } = useStore();
  const { user } = userStore;  
  
  const author = user?.username === message.senderUsername ?  message.recipientUsername:  message.senderUsername;

  return (
      <div className='messageListItem'>
        <Image as={Link} to={`/members/${author}`} width='60rem' circular src={user?.username === message.senderUsername ?  message.recipientPhotoUrl:  message.senderPhotoUrl || user_avatar} />
          <Comment as={Link} to={`/members/${author}/messages`}>
            <Comment.Content>
              <div className='topMeta'>
                <Comment.Author as='a'>{author}</Comment.Author>
                <Comment.Metadata>
                  <span>{format(new Date(message.messageSent), 'MMM dd')}</span>
                </Comment.Metadata>
              </div>
              <Comment.Text>{message.content}</Comment.Text>
            </Comment.Content>
          </Comment>
        </div>
  )
})
