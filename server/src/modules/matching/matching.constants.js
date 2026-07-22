const MESSAGES = {
  PROGRAMS_RECOMMENDED: 'Program recommendations retrieved successfully',
  VOLUNTEERS_RECOMMENDED: 'Volunteer recommendations retrieved successfully',
  RECOMMENDATION_FETCHED: 'Detailed recommendation retrieved successfully',
  RECOMMENDATION_SAVED: 'Recommendation saved successfully',
  RECOMMENDATION_UNSAVED: 'Recommendation unsaved successfully',
  SAVED_RECOMMENDATIONS_FETCHED: 'Saved recommendations retrieved successfully',
  RECOMMENDATION_HISTORY_FETCHED: 'Recommendation history retrieved successfully',
  RECOMMENDATIONS_REFRESHED: 'Recommendations refreshed successfully',
  RECOMMENDATIONS_NOTIFICATION_SENT: 'Recommendation notification sent',
  FEEDBACK_SUBMITTED: 'Recommendation feedback submitted successfully',
  RECOMMENDATION_DISMISSED: 'Recommendation dismissed successfully',
};

const MATCHING_WEIGHTS = {
  SKILLS: 25,
  INTERESTS: 15,
  LANGUAGES: 10,
  LOCATION: 20,
  AVAILABILITY: 10,
  PREVIOUS_PROGRAMS: 10,
  RELIABILITY: 10,
};

module.exports = { MESSAGES, MATCHING_WEIGHTS };
