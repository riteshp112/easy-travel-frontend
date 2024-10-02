import React, {useContext, useEffect, useState} from 'react';
import {ListMenu} from './MainPage/LeftNav';
import Itinary from './MainPage/Itinary';
import {Direction} from '../components/map/Map';
import HttpAuth from '../services/HttpAuthService';
import Chatbot from '../modules/chatbot/chatbot';
import {FaAnglesRight} from 'react-icons/fa6';
import {Modal} from '@mui/material';
import {LoadingScreen} from './LoadingScreen';
import {ScreenSizeContext} from '../context/ScreenSizeProvider';

const MainPage = () => {
  const [show, updateShow] = useState(true);
  const [leftIndex, updateLeftIndex] = useState(0);
  const [iteneries, updateItineraries] = useState([]);
  const [data, updateData] = useState({});
  const [loading, updateLoading] = useState(true);
  const onIntenerySelect = async ({index, itnaryId}) => {
    updateLoading(true);
    updateLeftIndex(index);
    const data = await HttpAuth.get(`/v1/itinerary/${itnaryId}`);
    updateData(data);
    updateLoading(false);
  };

  const getIteneraries = async () => {
    updateLoading(true);
    const {itineraries = []} = await HttpAuth.get('/v1/itinerary');
    const reversedIteneraries = itineraries.reverse();
    updateItineraries(reversedIteneraries);
    onIntenerySelect({index: 0, itnaryId: reversedIteneraries?.[0]?._id});
    updateLoading(false);
  };

  useEffect(() => {
    getIteneraries();
  }, []);

  const {isMobile} = useContext(ScreenSizeContext);
  const [view, setView] = React.useState('list');

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        backgroundColor: '#ffffff',
        overflow: isMobile ? 'auto' : 'hidden',
      }}>
      <ListMenu
        show={show}
        selected={leftIndex}
        userItinaries={iteneries}
        onSelect={onIntenerySelect}
        onRefresh={getIteneraries}
        view={view}
        setView={setView}
      />
      {!isMobile && <div
        style={{
          color: 'white',
          height: 30,
          width: 30,
          display: 'flex',
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
          marginLeft: -15,
          marginRight: -15,
          marginTop: 20,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: show ? '' : 'rotate(-180deg)',
          zIndex: 1,
        }}
        onClick={() => {
          updateShow(prev => !prev);
        }}>
        <FaAnglesRight />
      </div>}
      {(!isMobile || view == 'list') && <Itinary data={data} />}
      {(!isMobile || view == 'map') && <Direction data={data} show={show} />}
      <Chatbot />
      <Modal open={loading}>
        <LoadingScreen />
      </Modal>
    </div>
  );
};

export default MainPage;
