import ResponsiveMapNavbar from '../components/common/navbar/ResponsiveMapNavbar';
import ResponseiveSideSheet from '../components/map/SideSheet/ResponseiveSideSheet';
import KakaoMap from '../components/map/KakaoMap';

function Map() {
  return (
    <>
      <ResponsiveMapNavbar />
      <ResponseiveSideSheet />
      <KakaoMap />
    </>
  );
}

export default Map;
