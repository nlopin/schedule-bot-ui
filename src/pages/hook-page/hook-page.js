import React, { forwardRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import { HooksContext } from '../../App';

const useStyles = makeStyles(theme => ({
  table: {
    width: "90%",
    marginLeft: "5%",
    marginTop: "2%"
  }
}));

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function HookPage() {
  const classes = useStyles();

  const columns = [
    { title: 'Значение', field: 'value' },
    { title: 'Канал', field: 'channel' },
    { title: 'Группа', field: 'group' },
    { title: 'ID Канала/Чата', field: 'channelId' },
    { title: 'Способ общения', field: 'messegerType' }
  ];

  return (
    <div className={classes.table}>
      <HooksContext.Consumer>
        {data => 
          <MaterialTable
          title="Хуки"
          icons={tableIcons}
          columns={columns}
          data={data.hooks}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                fetch('/hooks/add', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newData)
                })
                .then(response => response.json())
                .then(result => {
                  debugger;
                  data.updateHooks(result.hooks);
                  resolve(result.hooks);
                });
              }),
            onRowUpdate: (newData, oldData) =>
            {
              const body = {
                oldValue: oldData.value,
                ...newData
              }
              return new Promise(resolve => {
                fetch('/hooks/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body)
                })
                .then(response => response.json())
                .then(result => {
                  data.updateHooks(result.hooks);
                  resolve(result.hooks);
                });
              })
            },
            onRowDelete: oldData =>
            new Promise(resolve => {
              fetch('/hooks/remove', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: `{"value" : "${oldData.value}"}`
              })
              .then(response => response.json())
              .then(result => {
                data.updateHooks(result.hooks);
                resolve(result.hooks);
              });
            })
            }}
          />
        }
      </HooksContext.Consumer>
    </div>
  );
}

export default HookPage;
