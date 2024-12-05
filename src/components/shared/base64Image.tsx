import React from "react";

interface Base64ImageProps {
  base64String: string;
  altText: string;
  className?: string;
}

const Base64Image: React.FC<Base64ImageProps> = ({
  base64String,
  altText,
  className,
}) => {
  const imageUrl = `data:image/png;base64,${base64String}`;

  return <img className={className} src={imageUrl} alt={altText} />;
};

export default Base64Image;
