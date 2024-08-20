import { observer } from "mobx-react-lite";
import { Header, Container, Button, Progress } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "@/stores/store";
import PhotoUploadWidgetDropzone from "@/components/common/imageUpload/PhotoWidgetDropzone";
import PhotoWidgetCropper from "@/components/common/imageUpload/PhotoWidgetCropper";

export default observer(function AddPhotoForm() {
  const {
    memberStore: {
      uploadPhoto,
      loading,
    },
  } = useStore();

  const [percent, setPercent] = useState(25);
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      setPercent(100);
      cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Container>
     <Progress percent={percent} indicating />

      {percent === 25 && (
        <>
          <Header
            as="h2"
            content="Select photo..."
            color="teal"
            textAlign="center"
          />
          <PhotoUploadWidgetDropzone
            setFiles={setFiles}
            setPercent={setPercent}
          />
        </>
      )}
      {percent === 50 && (
        <>
          <Header as="h2" content="Crop" color="teal" textAlign="center" />
          {files && files.length > 0 && (
            <PhotoWidgetCropper
              setCropper={setCropper}
              imagePreview={files[0].preview}
            />
          )}
           <Button floated="right" onClick={() => setPercent(75)}>
            Next
          </Button>
        </>
      )}
      {percent >= 50 && (
        <>
          {percent === 75 && <Header
            as="h2"
            content="Preview & Upload"
            color="teal"
            textAlign="center"
          />}
          <div
            className="img-preview"
            style={{ minHeight: 200, overflow: "hidden", visibility: percent > 50 ? "visible" : "hidden" }}
          />
          {percent === 75 &&files && files.length > 0 && (
            <>
              <Button
                  disabled={loading}
                  onClick={() => setPercent(50)}
                >previous</Button>

                <Button
                  loading={loading}
                  onClick={onCrop}
                  positive
                  icon="check"
                />
            </>
          )}
        </>
      )}
    </Container>
  );
});
