import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchBox from '../SearchBox';
import SearchLst from '../SearchLst';
import DetailInfo from '../DetailInfo';
import { pageStatusAtom, isOpendesktopSideBarAtom } from '../../../atoms/map';

const drawerWidth = 440;
const openedMixin = theme => ({
  width: drawerWidth,
  top: '60px',
  left: '130px',
  backgroundColor: 'transparent',
  border: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});
const closedMixin = theme => ({
  width: drawerWidth,
  backgroundColor: 'transparent',
  top: '60px',
  border: 'none',
  left: '130px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    left: '-280px',
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
  display: flex;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
  .button-box {
    height: calc(100vh - 60px);
    display: flex;
  }
`;
const Body = styled.div`
  background-color: white;
  width: 100%;
  padding: 1rem;
`;
const Button = styled.button`
  align-self: center;
  width: 30px;
  height: 7rem;
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
  cursor: pointer;
`;
function DesktopSideSheet({ getMapwithCommand }) {
  const [open, setOpen] = useAtom(isOpendesktopSideBarAtom);
  const [pageStatus] = useAtom(pageStatusAtom);

  return (
    <SideSheet variant="permanent" open={open}>
      <SheetContent>
        <Body>
          {pageStatus === 'searchBox' ? (
            <SearchBox getMapwithCommand={getMapwithCommand} />
          ) : null}
          {pageStatus === 'searchLst' ? (
            <SearchLst getMapwithCommand={getMapwithCommand} />
          ) : null}
          {pageStatus === 'detail' ? (
            <DetailInfo getMapwithCommand={getMapwithCommand} />
          ) : null}
        </Body>
        <div className="button-box">
          <Button
            type="button"
            onClick={() => setOpen(!open)}
            isleft={open.toString()}
          >
            <ArrowBackIosNewIcon className="arrow-icon" />
          </Button>
        </div>
      </SheetContent>
    </SideSheet>
  );
}
DesktopSideSheet.propTypes = {
  getMapwithCommand: PropTypes.func.isRequired,
};
export default DesktopSideSheet;
