import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import { useDeleteVehicleImageMutation } from "../redux/api/vehicles";
import { useCallback } from "react";

export default function ImageCard({ image, vehicleId, emitImageId }) {
  const [deleteImage] = useDeleteVehicleImageMutation();

  const handleDelete = useCallback(async () => {
    await deleteImage({ vehicleId, imageId: image._id });
    emitImageId(image._id);
  }, [deleteImage, emitImageId, image._id, vehicleId]);

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/vehicle/file/${image.key}`}
          alt="green iguana"
        />
      </CardActionArea>
      <CardActions>
        <Button size="small" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
