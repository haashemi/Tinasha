import type { ImageProps } from "expo-image";
import { Image as ExpoImage } from "expo-image";

const Image = (props: ImageProps) => {
  const { allowDownscaling = true, transition = 100, ...otherProps } = props;

  return <ExpoImage allowDownscaling={allowDownscaling} transition={transition} {...otherProps} />;
};

export default Image;
