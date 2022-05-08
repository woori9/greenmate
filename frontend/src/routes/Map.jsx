import { useState, useEffect } from 'react';
import styled from 'styled-components';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import logo from '../assets/logo.png';
import ResponsiveMapNavbar from '../components/common/navbar/ResponsiveMapNavbar';
import ResponsiveSideSheet from '../components/map/SideSheet/ResponsiveSideSheet';

const { kakao } = window;
const KakaoMap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;
const BoxMyLocationIcon = styled.div`
  position: fixed;
  top: 60px;
  right: 0;
  padding: 5px;
  margin: 1rem;
  background-color: #f2f2f2;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
  display: flex;
  justify-contnet: center;
  :hover {
    cursor: pointer;
  }
`;
function setMapCurrentPosition() {
  const container = document.getElementById('myMap'); // 지도를 담을 영역의 DOM 레퍼런스
  const options = {
    center: new kakao.maps.LatLng(36.35531199154453, 127.298467693343), // 지도의 중심좌표(필수):LatLng(위도_latitude, 경도, longitude)
    level: 3, // 지도의 레벨(확대, 축소 정도)
  };
  const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
  if (navigator.geolocation) {
    // GeoLocation을 이용해 접속 위치 받기
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const locPosition = new kakao.maps.LatLng(lat, lon);
      map.setCenter(locPosition);
      // 지도에 마킹하기
      // 마킹 이미지 설정
      // const imgSrc = <EnergySavingsLeafIcon />;
      const imgSrc = logo;
      const imgSize = new kakao.maps.Size(50, 50);
      const imgOption = { offset: new kakao.maps.Point(27, 69) };

      const markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption);

      const marker = new kakao.maps.Marker({
        position: locPosition,
        image: markerImg,
      });
      marker.setMap(map);
      // 클릭이벤트
      kakao.maps.event.addListener(marker, 'click', function () {
        console.log('짜잔');
      });
    });
  } else {
    alert('위치 정보 수집에 동의해주세요');
  }
}
function placesSearchCB(data, status) {
  const container = document.getElementById('myMap'); // 지도를 담을 영역의 DOM 레퍼런스
  const options = {
    center: new kakao.maps.LatLng(36.35531199154453, 127.298467693343), // 지도의 중심좌표(필수):LatLng(위도_latitude, 경도, longitude)
    level: 3, // 지도의 레벨(확대, 축소 정도)
  };
  const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
  if (status === kakao.maps.services.Status.OK) {
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가
    const bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < data.length; i += 1) {
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정
    map.setBounds(bounds);
  }
}
const setMapSearchKeyword = async inputKeyword => {
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(inputKeyword, placesSearchCB);
};

function Map() {
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    setMapCurrentPosition();
  }, []);
  return (
    <>
      <ResponsiveMapNavbar />
      <ResponsiveSideSheet
        setMapSearchKeyword={setMapSearchKeyword}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <KakaoMap id="myMap" />
      <BoxMyLocationIcon onClick={() => setMapCurrentPosition()}>
        <MyLocationIcon />
      </BoxMyLocationIcon>
    </>
  );
}

export default Map;
