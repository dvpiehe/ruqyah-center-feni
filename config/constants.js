module.exports = {
  CLINIC: {
    NAME: "Ruqyah Support & Cupping Center",
    BRANCH: "Feni Branch",
    LEAD_RAQI: "Muhammadullah Miah",
    ADDRESS: "Bhuya Mansion, Adarsha Housing Society, Mohipal, Feni, Bangladesh.",
    PHONE: "01758-354920",
    WHATSAPP: "+8801758354920",
    EMAIL: "info@ruqyahsupport-feni.com",
    TIMEZONE: "Asia/Dhaka", // UTC+6 (BST)
    OPENING_TIME: "09:00",
    CLOSING_TIME: "20:00",
    BREAK_START: "13:00",
    BREAK_END: "14:00",
    DEFAULT_WEEKLY_HOLIDAY: 5 // Friday (0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat)
  },

  TIME_SLOTS: [
    { id: 1, label: "09:00 AM – 10:00 AM", start: "09:00", end: "10:00" },
    { id: 2, label: "10:00 AM – 11:00 AM", start: "10:00", end: "11:00" },
    { id: 3, label: "11:00 AM – 12:00 PM", start: "11:00", end: "12:00" },
    { id: 4, label: "12:00 PM – 01:00 PM", start: "12:00", end: "13:00" },
    // 01:00 PM – 02:00 PM is mandatory prayer & lunch break (not bookable)
    { id: 5, label: "02:00 PM – 03:00 PM", start: "14:00", end: "15:00" },
    { id: 6, label: "03:00 PM – 04:00 PM", start: "15:00", end: "16:00" },
    { id: 7, label: "04:00 PM – 05:00 PM", start: "16:00", end: "17:00" },
    { id: 8, label: "05:00 PM – 06:00 PM", start: "17:00", end: "18:00" },
    { id: 9, label: "06:00 PM – 07:00 PM", start: "18:00", end: "19:00" },
    { id: 10, label: "07:00 PM – 08:00 PM", start: "19:00", end: "20:00" }
  ],

  APPOINTMENT_STATUSES: [
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Rescheduled",
    "No Show"
  ],

  JWT_SECRET: process.env.JWT_SECRET || "ruqyah-center-feni-secure-token-2026-bhuya-mansion",
  PORT: process.env.PORT || 5000
};
