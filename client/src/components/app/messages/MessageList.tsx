import { observer } from 'mobx-react-lite'
import { Comment } from 'semantic-ui-react'
import MessageListItem from './MessageListItem';
import { useStore } from '@/stores/store';

export default observer(function MessageList() {
  const { messageStore } = useStore();
  const { messages } = messageStore;    

  return (
      <Comment.Group>
        {messages.map(message => (
          <MessageListItem key={message.id} message={message} />
        ))}
      </Comment.Group>
  )
})
