import type { Picture } from "@/api/models/Picture";

export const mergePictureUrls = (...pictures: (Picture | undefined)[]) => {
  return [...new Set(pictures.map((pic) => pic?.large ?? pic?.medium).filter((v) => v))] as string[];
};
