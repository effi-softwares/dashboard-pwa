"use client"

import Image, { ImageProps } from "next/image"

type BlobImageProps = Omit<ImageProps, "src"> & {
  src: string
  blurDataURL?: string | null
}

export function BlobImage({ src, blurDataURL, ...props }: BlobImageProps) {
  const imageProps: ImageProps = {
    ...props,
    src,
  }

  if (blurDataURL) {
    imageProps.placeholder = "blur"
    imageProps.blurDataURL = blurDataURL
  }

  return <Image {...imageProps} alt={props.alt ?? ""} />
}
