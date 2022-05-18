import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background-color: #f2f2f2;
  padding: 2rem 0;

  .footer-content {
    text-align: center;
    line-height: 2;
  }

  .footer-content-title {
    font-weight: 700;
  }

  @media screen and (max-width: 1024px) {
    .footer-content {
      padding-bottom: 62px;
    }
  }

  @media screen and (min-width: 1025px) {
    padding-left: 130px;
  }
`;

function Footer() {
  return (
    <>
      <Outlet />
      <StyledFooter>
        <div className="footer-content">
          <p className="footer-content-title">SSAFY 6기 자율 프로젝트 B105</p>
          <p>박소미 백민아 원유진 최승연 최시열 한우리</p>
          <p>@Greenmate. ALL RIGHTS RESERVED</p>
        </div>
      </StyledFooter>
    </>
  );
}

export default Footer;
