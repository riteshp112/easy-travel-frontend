import React from 'react';
import {Button} from '../../components/Button';
import {Modal} from '@mui/material';
import PlanTripForm from '../../components/Form/PlanTripForm';

export const ListMenu = ({
  show,
  onSelect,
  selected = 0,
  userItinaries = [],
  onRefresh,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = async () => {
    setOpen(false);
    onRefresh && await onRefresh();
  };

  return (
    <div
      style={{
        gap: 4,
        flex: 1,
        display: show ? 'flex' : 'none',
        flexDirection: 'column',
      }}>
      <div style={{padding: 10}}>
        <Button title={'Plan new Trip'} onClick={handleOpen} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <PlanTripForm handleClose={handleClose} newChat />
        </Modal>
      </div>
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
    </div>
  );
};
