import React, {useEffect} from 'react';
import {ListMenu} from './MainPage/LeftNav';
import Itinary from './MainPage/Itinary';
import {Direction} from '../components/map/Map';
import {useNavigate, useParams} from 'react-router-dom';
import HttpAuth from '../services/HttpAuthService';
import {showError} from '../hooks/showError';

import fakeData from './MainPage/data.json';

const sideNavBarItem = [
  {label: 'Home'},
  {label: 'About'},
  {label: 'Contact'},
  {label: 'Services'},
  {label: 'Blogs'},
];

const parseData = (data = {}) => {
  console.log(
    '🚀 ~ file: MainPage.js:30 ~ parseData ~ data:',
    JSON.stringify(data),
  );
  const obj = {};

  const budgetObj = {
    Economy: '5000',
    Mid: '15000',
    Luxury: '20000',
  };

  obj.destination = 'Delhi';
  obj.budget = budgetObj[data?.budget] || '30000';
  obj.interests = Object.keys(data.activities);
  obj.checkinDate = data.when?.from;
  obj.checkoutDate = data.when?.to;

  obj.members = {
    adults: '2',
    kids: '1',
  };

  return obj;
};

const MainPage = props => {
  const {params} = props;
  console.log('>>> params', params, props);
  const parsedParams = parseData(params);
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await HttpAuth.post(
          '/v1/itinerary/generate',
          parsedParams,
        );
        console.log('>>> response', response);
        setData(response);
        setLoading(false);
      } catch (err) {
        showError(err);
        navigate('/welcome');
      }
    };
    getData();
  }, []);

  return loading ? (
    <text>Loading...</text>
  ) : (
    <div style={{flexDirection: 'row', flex: 1, display: 'flex'}}>
      <ListMenu data={sideNavBarItem} />
      <Itinary data={fakeData} />
      <Direction
        data={data}
        style={{
          flex: 3,
          position: 'relative' /* Set position to relative */,
        }}
      />
    </div>
  );
};

export default MainPage;
