/* eslint-disable @next/next/no-img-element */
'use client';

import { type ChangeEvent, useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import Image from 'next/image';
import { TbCloudUpload } from 'react-icons/tb';

import { useUploadThing } from '@/utils/uploadthing';
import { cropImage } from '@/utils/cropImage';

import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/app/locales/client';

const acceptedFiletypes = ['image/jpeg', 'image/jpg', 'image/png'];

interface ImageFormProps {
  url?: string;
}

function ImageForm({ url }: ImageFormProps) {
  const [crop, setCrop] = useState<Crop>({
    width: 100,
    height: 50,
    unit: '%',
    x: 0,
    y: 50,
  });
  const [storedCrop, setStoredCrop] = useState<PixelCrop>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(url);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete(res) {
      setImageUrl(res?.[0]?.url);
      setIsModalOpen(false);
    },
  });
  const t = useScopedI18n('recipe.uploadImage');

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files.length > 0 && files[0]) {
      const file = files[0];

      if (acceptedFiletypes.includes(file.type)) {
        const reader = new FileReader();
        handleModalToggle(true);
        reader.addEventListener('load', () => {
          setImageName(file.name);
          setImageSrc(reader.result?.toString() ?? '');
        });
        reader.readAsDataURL(file);
      } else {
        // TODO handle unsupported file
      }
      if (imageUploadRef.current) imageUploadRef.current.value = '';
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

  const handleModalToggle = (open: boolean) => {
    if (isUploading) return;
    setIsModalOpen(open);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <input type="text" name="imageUrl" value={imageUrl} hidden />
      <label
        htmlFor="dropzone-file"
        className="flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-background dark:hover:bg-slate-800"
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="uploaded"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <>
              <TbCloudUpload className="mb-4 h-10 w-10 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t('uploadClick')}</span>
              </p>
              <p className="text-xs text-gray-500">{t('files')}</p>
            </>
          )}
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          ref={imageUploadRef}
          accept={acceptedFiletypes.join(', ')}
          onChange={handleImageChange}
        />
      </label>
      <Dialog open={isModalOpen} onOpenChange={handleModalToggle}>
        <DialogContent>
          <DialogTitle>{t('resize')}</DialogTitle>
          <DialogDescription>
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
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => handleModalToggle(false)}
              disabled={isUploading}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleImageUpload} disabled={isUploading}>
              {isUploading ? `${t('uploading')}...` : t('upload')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageForm;
