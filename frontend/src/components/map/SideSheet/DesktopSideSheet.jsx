import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchBox from '../SearchBox';

const drawerWidth = 440;
const openedMixin = theme => ({
  width: drawerWidth,
  top: '60px',
  left: '130px',
  backgroundColor: 'transparent',
  border: 'none',
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});
const closedMixin = theme => ({
  backgroundColor: 'transparent',
  top: '60px',
  border: 'none',
  left: '130px',
  [theme.breakpoints.up('sm')]: {
    left: '-119px',
  },
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});
const SideSheet = muiStyled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));
const SheetContent = styled.div`
  height: calc(100% - 60px);
  display: flex;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;
const Body = styled.div`
  background-color: white;
  width: 100%;
  padding: 1rem;
`;
const Button = styled.button`
  width: 30px;
  height: 10%;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: none;
  border-radius: 0px 10px 10px 0px;
  color: #a9a9a9;
  .arrow-icon {
    transform: ${props => (props.isleft === 'true' ? null : 'rotate(180deg)')};
  }
  :hover {
    cursor: pointer;
  }
`;
function DesktopSideSheet({ setMapSearchKeyword }) {
  const [open, setOpen] = useState(true);
  return (
    <SideSheet variant="permanent" open={open}>
      <SheetContent>
        <Body>
          <SearchBox setMapSearchKeyword={setMapSearchKeyword} />
        </Body>
        <Button
          type="button"
          onClick={() => setOpen(!open)}
          isleft={open.toString()}
        >
          <ArrowBackIosNewIcon className="arrow-icon" />
        </Button>
      </SheetContent>
    </SideSheet>
  );
}
DesktopSideSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
};
export default DesktopSideSheet;
