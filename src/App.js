import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import apiUrlMapping from './Resources/apiUrlMapping.json'
import './App.css'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const friendsTable = [
  {
    field: 'firstname',
    headerName: 'First Name',
    width : 228
  },
  {
    field: 'lastname',
    headerName: 'Last Name',
    width : 228
  },
  {
    field: 'emailid',
    headerName: 'Email Id',
    width : 228
  },
  {
    field: 'city',
    headerName: 'City',
    width : 228
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width : 228
  },
]

const geRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}

export default function App() {

  const { loading } = useDemoData({ editable: true });
  const [open, setOpen] 			  = React.useState(false);
  const [firstName, setFirstName] 	= React.useState("");
  const [city, setCity] 			  = React.useState("");
  const [lastName, setLastName] 	= React.useState("");
  const [email, setEmail] 			= React.useState("");
  const [phone, setPhone] 			= React.useState("");
  const [rows, setRows] = React.useState([])


  const handleClickOpen = () => {setOpen(true);};

  const handleClose = () => {setOpen(false);};

  const addRecordAndClose = () => 
  {
    if (firstName !== undefined && city !== undefined && lastName !== undefined && email !== undefined && phone !== undefined)
	{
      let payload = 
	  {
        "firstname": firstName,
        "lastname": lastName,
        "emailid": email,
        "city": city,
        "phone": phone
      }
      axios.post(apiUrlMapping.friends.post, payload).then(response => 
	  {
	  getAllRecords()
        handleClose()
        setFirstName("")
        setCity("")
        setLastName("")
        setEmail("")
        setPhone("")
      })
    }
  }

  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.friends.getAll).then(response =>
	{
    setRows(geRowsWithId(response.data))
    });
  }

  useEffect(() => {getAllRecords()}, []);
  

  return (
    <div className='tabularcomponents-centered'>
      <div className="text-alligned">
        <h1>Friends List</h1>
      </div>

      <div style={{ height: "50vh", width: "100%" }}>
        <DataGrid
          rows = {rows}
          columns = {friendsTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
        <div className="center" >
          <Button variant="contained" onClick={handleClickOpen}>Add Record</Button>
        </div>
      </div>
	  
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Friends Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="firstname"  onChange={(e) => { setFirstName(e.target.value) }}value={firstName}label="First Name"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="lastname" onChange={(e) => { setLastName(e.target.value) }}value={lastName} label="Last Name" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="email" onChange={(e) => { setEmail(e.target.value) }} value={email} label="Email Id" type="email" fullWidth/>
          <TextField autoFocus margin="dense" id="city" onChange={(e) => { setCity(e.target.value) }} value={city} label="City" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="ph" onChange={(e) => { setPhone(e.target.value) }} value={phone} label="Phone" type="text" fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addRecordAndClose() }}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}