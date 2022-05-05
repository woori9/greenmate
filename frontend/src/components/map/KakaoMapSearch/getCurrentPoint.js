const { kakao } = window;

export default function getCurrentPosition(map) {
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
  return null;
}
