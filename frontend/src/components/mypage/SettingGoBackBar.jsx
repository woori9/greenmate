import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Bar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  top: 0px;
  width: 100%;
  height: 52px;
  background-color: white;
  z-index: 3;
  .icon {
    cursor: pointer;
  }
  p {
    font-size: 1.25rem;
    text-align: center;
  }

  div {
    margin-left: auto;
  }

  @media screen and (min-width: 1025px) {
    top: 60px;
    left: 130px;
  }
`;

function SettingGoBackBar({ title, setPageStatus }) {
  return (
    <Bar>
      <ChevronLeftIcon
        className="icon"
        sx={{ width: '35px', height: '35px' }}
        onClick={() => setPageStatus('settingLst')}
      />
      <p>{title}</p>
    </Bar>
  );
}

SettingGoBackBar.propTypes = {
  title: PropTypes.string.isRequired,
  setPageStatus: PropTypes.func.isRequired,
};

export default SettingGoBackBar;
