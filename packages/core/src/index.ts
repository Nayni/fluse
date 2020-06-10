/* eslint-disable @typescript-eslint/no-empty-interface */
export interface FixtureContext {}

declare global {
  interface FluseFixtureContext extends FixtureContext {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

export { combine, CombinedFixtureBuilder, fixture } from "./fixture";
export { Seeder } from "./seeder";
