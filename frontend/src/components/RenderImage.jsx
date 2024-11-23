import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';

const RenderImage = ({ src }) => {

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pt: 1,
      }}
    >
      <Avatar
        imgProps={{
          sx: {
            objectFit: 'contain',
            width: '50px',
            height: '50px',
          },
        }}
        src={`http://localhost:3001/vehicle/file/${src}`}
      />
    </Box>
  );
};

export default RenderImage;
