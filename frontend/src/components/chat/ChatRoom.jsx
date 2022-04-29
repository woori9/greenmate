import styled from 'styled-components';
import { useRef } from 'react';

const StyledChatRoom = styled.div`
  background-color: azure;
  width: 50%;
  height: 500px;
`;

function ChatRoom() {
  const messageRef = useRef();

  return (
    <StyledChatRoom className="room">
      <input ref={messageRef} type="text" />
      <button type="button">send message</button>
    </StyledChatRoom>
  );
}

export default ChatRoom;
