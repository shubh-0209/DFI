const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
};

const MESSAGES = {
  ATTENDANCE_MARKED: 'Attendance marked successfully',
  CHECK_IN_SUCCESS: 'Checked in successfully',
  CHECK_OUT_SUCCESS: 'Checked out successfully',
  ATTENDANCE_FETCHED: 'Attendance record retrieved successfully',
  ATTENDANCE_LIST_FETCHED: 'Attendance records retrieved successfully',
  ATTENDANCE_DELETED: 'Attendance record deleted successfully',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const VALIDATION = {
  REMARKS_MAX_LENGTH: 500,
};

module.exports = {
  ATTENDANCE_STATUS,
  MESSAGES,
  PAGINATION,
  VALIDATION,
};
