import { useState } from 'react';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import { userInfoAtom } from '../../atoms/accounts';

const Ul = styled.ul`
  padding: 0;
  padding-top: 1rem;
`;
const Li = styled.li`
  list-style: none;
  color: ${props => (props.selected ? '#fcb448' : 'black')};
  padding: 0.8rem 1.5rem;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
`;

function SettingLanguage() {
  const [userInfo] = useAtom(userInfoAtom);
  const [newLan, setNewLan] = useState(userInfo.language);
  console.log(newLan);
  const LangLst = [
    {
      id: 0,
      title: '한국어',
    },
    {
      id: 2,
      title: '영어',
    },
  ];
  return (
    <Ul>
      {LangLst.map(ele => (
        <Li
          key={ele.id}
          onClick={() => setNewLan(ele.id)}
          selected={newLan === ele.id}
        >
          {ele.title}
        </Li>
      ))}
    </Ul>
  );
}

export default SettingLanguage;
