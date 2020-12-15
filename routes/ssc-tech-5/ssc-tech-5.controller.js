const { routeUtils, getSessionData } = require('./../../utils')
const { Schema } = require('./schema.js')
const { sendNotification } = require('../../utils/notification.helpers')

module.exports = (app, route) => {
  const name = route.name

  route
    .draw(app)
    .get((req, res) => {
      res.render(name, routeUtils.getViewData(req, {}))
    })
    .post(route.applySchema(Schema), (req, res) => {
      const formData = getSessionData(req)

      console.log(
        'SSC-TECH Fifth step submmitted formData',
        JSON.stringify({ formData: formData }),
      )

      sendNotification(
        formData,
        process.env.SSC_EMAIL_TO,
        process.env.NOTIFY_SSC_TEMPLATE_ID,
      )

      return res.redirect(res.locals.routePath('confirmation'))
    })
}
