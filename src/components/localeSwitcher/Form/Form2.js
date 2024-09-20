import React, {useContext, useEffect, useState} from 'react';

import {Box, Flex, Text} from '@radix-ui/themes';
import {IoIosClose} from 'react-icons/io';

import './form.css';
import BasicDateRangeCalendar from './DateCalendar';
import Slider from '../../Slider/Slider';
import {
  ActivitiesArray,
  BudgetArray,
  ContinentArray,
  NumberOfPeople,
} from './Constants';
import {Button} from '../../Button';
import DatePickerComponent, {arrangeDates} from '../Date/DatePicker';

import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {AuthContext} from '../../../context/auth/AuthContext';
import {AiContext} from '../../../context/AiContext';
import Map from './Map';

const PlaceCard = ({title, imagePath, selectedValues, onClick}) => {
  let className = 'place-image';

  if (selectedValues && Object.keys(selectedValues).includes(title)) {
    className += ' active';
  }

  return (
    <div key={title} className="image-card" onClick={onClick}>
      <div className={className}>
        <img src={imagePath} height={100} width={100} />
      </div>
      <div>{title}</div>
    </div>
  );
};

export const Search = ({value, onChange, ...props}) => {
  return <TextField.Root value={value} onChange={onChange} {...props} />;
};

let access_token =
  'pk.eyJ1Ijoic3ppbGFyZG1hdGUiLCJhIjoiY2xycXRqNjA4MDd1MDJrcWx0amRoYXp6ZyJ9.JoEWVmK7_7O4hhWySeP_Ag';

const City = ({countryCode, updateFormState, formState}) => {
  const [place, updatePlace] = useState([]);
  const [text, updateText] = useState();

  useEffect(() => {
    axios
      .get(`https://api.mapbox.com/search/geocode/v6/forward`, {
        params: {
          q: text,
          access_token,
          limit: 10,
          country: countryCode,
          types: ['place', 'locality'],
        },
      })
      .then(response => {
        console.log('🚀 ~ file: Form.js:71 ~ useEffect ~ response:', response);

        const {features} = response.data;
        console.log('🚀 ~ file: Form.js:68 ~ useEffect ~ features:', features);
        updatePlace(
          features.map(doc => {
            return `${doc.properties.full_address}`;
          }),
        );
      })
      .catch(error => {
        console.error('Error fetching autocomplete suggestions:', error);
      });
  }, [text]);

  return (
    <Autocomplete
      onSelect={({target}) => {
        console.log('🚀 ~ file: Form2.js:85 ~ City ~ props:', target.value);
        updateText(target.value);
        formState['place'] = target.value;
        updateFormState(formState);
      }}
      autoHighlight
      //   disablePortal
      options={place}
      sx={{width: 300}}
      renderInput={params => (
        <TextField
          onChange={({target}) => {
            updateText(target.value);
            formState['place'] = target.value;
            updateFormState(formState);
          }}
          {...params}
          label="Place name"
        />
      )}
    />
  );
};

const Place = ({formState, updateFormState}) => {
  const value = 'where';
  return (
    <div>
      <div style={{display: 'flex', padding: 10, justifyContent: 'center'}}>
        Where would you like to go ?
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Map />
      </div>
      {formState[value] && (
        <City
          countryCode={Object.values(formState[value])[0].code}
          updateFormState={updateFormState}
          formState={formState}
        />
      )}
    </div>
  );
};

