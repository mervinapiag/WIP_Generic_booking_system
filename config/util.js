const dayjs = require('dayjs')

//enable custom format in dayjs
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


module.exports = {

   /**
    * Check if has conflict in existing schedule
    * @param {*} existingStartTime
    * @param {*} existingEndTime
    * @param {*} newStartTime
    * @param {*} newEndTime
    * @returns boolean
    *
    */
   async checkForConflict(existingStartTime, existingEndTime, newStartTime, newEndTime)
   {
      if (
        (newStartTime.isAfter(existingStartTime) && newStartTime.isBefore(existingEndTime)) ||
        (newEndTime.isAfter(existingStartTime) && newEndTime.isBefore(existingEndTime)) ||
        (newStartTime.isBefore(existingStartTime) && newEndTime.isAfter(existingEndTime)) ||
        (newStartTime.isSame(existingStartTime) && newEndTime.isSame(existingEndTime))
      ) {
        // Conflict found
        return true;
      }

      // No conflict found
      return false;
    },

}
