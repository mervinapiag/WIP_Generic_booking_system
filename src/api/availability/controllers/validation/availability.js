'use strict';

const { yup, validateYupSchema } = require('@strapi/utils');


const createSchema = yup.object({
  days_of_week: yup.number().min(0).max(6).required(),
  start_time: yup.string().required(),
  end_time: yup.string().required(),
});


module.exports = {
  validateCreateBody: validateYupSchema(createSchema),
};
