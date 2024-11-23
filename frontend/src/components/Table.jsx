import { DataGrid } from '@mui/x-data-grid';

export default function Table({ columns, rows, loading }) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
      loading={
        loading
      }
        getRowId={(row) => row._id}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
        }}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}