const Date = ({formState, updateFormState, showErrorMessage}) => {
  const value = 'when';

  const [{formattedDateRange, diffDays}, updateDateDiff] = useState({});
  const [date, updatedate] = useState();
  const calculateDifference = () => {
    if (formState[value]?.from && formState[value]?.to) {
      const start = moment(formState[value]?.from);
      const end = moment(formState[value]?.to);
      const current = moment();
      if (start.isBefore(current) || end.isBefore(current)) {
        showErrorMessage('Both dates should be greater than the current date');
      }
      if (end.isBefore(start)) {
        showErrorMessage('From Date should be less then to date');
      } else if (current.isSameOrAfter(start)) {
        showErrorMessage(
          'From Date should be greater or equal to current date',
        );
      } else {
        const {formattedDateRange, diffDays} = arrangeDates(start, end);

        if (diffDays > 5) {
          showErrorMessage('To much holidays');
        } else {
          updateDateDiff({formattedDateRange, diffDays});
        }
        showErrorMessage('');
      }
    }
  };

  useEffect(() => {
    calculateDifference();
  }, [JSON.stringify(formState[value])]);

  return (
    <div className="who-container" style={{flexDirection: 'column'}}>
      {formState[value]?.from && formState[value]?.to && (
        <div style={{textAlign: 'center', margin: '10px'}}>
          <h2>When</h2>
          <p>{`${formattedDateRange} · ${diffDays} days`}</p>
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <DatePickerComponent
          value={formState[value]?.from}
          onChange={target => {
            updateFormState(formState => {
              if (!formState[value]) {
                formState[value] = {};
              }
              formState[value].from = target;
              return formState;
            });
            updatedate(target);
          }}
        />
        -
        <DatePickerComponent
          value={formState[value]?.to}
          onChange={target => {
            updateFormState(formState => {
              if (!formState[value]) {
                formState[value] = {};
              }
              formState[value].to = target;
              return formState;
            });
            updatedate(target);
          }}
        />
      </div>
    </div>
  );
};

const Card = ({Icon, title, additionalText, selectedValue, onClick, multi}) => {
  let className = 'people-box';

  if (multi) {
    if (selectedValue && Object.keys(selectedValue).includes(title)) {
      className += ' active';
    }
  } else if (title === selectedValue) {
    className += ' active';
  }

  return (
    <div className={className} key={title} onClick={onClick}>
      <Icon />
      {title}
      {additionalText}
    </div>
  );
};

const NumberOfPeopleGoing = ({formState, updateFormState}) => {
  const [_, updateState] = useState();
  const value = 'who';

  return (
    <div className={'who-container'}>
      {NumberOfPeople.map(({title, icon}) => {
        const Icon = icon;
        return (
          <Card
            key={title}
            Icon={Icon}
            title={title}
            selectedValue={formState[value]}
            onClick={() => {
              updateFormState(formState => {
                formState[value] = title;
                updateState(title);
                return formState;
              });
            }}
          />
        );
      })}
    </div>
  );
};

const BudgetRange = ({formState, updateFormState}) => {
  const [_, updateState] = useState();
  const value = 'budget';

  return (
    <div className={'who-container'}>
      {BudgetArray.map(({title, icon, additionalText}) => {
        const Icon = icon;
        const who = formState[value];
        return (
          <Card
            key={title}
            Icon={Icon}
            title={title}
            selectedValue={who}
            onClick={() => {
              updateFormState(formState => {
                formState[value] = title;
                updateState(title);
                return formState;
              });
            }}
            additionalText={additionalText}
          />
        );
      })}
    </div>
  );
};
const ActivitiesYouWant = ({formState, updateFormState}) => {
  const [state, updateState] = useState();
  const value = 'activities';

  useEffect(() => {
    updateState(formState[value]);
  }, [state]);

  return (
    <div className={'who-container'}>
      {ActivitiesArray.map(({title, icon}) => {
        const Icon = icon;
        const who = formState[value];
        return (
          <Card
            key={title}
            Icon={Icon}
            title={title}
            selectedValue={who}
            multi
            onClick={() => {
              updateFormState(formState => {
                if (!formState[value]) {
                  formState[value] = {};
                  formState[value][title] = 1;
                } else if (formState[value][title]) {
                  delete formState[value][title];
                } else {
                  formState[value][title] = 1;
                }
                updateState(title);
                return formState;
              });
            }}
          />
        );
      })}
    </div>
  );
};

const ComponentIndex = [
  Place,
  Date,
  NumberOfPeopleGoing,
  BudgetRange,
  ActivitiesYouWant,
];

const ShowMagic = ({formState, navigate, newChat}) => {
  // if (newChat) {
  //   navigate('/itineraries-1', {state: formState});
  // } else {
  navigate('/itineraries', {state: formState});
  // }
};

const PlanTripForm = props => {
  const {handleClose, newChat} = props;
  const [sliderCount, updateSliderCount] = useState(0);
  const [formState, updateFormState] = useState({
    data: {},
  });
  const Component = ComponentIndex[sliderCount];
  const navigate = useNavigate();

  const {updateAiData} = useContext(AiContext);

  const showErrorMessage = errorMessage => {
    updateFormState(doc => {
      return {...doc, errorMessage};
    });
  };

  const updateData = updatedData => {
    console.log(
      '🚀 ~ file: Form2.js:384 ~ updateFormState ~ data:',
      updatedData,
    );
    updateFormState(({data, errorMessage}) => {
      return {
        data: {
          ...data,
          ...updatedData,
        },
        errorMessage,
      };
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div
        style={{
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '50px',
          height: '70vh',
          width: '60vw',
          borderRadius: '10px',
          boxShadow: '6px 6px 10px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          position: 'relative',
        }}>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: 10,
            right: 10,
            height: 20,
            width: 20,
            backgroundColor: '#c0c0c0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onClick={() => {
            handleClose();
          }}>
          <IoIosClose />
        </div>
        <div
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Text
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: 20,
            }}>
            Plan Your Next Trip
          </Text>
          <Slider
            totalSteps={ComponentIndex.length}
            currentStep={sliderCount}
            updateSliderCount={updateSliderCount}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              marginTop: 10,
            }}>
            <Component
              formState={formState.data}
              updateFormState={updateData}
              showErrorMessage={showErrorMessage}
            />
          </div>

          <div
            style={{
              margin: '0 10px 0 10px',
              position: 'absolute',
              width: '100%',
              bottom: '10px',
            }}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                color: 'tomato',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              {formState.errorMessage}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',

                gap: 40,
              }}>
              {sliderCount > 0 && (
                <Button
                  onClick={() => {
                    updateSliderCount(count => {
                      return count - 1;
                    });
                  }}
                  title="Back"
                />
              )}
              {sliderCount < ComponentIndex.length - 1 && (
                <Button
                  disable={formState.errorMessage}
                  onClick={() => {
                    updateSliderCount(count => {
                      return count + 1;
                    });
                  }}
                  title="Next"
                />
              )}

              {sliderCount === ComponentIndex.length - 1 && (
                <Button
                  title="Lets Generate"
                  onClick={() => {
                    ShowMagic({formState, navigate});
                    updateAiData(formState);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTripForm;
