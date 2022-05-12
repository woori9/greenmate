import { useState } from 'react';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import { userInfoAtom } from '../../atoms/accounts';
import { apiPutLanguage } from '../../api/accounts';

const Ul = styled.ul`
  padding: 1rem;
`;
const Li = styled.li`
  list-style: none;
  color: ${props => (props.selected ? '#fcb448' : 'black')};
  padding: 0.8rem 1.5rem;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
`;

function SettingLanguage() {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [newLan, setNewLan] = useState(userInfo.language);
  const LangLst = [
    {
      id: 0,
      title: '한국어',
    },
    {
      id: 1,
      title: '영어',
    },
  ];
  function putLanguage(putNewLang) {
    apiPutLanguage(
      { language: putNewLang },
      res => {
        alert('언어 설정이 변경되었습니다');
        setUserInfo({ ...userInfo, ...res.data });
      },
      () => {
        alert('언어 설정 변경에 실패했습니다');
      },
    );
  }
  return (
    <Ul>
      {LangLst.map(ele => (
        <Li
          key={ele.id}
          onClick={() => {
            setNewLan(ele.id);
            putLanguage(ele.id);
          }}
          selected={newLan === ele.id}
        >
          {ele.title}
        </Li>
      ))}
    </Ul>
  );
}

export default SettingLanguage;
