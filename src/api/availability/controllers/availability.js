'use strict';

/**
 * availability controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dayjs = require('dayjs')

//enable custom format in dayjs
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const httpConstants = require('http2').constants;

const {
  validateCreateBody,
} = require('./validation/availability');

module.exports = createCoreController('api::availability.availability', ({strapi}) => ({

  async create(ctx)
  {
    const user = ctx.state.user;

   const {days_of_week, start_time, end_time}  = await validateCreateBody(ctx.request.body.data);

    //get the availability
   const availabilities = await strapi.service("api::availability.custom").findManyByUserId(user.id);

    //find if availabilities days of week is already exists
    let conflictCount = 0;
    for (let i = 0; i < availabilities.length; i++) {
      const availability = availabilities[i];
        if(availability) {
        const existingStartTime = dayjs(availability.start_time, "HH:mm:ss.sss");
        const existingEndTime = dayjs(availability.end_time, "HH:mm:ss.sss");

        const newStartTime = dayjs(start_time, "HH:mm:ss");
        const newEndTime = dayjs(end_time, "HH:mm:ss");

        //check if has conflict in existing schedule
        let hasConflict = await strapi.config.util.checkForConflict(
          existingStartTime,existingEndTime,
          newStartTime, newEndTime);

        if(hasConflict) {
          conflictCount++;
        };
      }
    }
    if(conflictCount > 0) return ctx.conflict('conflict time schedule');

    //TODO: Create a Requests method to handle some request validations
    //create obj
    let obj = {
      user: user.id,
      days_of_week,
      start_time,
      end_time
    };

    let sanitizeEntry = await strapi.service("api::availability.custom").create(obj);
    if(sanitizeEntry) return {
      status: httpConstants.HTTP_STATUS_OK,
      data: sanitizeEntry,
      message:"successfully created!"
    };

  },

}));
