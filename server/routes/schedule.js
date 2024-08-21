const express = require("express");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const ACCESS = require("../constants/access");
const { getLogs } = require("../controllers/log");
const { getUsers, getUser } = require("../controllers/user");
const mapLog = require("../helpers/mapLog");
const { getProducts } = require("../controllers/product");
const {
  getScheduleByMonth,
  addSchedule,
  deleteScheduleByMonth,
  getLastSchedule,
} = require("../controllers/schedule");
const { mapSchedule } = require("../helpers/mapSchedule");

const router = express.Router({ mergeParams: true });

// по факту get запрос
router.post(
  "/find_by_month",
  authenticated,
  hasRole(ACCESS.WATCH_SCHEDULE),
  async (req, res) => {
    try {
      const schedulesByMonth = await getScheduleByMonth(
        req.body.year,
        req.body.month
      );

      const lastSchedule = await getLastSchedule();

      const author = await getUser(lastSchedule.authorId);

      res.send({
        data: {
          schedules:
            schedulesByMonth.length !== 0
              ? mapSchedule(schedulesByMonth)
              : null,
          latestUpdated: {
            updatedAt: lastSchedule.updatedAt,
            authorName: author.login,
          },
        },
      });
    } catch (error) {
      res.send({ error: error.message });
    }
  }
);

router.post(
  "/",
  authenticated,
  hasRole(ACCESS.WATCH_SCHEDULE),
  async (req, res) => {
    try {
      console.log("DATA", req.body.data);
      const schedules = await addSchedule(req.body.data);

      res.send({ data: "ok" });
    } catch (error) {
      res.send({ error: error.message });
    }
  }
);

module.exports = router;
