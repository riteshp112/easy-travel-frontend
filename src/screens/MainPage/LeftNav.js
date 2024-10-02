import React, {useContext} from 'react';
import {Button} from '../../components/Button';
import {MenuItem, Modal, Select} from '@mui/material';
import PlanTripForm from '../../components/Form/PlanTripForm';
import {ScreenSizeContext} from '../../context/ScreenSizeProvider';

export const ListMenu = ({
  show,
  onSelect,
  selected = 0,
  userItinaries = [],
  onRefresh,
  view,
  setView,
}) => {
  const [open, setOpen] = React.useState(false);
  const {isMobile} = useContext(ScreenSizeContext);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = async () => {
    setOpen(false);
    onRefresh && (await onRefresh());
  };
  return (
    <div
      style={{
        gap: 4,
        flex: isMobile ? void 0 : 1,
        display: show ? 'flex' : 'none',
        flexDirection: isMobile ? 'row' : 'column',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: isMobile ? 48 : void 0,
        padding: 10,
        flexWrap: isMobile ? 'wrap' : void 0,
      }}>
      <div
        style={{
          padding:10,
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
        }}>
        <Button title={'Plan new Trip'} onClick={handleOpen} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <PlanTripForm handleClose={handleClose} newChat />
        </Modal>
      </div>
      {isMobile ? (
        <>
          <Select
            style={{
              display: 'flex',
              flex: 1,
              maxWidth: 150,
              padding: 10,
              height: 48,
            }}
            value={selected}
            label="Itinerary"
            onChange={e => {
              const {value} = e.target;
              onSelect({index: value, itnaryId: userItinaries?.[value]?._id});
            }}>
            {userItinaries?.map((doc, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {doc.destination}
                </MenuItem>
              );
            })}
          </Select>
          <Select
            style={{
              display: 'flex',
              flex: 1,
              maxWidth: 100,
              padding: 10,
              height: 48,
            }}
            value={view}
            label="View"
            onChange={e => {
              setView(e.target.value);
            }}>
            <MenuItem value={'list'}>List</MenuItem>
            <MenuItem value={'map'}>Map</MenuItem>
          </Select>
        </>
      ) : (
        <div
          style={{
            marginTop: 20,
            overflow: 'hidden',
            height: '80vh',
            overflowY: 'scroll',
          }}>
          {userItinaries?.map((doc, index) => {
            return (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  padding: 15,
                  borderRadius: 10,
                  borderStyle: 'solid',
                  borderColor: '#c0c0c0',
                  borderWidth: 2,
                  margin: 10,
                  backgroundColor: selected === index ? 'black' : 'white',
                  color: selected === index ? 'white' : 'black',
                }}
                onClick={() => {
                  onSelect({
                    index,
                    itnaryId: doc._id,
                  });
                }}>
                {doc.destination}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
