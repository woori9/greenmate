import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import styled, { keyframes } from 'styled-components';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useLocation } from 'react-router-dom';
import {
  searchResultsAtom,
  pageStatusAtom,
  summaryRestauAtom,
  detailRestauAtom,
} from '../atoms/map';
import mapPinImg from '../assets/map-pin.png';
import ResponsiveSideSheet from '../components/map/SideSheet/ResponsiveSideSheet';
import ResponsiveMapNavbar from '../components/common/navbar/ResponsiveMapNavbar';
import {
  apiGetAllRestau,
  apiGetSearchRestau,
  apiGetSummaryRestau,
  apiGetDetailRestau,
} from '../api/map';
import useWindowDimensions from '../utils/windowDimension';

const { kakao } = window;
const MapContainer = styled.div`
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
  cursor: pointer;
`;
const bouncing = keyframes`
  0% { bottom: 0 }
  50% { bottom: 15px }
  100% { bottom: 0 }
`;
const LoadingContainer = styled.div`
  height: 100vh;
  width: 100vw;
  .img-box {
    height: calc(100vh - 62px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-background {
    background-color: white;
    border-radius: 50%;
    width: 7rem;
    height: 7rem;
    filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
    img {
      position: relative;
      width: 7rem;
      animation: ${bouncing} 0.8s linear infinite;
    }
  }
`;

function Map() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setNewSearchResult] = useAtom(searchResultsAtom);
  const [, setPageStatus] = useAtom(pageStatusAtom);
  const [, setSummaryRestau] = useAtom(summaryRestauAtom);
  const [, setDetailRestau] = useAtom(detailRestauAtom);
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const location = useLocation();
  let selectedRestau;

  const getMapwithCommand = async (command, inputValue) => {
    setIsLoading(true);
    const container = document.getElementById('myMap'); // 지도를 담을 영역의 DOM 레퍼런스
    const options = {
      center: new kakao.maps.LatLng(37.4989043009984, 127.0321282915444), // 지도의 중심좌표(필수):LatLng(위도_latitude, 경도, longitude)
      level: 3, // 지도의 레벨(확대, 축소 정도)
    };
    const mapContainer = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

    if (command === 'setSummaryRestau') {
      const summaryRestau = await apiGetSummaryRestau({ restauId: inputValue }); // 식당 기본 정보 불러오기
      setSummaryRestau(summaryRestau);
      // const moveLatLon = new kakao.maps.LatLng(
      //   summaryRestau.latitude,
      //   summaryRestau.longitude,
      // );
      // mapContainer.panTo(moveLatLon);
      setPageStatus('summary');
    } else if (command === 'setDetailRestau') {
      const deatilRestau = await apiGetDetailRestau({ restauId: inputValue }); // 식당 상세 정보 불러오기
      setDetailRestau(deatilRestau);
      // const moveLatLon = new kakao.maps.LatLng(
      //   deatilRestau.latitude,
      //   deatilRestau.longitude,
      // );
      // mapContainer.panTo(moveLatLon);
      setPageStatus('detail');
    }

    const restauLst = await apiGetAllRestau(); // DB 식당 전체 불러오기
    const imgSrc = mapPinImg;
    const imgSize = new kakao.maps.Size(80, 80);
    const imgOption = { offset: new kakao.maps.Point(27, 69) };
    for (let i = 0; i < restauLst.length; i += 1) {
      const markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption);
      const latLng = new kakao.maps.LatLng(
        restauLst[i].latitude,
        restauLst[i].longitude,
      );
      const marker = new kakao.maps.Marker({
        map: mapContainer,
        position: latLng,
        title: restauLst[i].title,
        image: markerImg,
      });
      // 클릭이벤트
      kakao.maps.event.addListener(marker, 'click', async function () {
        setNewSearchResult([]);
        if (isDesktop) {
          const deatilRestau = await apiGetDetailRestau({
            restauId: restauLst[i].id,
          }); // 식당 상세 정보 불러오기
          setDetailRestau(deatilRestau);
          const moveLatLon = new kakao.maps.LatLng(
            restauLst[i].latitude,
            restauLst[i].longitude,
          );
          mapContainer.panTo(moveLatLon);
          setPageStatus('detail');
        } else {
          const summaryRestau = await apiGetSummaryRestau({
            restauId: restauLst[i].id,
          }); // 식당 기본 정보 불러오기
          setSummaryRestau(summaryRestau);
          const moveLatLon = new kakao.maps.LatLng(
            restauLst[i].latitude,
            restauLst[i].longitude,
          );
          mapContainer.panTo(moveLatLon);
          setPageStatus('summary');
        }
      });
    }
    if (command === 'setCurrentPosition') {
      if (navigator.geolocation) {
        // GeoLocation을 이용해 접속 위치 받기
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new kakao.maps.LatLng(lat, lon);
          mapContainer.panTo(locPosition);
          setIsLoading(false);
        });
      } else {
        alert('위치 정보 수집에 동의해주세요');
      }
    } else if (command === 'setSearchRestau') {
      const searchRestauLst = await apiGetSearchRestau({ keyword: inputValue }); // 검색 결과 불러오기
      if (searchRestauLst.length) {
        setNewSearchResult(searchRestauLst);
        console.log(searchRestauLst.length);
        // const moveLatLon = new kakao.maps.LatLng(
        //   searchRestauLst[0].latitude,
        //   searchRestauLst[0].longitude,
        // );
        // mapContainer.panTo(moveLatLon);
        setIsLoading(false);
        setPageStatus('searchLst');
      } else {
        const placesSearchCB = (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가
            const bounds = new kakao.maps.LatLngBounds();
            for (let i = 0; i < data.length; i += 1) {
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            mapContainer.setBounds(bounds);
          }
        };
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(inputValue, placesSearchCB);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMapwithCommand();
    setPageStatus('searchBox');
    if (location.state) {
      const {
        selectedRestauName,
        selectedRestauId,
        selectedRestauLat,
        selectedRestauLong,
      } = location.state;
      selectedRestau = {
        selectedRestauName,
        selectedRestauId,
        selectedRestauLat,
        selectedRestauLong,
      };
      if (isDesktop) {
        getMapwithCommand('setDetailRestau', selectedRestau.selectedRestauId);
      } else {
        getMapwithCommand('setSummaryRestau', selectedRestau.selectedRestauId);
      }
    }
  }, []);
  return (
    <>
      <ResponsiveMapNavbar />
      <ResponsiveSideSheet getMapwithCommand={getMapwithCommand} />
      <MapContainer id="myMap" isLoading={isLoading} />
      {isLoading ? (
        <LoadingContainer>
          <div className="img-box">
            <div className="img-background">
              <img delay="0s" src={mapPinImg} alt="pin-img" />
            </div>
          </div>
        </LoadingContainer>
      ) : (
        <BoxMyLocationIcon
          onClick={() => {
            getMapwithCommand('setCurrentPosition');
          }}
        >
          <MyLocationIcon />
        </BoxMyLocationIcon>
      )}
    </>
  );
}

export default Map;
