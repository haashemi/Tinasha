import { Image as ExpoImage, ImageProps } from "expo-image";

const Image = (props: ImageProps) => {
  const { allowDownscaling = true, transition = 100, ...otherProps } = props;

  return <ExpoImage allowDownscaling={allowDownscaling} transition={transition} {...otherProps} />;
};

export default Image;
