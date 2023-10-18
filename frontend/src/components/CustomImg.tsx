import { ImgHTMLAttributes } from 'react';

interface ExtendedImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  data?: string; // Agrega la propiedad 'data' al elemento <img>
}

const CustomImg: React.FC<ExtendedImgProps> = ({ data, ...otherProps }) => {
  return <img {...otherProps} />;
};

export default CustomImg;
