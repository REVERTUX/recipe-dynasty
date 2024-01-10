/* eslint-disable @next/next/no-img-element */
'use client';

import { type ChangeEvent, useState, useRef } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';

import { useUploadThing } from '@/utils/uploadthing';
import { cropImage } from '@/utils/cropImage';

import 'react-image-crop/dist/ReactCrop.css';

const acceptedFiletypes = ['image/jpeg', 'image/jpg', 'image/png'];

function ImageForm() {
  const [crop, setCrop] = useState<Crop>({
    width: 100,
    height: 50,
    unit: '%',
    x: 0,
    y: 50,
  });
  const [storedCrop, setStoredCrop] = useState<PixelCrop>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);
  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete(res) {
      setImageUrl(res?.[0]?.url);
      setIsModalOpen(false);
    },
  });

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files.length > 0 && files[0]) {
      const file = files[0];

      if (acceptedFiletypes.includes(file.type)) {
        const reader = new FileReader();
        setIsModalOpen(true);
        reader.addEventListener('load', () => {
          setImageName(file.name);
          setImageSrc(reader.result?.toString() ?? '');
        });
        reader.readAsDataURL(file);
      } else {
        // TODO handle unsupported file
      }
    }
  };

  const handleImageUpload = async () => {
    if (!imageRef.current || !storedCrop) return;
    const canvas = cropImage(imageRef.current, storedCrop);

    const blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob((blob) => {
        blob ? res(blob) : rej('No blob');
      });
    });

    const file = new File([blob], imageName, {
      type: 'image/jpg',
    });

    await startUpload([file]);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <input type="text" name="imageUrl" value={imageUrl} hidden />
      <label
        htmlFor="dropzone-file"
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          {!imageUrl ? (
            <>
              <svg
                className="mb-4 h-8 w-8 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">PNG or JPG File</p>
            </>
          ) : (
            <div>
              <span className="font-semibold">Image uploaded: {imageName}</span>
            </div>
          )}
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={acceptedFiletypes.join(', ')}
          onChange={handleImageChange}
        />
      </label>
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Resize Image</ModalHeader>
        <ModalBody>
          {imageSrc ? (
            <ReactCrop
              aspect={16 / 9}
              keepSelection
              minHeight={100}
              minWidth={200}
              maxHeight={600}
              maxWidth={1000}
              crop={crop}
              onChange={(_, percent) => setCrop(percent)}
              onComplete={(c) => setStoredCrop(c)}
            >
              <img ref={imageRef} src={imageSrc} alt="Crop me" />
            </ReactCrop>
          ) : (
            <p>No image selected</p>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end gap-1">
          <Button
            color="gray"
            onClick={() => setIsModalOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button onClick={handleImageUpload} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ImageForm;
