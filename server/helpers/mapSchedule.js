function mapSchedule(schedules) {
  const getDayFromISODate = (isoDate) => {
    const date = new Date(isoDate);
    return date.getUTCDate();
  };

  return schedules.map((schedule) => {
    return {
      day: getDayFromISODate(schedule.date),
      colors: schedule.sellers.map(({ user }) => user.color),
      sellerIds: schedule.sellers.map(({ user }) => user.id),
      updatedAt: schedule.updatedAt,
    };
  });
}

module.exports = { mapSchedule };
