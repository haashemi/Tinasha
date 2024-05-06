export enum Season {
  Winter = "winter",
  Spring = "spring",
  Summer = "summer",
  Fall = "fall",
}

export const getSeason = (month: number): Season =>
  month >= 0 && month <= 2
    ? Season.Winter
    : month >= 3 && month <= 5
      ? Season.Spring
      : month >= 6 && month <= 8
        ? Season.Summer
        : Season.Fall;
