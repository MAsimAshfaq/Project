import Dropzone from "dropzone";
import { useEffect } from "react";

import "dropzone/dist/dropzone.css";

const DropzoneArea = ({ type }) => {
  useEffect(() => {
    const myDropzone = new Dropzone(".dropzone", {
      url: "/target",
      maxFiles: type === "add" ? 1 : 10,
      acceptedFiles: "image/*",
      uploadMultiple: true,
      addRemoveLinks: true,
      autoProcessQueue: false,
      parallelChunkUploads: true,
      paramName: "custom_images",
      parallelUploads: 100,
    });

    myDropzone.on("addedfile", (file) => {
      setTimeout(() => {
        myDropzone.emit("complete", file);
      }, 500);
    });

    window.myDropzone = myDropzone;

    return () => {
      myDropzone.destroy();
    };
  }, [type]);

  return (
    <div>
      <div className="dropzone"></div>
    </div>
  );
};

export default DropzoneArea;
