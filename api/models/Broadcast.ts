export interface Broadcast {
  /**Day of the week broadcast in Japan time.
   *
   * Day of the week or other
   */
  day_of_the_week: string;

  /**for example: "01:25" */
  start_time: string | null;
}
