import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import RestaurantInfoCard from './RestaurantInfoCard';
import ButtonLetsEat from './ButtonLetsEat';
import { apiPostLikeRestau } from '../../api/map';
import {
  summaryRestauAtom,
  pageStatusAtom,
  searchResultsAtom,
} from '../../atoms/map';

const CloseButton = styled.div`
  text-align: end;
  .icon {
    cursor: pointer;
  }
`;
const Summary = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SummaryBox = styled.div``;
const BookMark = styled.div`
  align-self: center;
  margin-right: 10px;
  cursor: pointer;
  .bookmark {
    font-size: 30px;
    color: #fcb448;
  }
`;
const BoxLetsEat = styled.div``;

function SummaryInfo({ getMapwithCommand }) {
  const navigate = useNavigate();
  const [, setPageStatus] = useAtom(pageStatusAtom);
  const [newSearchResult] = useAtom(searchResultsAtom);
  const [summaryRestau, setSummaryRestau] = useAtom(summaryRestauAtom);
  const [newBookMark, setNewBookMark] = useState(summaryRestau.is_like);

  function postLikeRestau() {
    apiPostLikeRestau({ restauId: summaryRestau.id }, () => {
      setNewBookMark(!newBookMark);
      setSummaryRestau({ ...summaryRestau, is_like: !newBookMark });
    });
  }
  return (
    <>
      <CloseButton>
        <CloseIcon
          className="icon"
          onClick={() => {
            if (newSearchResult.length) {
              setPageStatus('searchLst');
            } else {
              setPageStatus('searchBox');
            }
          }}
        />
      </CloseButton>
      <Summary>
        <SummaryBox
          onClick={() => getMapwithCommand('setDetailRestau', summaryRestau.id)}
        >
          <RestaurantInfoCard arrayResult={summaryRestau} />
        </SummaryBox>
        <BookMark onClick={() => postLikeRestau()}>
          {summaryRestau.is_like ? (
            <BookmarkIcon className="bookmark" />
          ) : (
            <BookmarkBorderOutlinedIcon className="bookmark" />
          )}
        </BookMark>
      </Summary>
      <BoxLetsEat
        onClick={() =>
          navigate('/', {
            state: {
              inputRestauPk: summaryRestau.id,
              inputRestauName: summaryRestau.res_info.name,
            },
          })
        }
      >
        <ButtonLetsEat />
      </BoxLetsEat>
    </>
  );
}
SummaryInfo.propTypes = {
  getMapwithCommand: PropTypes.func.isRequired,
};

export default SummaryInfo;
