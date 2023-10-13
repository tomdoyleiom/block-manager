import React from "react";

type Asset = {
  url: string;
  mimeType: string;
  width: number;
  height: number;
  alt?: string;
};

interface IAssetBlockProps extends Asset {
  className?: string;
  overrideWidth?: number;
}

const scaleImage = (image: IAssetBlockProps, width: number) => {
  const ratio = image.width / image.height;
  return {
    ...image,
    width: width,
    height: width / ratio,
  };
};

export const AssetBlock: React.FC<IAssetBlockProps> = (asset) => {
  switch (asset.mimeType) {
    case "image/jpeg":
    case "image/png":
    case "image/svg+xml":
    case "image/webp":
      let _asset = asset;
      if (asset.overrideWidth) {
        _asset = scaleImage(asset, asset.overrideWidth);
      }

      return (
        <img
          alt={asset.alt}
          className={asset.className}
          src={asset.url}
          height={_asset.height > 0 ? _asset.height : "50"}
          width={_asset.width > 0 ? _asset.width : "50"}
        />
      );

    case "video/mp4":
      return (
        <video controls className={asset.className} width="100%">
          <source src={asset.url} type="video/mp4" />
          <track kind="captions" />
        </video>
      );

    default:
      console.log(`AssetBlock: Unsupported asset type: ${asset.mimeType}`);
      return null;
  }
};
