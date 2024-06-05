import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const ImageCrop = (props) => {
  const image = props.file;
  const [crop1, setCrop1] = useState({ x: 0, y: 0 });
  const [zoom1, setZoom1] = useState(1);
  const [croppedAreaPixels, setcroppedAreaPixels] = useState();

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
  }

  function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation);

    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  }

  const onSubmit = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      props.onSubmitFile(croppedImage);
      props.cloesCrop();
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const getCroppedImg = async (
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file));
      }, 'image/jpeg');
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setcroppedAreaPixels(croppedAreaPixels);
  }, []);

  const inZoomOut = () => {
    if (zoom1 < 4) {
      let imageZoom = zoom1 + 0.6;
      setZoom1(imageZoom);
    }
  };

  const inZoonIn = () => {
    if (zoom1 > 1) {
      let imageZoom = zoom1 - 0.6;
      setZoom1(imageZoom);
    }
  };

  return (
    <>
      <div className='w-11/12 justify-center mx-auto items-center flex overflow-x-hidden md:p-10 overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-2xl'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded-lg shadow-lg relative py-2 flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div
              className='flex justify-end text-2xl font-bold text-black mr-4 cursor-pointer'
              onClick={props.cloesCrop}
            >
              <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
            </div>
            <div>
              <div className='crop-container'>
                <Cropper
                  image={image}
                  crop={crop1}
                  zoom={zoom1}
                  onCropChange={setCrop1}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom1}
                  cropShape={props.cropShape}
                  aspect={1}
                />
              </div>
              <div>
                {/* <RiAddFill
                style={{
                  // fill: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  height: "30px",
                  width: "30px",
                }}
                // onClick={inZoomOut}
              /> */}

                <div className='flex gap-2 justify-center'>
                  <button
                    className="bg-btnprimary rounded px-1 py-2 font-['Montserrat']"
                    onClick={inZoomOut}
                  >
                    <div className='w-full flex justify-center px-2 py-1'>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className='text-white text-2xl'
                      />
                    </div>
                  </button>

                  <button
                    className="bg-btnprimary rounded px-1 py-2 font-['Montserrat']"
                    onClick={inZoonIn}
                  >
                    <div className='w-full flex justify-center py-1 px-2'>
                      <FontAwesomeIcon
                        icon={faMinus}
                        className='text-white text-2xl'
                      />
                    </div>
                  </button>
                </div>
              </div>
              <div className='w-full flex justify-center'>
                <button
                  className='bg-btnprimary mt-2 hover:bg-primary text-white text-2xl py-1 px-14 rounded-full border-4 border-solid'
                  type='submit'
                  onClick={onSubmit}
                >
                  upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-70 fixed inset-0 z-40 bg-black'></div>
    </>
  );
};

export default ImageCrop;
