<template>
  <input type="file" accept="image/*" @change="handleFileChange" />
</template>

<script lang="ts" setup>
import jsQR from "jsqr";

const emit = defineEmits<{
  (eventName: "decoded", data: string): void;
  (eventName: "error", error: string): void;
}>();

const readFileAsDataURL = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) return reject(new Error("Could not read file"));
      resolve(e.target.result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = src;
  });
};

const createCanvas = (image: HTMLImageElement): ImageData => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

const decodeQRCode = (imageData: ImageData): void => {
  const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
  if (qrCode) {
    emit("decoded", qrCode.data);
  } else {
    emit("error", "QR code wasn't found in the image");
  }
};

const handleFileChange = async (event: Event): Promise<void> => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const dataURL = await readFileAsDataURL(file);
    if (typeof dataURL === "string") {
      const image = await createImage(dataURL);
      const imageData = createCanvas(image);
      decodeQRCode(imageData);
    }
  } catch (error) {
    if (error instanceof Error) {
      emit("error", "Error reading file: " + error.message);
    }
  }
};
</script>
