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
  isOpendesktopSideBarAtom,
} from '../atoms/map';
import mapPinImg from '../assets/map-pin.png';
import mapPinImg2 from '../assets/map-pin2.png';
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
  const [, setDesktopSideBar] = useAtom(isOpendesktopSideBarAtom);
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const location = useLocation();
  let selectedRestau;

  const getMapwithCommand = async (command, inputValue) => {
    setIsLoading(true);
    const container = document.getElementById('myMap'); // ????????? ?????? ????????? DOM ????????????
    const options = {
      center: new kakao.maps.LatLng(37.4989043009984, 127.0321282915444), // ????????? ????????????(??????):LatLng(??????_latitude, ??????, longitude)
      level: 3, // ????????? ??????(??????, ?????? ??????)
    };
    const mapContainer = new kakao.maps.Map(container, options); // ?????? ?????? ??? ?????? ??????

    const imgSrc = mapPinImg;
    const imgSize = new kakao.maps.Size(80, 80);
    const imgOption = { offset: new kakao.maps.Point(27, 69) };
    const imgSrc2 = mapPinImg2;
    const overlayContent = `<img src=${imgSrc2} alt="img" style="width: 120px;" />`;

    if (command === 'setSummaryRestau') {
      const summaryRestau = await apiGetSummaryRestau({ restauId: inputValue }); // ?????? ?????? ?????? ????????????
      setSummaryRestau(summaryRestau);
      const moveLatLon = new kakao.maps.LatLng(
        summaryRestau.latitude,
        summaryRestau.longitude,
      );
      mapContainer.panTo(moveLatLon);
      setPageStatus('summary');
    } else if (command === 'setDetailRestau') {
      const deatilRestau = await apiGetDetailRestau({ restauId: inputValue }); // ?????? ?????? ?????? ????????????
      setDetailRestau(deatilRestau);
      const moveLatLon = new kakao.maps.LatLng(
        deatilRestau.latitude,
        deatilRestau.longitude,
      );
      mapContainer.panTo(moveLatLon);
      setPageStatus('detail');
      setDesktopSideBar(true);
    }
    const restauLst = await apiGetAllRestau(); // DB ?????? ?????? ????????????
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
      if (inputValue && inputValue === restauLst[i].id) {
        // ???????????? ??????
        const setOverlayContent = new kakao.maps.CustomOverlay({
          position: latLng,
          content: overlayContent,
          xAnchor: 0.37,
          yAnchor: 0.76,
          zIndex: 3,
        });
        setOverlayContent.setMap(mapContainer);
        marker.setVisible(false);
        // ????????? ???????????? ???????????? ?????????
        kakao.maps.event.addListener(mapContainer, 'dragstart', function () {
          setOverlayContent.setVisible(false);
          marker.setVisible(true);
        });
      }
      // ????????? ????????? 1: mouseover
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        const setBigMarkerImg = new kakao.maps.MarkerImage(
          imgSrc,
          new kakao.maps.Size(100, 100),
          new kakao.maps.Point(40, 100),
        );
        marker.setImage(setBigMarkerImg);
      });
      // ????????? ????????? 2: mouseout
      kakao.maps.event.addListener(marker, 'mouseout', function () {
        const setDefaultMarkerImg = new kakao.maps.MarkerImage(
          imgSrc,
          new kakao.maps.Size(80, 80),
          new kakao.maps.Point(27, 69),
        );
        marker.setImage(setDefaultMarkerImg);
      });
      // ????????? ????????? 3: click
      kakao.maps.event.addListener(marker, 'click', async function () {
        setNewSearchResult([]);
        if (isDesktop) {
          const deatilRestau = await apiGetDetailRestau({
            restauId: restauLst[i].id,
          }); // ?????? ?????? ?????? ????????????
          setDetailRestau(deatilRestau);
          setDesktopSideBar(true);
          const moveLatLon = new kakao.maps.LatLng(
            restauLst[i].latitude,
            restauLst[i].longitude,
          );
          // ????????? ??????
          mapContainer.panTo(moveLatLon);
          // ???????????? ??????
          const setOverlayContent = new kakao.maps.CustomOverlay({
            position: moveLatLon,
            content: overlayContent,
            xAnchor: 0.37,
            yAnchor: 0.76,
            zIndex: 3,
          });
          setOverlayContent.setMap(mapContainer);
          marker.setVisible(false);
          // ????????? ???????????? ???????????? ?????????
          kakao.maps.event.addListener(mapContainer, 'dragstart', function () {
            setOverlayContent.setVisible(false);
            marker.setVisible(true);
          });
          // detail ????????? ??????
          setPageStatus('detail');
        } else {
          const summaryRestau = await apiGetSummaryRestau({
            restauId: restauLst[i].id,
          }); // ?????? ?????? ?????? ????????????
          setSummaryRestau(summaryRestau);
          const moveLatLon = new kakao.maps.LatLng(
            restauLst[i].latitude,
            restauLst[i].longitude,
          );
          mapContainer.panTo(moveLatLon);
          // ???????????? ??????
          const setOverlayContent = new kakao.maps.CustomOverlay({
            position: moveLatLon,
            content: overlayContent,
            xAnchor: 0.37,
            yAnchor: 0.76,
            zIndex: 3,
          });
          setOverlayContent.setMap(mapContainer);
          marker.setVisible(false);
          // ????????? ???????????? ???????????? ?????????
          kakao.maps.event.addListener(mapContainer, 'dragstart', function () {
            setOverlayContent.setVisible(false);
            marker.setVisible(true);
          });
          setPageStatus('summary');
        }
      });
    }
    if (command === 'setCurrentPosition') {
      if (navigator.geolocation) {
        // GeoLocation??? ????????? ?????? ?????? ??????
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new kakao.maps.LatLng(lat, lon);
          mapContainer.panTo(locPosition);
          setIsLoading(false);
        });
      } else {
        alert('?????? ?????? ????????? ??????????????????');
      }
    } else if (command === 'setSearchRestau') {
      const searchRestauLst = await apiGetSearchRestau({ keyword: inputValue }); // ?????? ?????? ????????????
      if (searchRestauLst.length) {
        setNewSearchResult(searchRestauLst);
        const moveLatLon = new kakao.maps.LatLng(
          searchRestauLst[0].latitude,
          searchRestauLst[0].longitude,
        );
        mapContainer.panTo(moveLatLon);
        setPageStatus('searchLst');
        setIsLoading(false);
      } else {
        const placesSearchCB = (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            // ????????? ?????? ????????? ???????????? ?????? ????????? ?????????????????????
            // LatLngBounds ????????? ????????? ??????
            const bounds = new kakao.maps.LatLngBounds();
            for (let i = 0; i < data.length; i += 1) {
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }
            // ????????? ?????? ????????? ???????????? ?????? ????????? ?????????
            mapContainer.setBounds(bounds);
            setIsLoading(false);
          }
        };
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(inputValue, placesSearchCB);
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
