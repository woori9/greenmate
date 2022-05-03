import { useEffect } from 'react';
import styled from 'styled-components';

const { kakao } = window;

const Map = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

function KakaoMap() {
  useEffect(() => {
    // 지도를 생성할 때 필요한 기본 옵션
    const container = document.getElementById('myMap'); // 지도를 담을 영역의 DOM 레퍼런스
    const options = {
      center: new kakao.maps.LatLng(36.35531199154453, 127.298467693343), // 지도의 중심좌표(필수):LatLng(위도_latitude, 경도, longitude)
      level: 3, // 지도의 레벨(확대, 축소 정도)
    };
    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

    // 현재 위치 받기(HTML5의 geolocation 사용할 수 있는지 확인)
    if (navigator.geolocation) {
      // GeoLocation을 이용해 접속 위치 받기
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const locPosition = new kakao.maps.LatLng(lat, lon);
        map.setCenter(locPosition);
      });
    } else {
      const locPosition = new kakao.maps.LatLng(
        36.35531199154453,
        127.298467693343,
      );
      alert('위치 정보 수집에 동의해주세요');
      map.setCenter(locPosition);
    }
  }, []);

  return (
    <>
      <h1>지도</h1>
      <Map id="myMap" />
    </>
  );
}

export default KakaoMap;
