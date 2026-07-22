/**
 * VolunteerContext.jsx
 * ─────────────────────────────────────────────────────────────────
 * Central state manager for the entire volunteer journey.
 *
 * Provides state + actions for:
 *  • Applications  (list, detail, stats, filters, pagination)
 *  • Joined Programs (list, detail)
 *  • Attendance    (dashboard, history, check-in / check-out)
 *  • Volunteer Hours
 *
 * Usage:
 *   Wrap your protected routes with <VolunteerProvider>.
 *   Consume via the useVolunteer() hook inside any child component.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

import * as applicationsService from '../services/applicationsService';
import * as attendanceService from '../services/attendanceService';
import * as programsService from '../services/programsService';

// ─── 1. INITIAL STATE ──────────────────────────────────────────────────────────

const initialState = {
  // ── Applications ──────────────────────────────────────────────
  applications: [],
  currentApplication: null,
  applicationStats: { pending: 0, approved: 0, rejected: 0, waitlisted: 0 },
  applicationsLoading: false,
  applicationsError: null,
  applicationsFilters: { status: '', search: '', sortBy: 'date_desc' },
  applicationsPagination: { page: 1, limit: 6, total: 0 },

  // ── Joined Programs ───────────────────────────────────────────
  joinedPrograms: [],
  currentJoinedProgram: null,
  joinedProgramsLoading: false,

  // ── Attendance ────────────────────────────────────────────────
  attendanceDashboard: null,
  attendanceHistory: { records: [], pagination: { page: 1, limit: 10, total: 0 } },
  checkInStatus: { checkedIn: false, checkInTime: null, currentAttendanceId: null },
  attendanceLoading: false,
  attendanceFilters: { program: '', dateRange: 'all', status: '', month: '' },

  // ── Hours ─────────────────────────────────────────────────────
  volunteerHours: null,
  hoursLoading: false,
};

// ─── 2. ACTION TYPES ───────────────────────────────────────────────────────────

const AT = {
  // Applications
  APPS_LOADING:            'APPS_LOADING',
  APPS_SUCCESS:            'APPS_SUCCESS',
  APPS_ERROR:              'APPS_ERROR',
  APP_DETAIL_LOADING:      'APP_DETAIL_LOADING',
  APP_DETAIL_SUCCESS:      'APP_DETAIL_SUCCESS',
  APP_STATS_SUCCESS:       'APP_STATS_SUCCESS',
  APPS_SET_FILTER:         'APPS_SET_FILTER',
  APPS_SET_PAGINATION:     'APPS_SET_PAGINATION',

  // Joined Programs
  JP_LOADING:              'JP_LOADING',
  JP_SUCCESS:              'JP_SUCCESS',
  JP_DETAIL_SUCCESS:       'JP_DETAIL_SUCCESS',

  // Attendance
  ATT_DASHBOARD_LOADING:   'ATT_DASHBOARD_LOADING',
  ATT_DASHBOARD_SUCCESS:   'ATT_DASHBOARD_SUCCESS',
  ATT_HISTORY_LOADING:     'ATT_HISTORY_LOADING',
  ATT_HISTORY_SUCCESS:     'ATT_HISTORY_SUCCESS',
  ATT_CHECKIN_SUCCESS:     'ATT_CHECKIN_SUCCESS',
  ATT_CHECKOUT_SUCCESS:    'ATT_CHECKOUT_SUCCESS',
  ATT_SET_FILTER:          'ATT_SET_FILTER',

  // Hours
  HOURS_LOADING:           'HOURS_LOADING',
  HOURS_SUCCESS:           'HOURS_SUCCESS',
};

// ─── 3. REDUCER ────────────────────────────────────────────────────────────────

function volunteerReducer(state, action) {
  switch (action.type) {

    // ── Applications ─────────────────────────────────────────────
    case AT.APPS_LOADING:
      return { ...state, applicationsLoading: true, applicationsError: null };

    case AT.APPS_SUCCESS:
      return {
        ...state,
        applicationsLoading: false,
        applications: action.payload.applications ?? [],
        applicationsPagination: action.payload.pagination ?? state.applicationsPagination,
        // Merge stats if the list response includes them
        ...(action.payload.stats
          ? { applicationStats: action.payload.stats }
          : {}),
      };

    case AT.APPS_ERROR:
      return {
        ...state,
        applicationsLoading: false,
        applicationsError: action.payload,
      };

    case AT.APP_DETAIL_LOADING:
      return { ...state, applicationsLoading: true, currentApplication: null, applicationsError: null };

    case AT.APP_DETAIL_SUCCESS:
      return {
        ...state,
        applicationsLoading: false,
        currentApplication: action.payload,
      };

    case AT.APP_STATS_SUCCESS:
      return { ...state, applicationStats: action.payload };

    case AT.APPS_SET_FILTER:
      return {
        ...state,
        applicationsFilters: {
          ...state.applicationsFilters,
          [action.payload.key]: action.payload.value,
        },
        // Reset to page 1 whenever a filter changes
        applicationsPagination: { ...state.applicationsPagination, page: 1 },
      };

    case AT.APPS_SET_PAGINATION:
      return {
        ...state,
        applicationsPagination: {
          ...state.applicationsPagination,
          ...action.payload,
        },
      };

    // ── Joined Programs ───────────────────────────────────────────
    case AT.JP_LOADING:
      return { ...state, joinedProgramsLoading: true };

    case AT.JP_SUCCESS:
      return {
        ...state,
        joinedProgramsLoading: false,
        joinedPrograms: action.payload ?? [],
      };

    case AT.JP_DETAIL_SUCCESS:
      return { ...state, currentJoinedProgram: action.payload };

    // ── Attendance ────────────────────────────────────────────────
    case AT.ATT_DASHBOARD_LOADING:
      return { ...state, attendanceLoading: true };

    case AT.ATT_DASHBOARD_SUCCESS:
      return {
        ...state,
        attendanceLoading: false,
        attendanceDashboard: action.payload,
      };

    case AT.ATT_HISTORY_LOADING:
      return { ...state, attendanceLoading: true };

    case AT.ATT_HISTORY_SUCCESS:
      return {
        ...state,
        attendanceLoading: false,
        attendanceHistory: {
          records: action.payload.records ?? [],
          pagination: action.payload.pagination ?? state.attendanceHistory.pagination,
        },
      };

    case AT.ATT_CHECKIN_SUCCESS:
      return {
        ...state,
        checkInStatus: {
          checkedIn: true,
          checkInTime: action.payload.checkInTime,
          currentAttendanceId: action.payload.attendanceId,
        },
      };

    case AT.ATT_CHECKOUT_SUCCESS:
      return {
        ...state,
        checkInStatus: { checkedIn: false, checkInTime: null, currentAttendanceId: null },
      };

    case AT.ATT_SET_FILTER:
      return {
        ...state,
        attendanceFilters: {
          ...state.attendanceFilters,
          [action.payload.key]: action.payload.value,
        },
      };

    // ── Hours ─────────────────────────────────────────────────────
    case AT.HOURS_LOADING:
      return { ...state, hoursLoading: true };

    case AT.HOURS_SUCCESS:
      return { ...state, hoursLoading: false, volunteerHours: action.payload };

    default:
      return state;
  }
}

// ─── 4. CONTEXT CREATION ───────────────────────────────────────────────────────

const VolunteerContext = createContext(null);

// ─── 5. PROVIDER COMPONENT ─────────────────────────────────────────────────────

export const VolunteerProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(volunteerReducer, initialState);

  // ── Applications ───────────────────────────────────────────────

  /**
   * Fetch paginated + filtered applications list.
   * Accepts optional filter overrides; otherwise uses state filters.
   */
  const fetchApplications = useCallback(async (filterOverrides = {}) => {
    dispatch({ type: AT.APPS_LOADING });
    try {
      const params = {
        ...state.applicationsFilters,
        page: state.applicationsPagination.page,
        limit: state.applicationsPagination.limit,
        ...filterOverrides,
      };
      const res = await applicationsService.getApplications(params);
      if (res?.success) {
        dispatch({
          type: AT.APPS_SUCCESS,
          payload: {
            applications: res.data?.applications ?? [],
            pagination: res.data?.pagination,
            stats: res.data?.stats,
          },
        });
      } else {
        throw new Error(res?.message || 'Failed to load applications');
      }
    } catch (err) {
      const msg = err?.message || 'Failed to load applications';
      dispatch({ type: AT.APPS_ERROR, payload: msg });
      toast.error(msg);
    }
  }, [state.applicationsFilters, state.applicationsPagination.page, state.applicationsPagination.limit]);

  /**
   * Fetch a single application by its ID.
   */
  const fetchApplicationById = useCallback(async (id) => {
    dispatch({ type: AT.APP_DETAIL_LOADING });
    try {
      const res = await applicationsService.getApplicationById(id);
      if (res?.success) {
        dispatch({ type: AT.APP_DETAIL_SUCCESS, payload: res.data?.application ?? null });
      } else {
        throw new Error(res?.message || 'Failed to load application');
      }
    } catch (err) {
      const msg = err?.message || 'Failed to load application details';
      dispatch({ type: AT.APPS_ERROR, payload: msg });
      toast.error(msg);
    }
  }, []);

  /**
   * Submit a new application and refresh the list.
   */
  const submitApplication = useCallback(async (programId, formData) => {
    try {
      const res = await applicationsService.submitApplication(programId, formData);
      if (res?.success) {
        toast.success('Application submitted successfully!');
        // Refresh list & stats
        await fetchApplications();
        await fetchApplicationStats();
        return { success: true, application: res.data?.application };
      }
      throw new Error(res?.message || 'Submission failed');
    } catch (err) {
      const msg = err?.message || 'Could not submit application';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [fetchApplications]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Withdraw an existing application and refresh the list.
   */
  const withdrawApplication = useCallback(async (id) => {
    try {
      const res = await applicationsService.withdrawApplication(id);
      if (res?.success) {
        toast.success('Application withdrawn.');
        await fetchApplications();
        await fetchApplicationStats();
        return { success: true };
      }
      throw new Error(res?.message || 'Withdrawal failed');
    } catch (err) {
      const msg = err?.message || 'Could not withdraw application';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [fetchApplications]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Fetch aggregate application stats (counts by status).
   * Called internally — not exposed publicly since stats are merged into
   * APPS_SUCCESS; this standalone version keeps stats fresh after mutations.
   */
  const fetchApplicationStats = useCallback(async () => {
    try {
      const res = await applicationsService.getApplicationStats();
      if (res?.success) {
        dispatch({
          type: AT.APP_STATS_SUCCESS,
          payload: res.data ?? { pending: 0, approved: 0, rejected: 0, waitlisted: 0 },
        });
      }
    } catch {
      // Non-critical — silently ignore stats fetch failures
    }
  }, []);

  /**
   * Update a single filter key and reset pagination to page 1.
   */
  const setApplicationsFilter = useCallback((key, value) => {
    dispatch({ type: AT.APPS_SET_FILTER, payload: { key, value } });
  }, []);

  // ── Joined Programs ────────────────────────────────────────────

  /**
   * Fetch the list of programs this volunteer is enrolled in.
   */
  const fetchJoinedPrograms = useCallback(async () => {
    dispatch({ type: AT.JP_LOADING });
    try {
      // getJoinedPrograms() returns { programs, pagination } — not { success, data }
      const res = await programsService.getJoinedPrograms();
      dispatch({ type: AT.JP_SUCCESS, payload: res?.programs ?? [] });
    } catch (err) {
      dispatch({ type: AT.JP_SUCCESS, payload: [] }); // degrade gracefully
      console.error('[VolunteerContext] fetchJoinedPrograms:', err?.message);
    }
  }, []);

  /**
   * Fetch a single joined program by ID.
   */
  const fetchJoinedProgramById = useCallback(async (id) => {
    try {
      // getJoinedProgramById() returns { success, data: { program } }
      const res = await programsService.getJoinedProgramById(id);
      const program = res?.data?.program ?? res?.program ?? null;
      dispatch({ type: AT.JP_DETAIL_SUCCESS, payload: program });
    } catch (err) {
      console.error('[VolunteerContext] fetchJoinedProgramById:', err?.message);
    }
  }, []);

  // ── Attendance ─────────────────────────────────────────────────

  /**
   * Load the attendance dashboard summary for the volunteer.
   */
  const fetchAttendanceDashboard = useCallback(async () => {
    dispatch({ type: AT.ATT_DASHBOARD_LOADING });
    try {
      const res = await attendanceService.getAttendanceDashboard();
      if (res?.success) {
        dispatch({ type: AT.ATT_DASHBOARD_SUCCESS, payload: res.data ?? null });
      } else {
        throw new Error(res?.message || 'Failed to load attendance dashboard');
      }
    } catch (err) {
      dispatch({ type: AT.ATT_DASHBOARD_SUCCESS, payload: null }); // degrade gracefully
      console.error('[VolunteerContext] fetchAttendanceDashboard:', err?.message);
    }
  }, []);

  /**
   * Load paginated attendance history.
   * Merges state.attendanceFilters with optional overrides.
   */
  const fetchAttendanceHistory = useCallback(async (filterOverrides = {}) => {
    dispatch({ type: AT.ATT_HISTORY_LOADING });
    try {
      const params = { ...state.attendanceFilters, ...filterOverrides };
      const res = await attendanceService.getAttendanceHistory(params);
      if (res?.success) {
        dispatch({
          type: AT.ATT_HISTORY_SUCCESS,
          payload: {
            records: res.data?.records ?? [],
            pagination: res.data?.pagination,
          },
        });
      } else {
        throw new Error(res?.message || 'Failed to load attendance history');
      }
    } catch (err) {
      dispatch({ type: AT.ATT_HISTORY_SUCCESS, payload: { records: [], pagination: undefined } });
      console.error('[VolunteerContext] fetchAttendanceHistory:', err?.message);
    }
  }, [state.attendanceFilters]);

  /**
   * Check in to a program session.
   */
  const performCheckIn = useCallback(async (applicationId, coordinates = null, qrToken = null) => {
    try {
      const res = await attendanceService.checkIn(applicationId, coordinates, qrToken);
      if (res?.success) {
        dispatch({
          type: AT.ATT_CHECKIN_SUCCESS,
          payload: {
            attendanceId: res.data?.attendanceId,
            checkInTime: res.data?.checkInTime ?? new Date().toISOString(),
          },
        });
        toast.success('Checked in successfully! 🎉');
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || 'Check-in failed');
    } catch (err) {
      const msg = err?.message || 'Could not complete check-in';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, []);

  /**
   * Check out from an active session.
   */
  const performCheckOut = useCallback(async (attendanceId, coordinates = null, qrToken = null) => {
    try {
      const res = await attendanceService.checkOut(attendanceId, coordinates, qrToken);
      if (res?.success) {
        dispatch({ type: AT.ATT_CHECKOUT_SUCCESS });
        toast.success('Checked out. Great work today! ✅');
        // Refresh dashboard to reflect the new completed session
        fetchAttendanceDashboard();
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || 'Check-out failed');
    } catch (err) {
      const msg = err?.message || 'Could not complete check-out';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [fetchAttendanceDashboard]);

  /**
   * Update a single attendance filter key.
   */
  const setAttendanceFilter = useCallback((key, value) => {
    dispatch({ type: AT.ATT_SET_FILTER, payload: { key, value } });
  }, []);

  // ── Hours ──────────────────────────────────────────────────────

  /**
   * Fetch volunteer hours stats from the programs service.
   */
  const fetchVolunteerHours = useCallback(async () => {
    dispatch({ type: AT.HOURS_LOADING });
    try {
      const res = await programsService.getVolunteerHours();
      if (res?.success) {
        dispatch({ type: AT.HOURS_SUCCESS, payload: res.data ?? null });
      } else {
        throw new Error(res?.message || 'Failed to load hours');
      }
    } catch (err) {
      dispatch({ type: AT.HOURS_SUCCESS, payload: null });
      console.error('[VolunteerContext] fetchVolunteerHours:', err?.message);
    }
  }, []);

  // ── Initialise when authenticated ──────────────────────────────
  // Removed automatic boot() function to eliminate duplicate requests.
  // Data is now primarily fetched natively via React Query on required pages.
  useEffect(() => {
    // Retained for potential future lightweight auth sync logic
  }, [user]);

  // ── Context value ──────────────────────────────────────────────
  const value = {
    // ── Applications ────────────────────────────────────────────
    applications:           state.applications,
    currentApplication:     state.currentApplication,
    applicationStats:       state.applicationStats,
    applicationsLoading:    state.applicationsLoading,
    applicationsError:      state.applicationsError,
    applicationsFilters:    state.applicationsFilters,
    applicationsPagination: state.applicationsPagination,

    fetchApplications,
    fetchApplicationById,
    submitApplication,
    withdrawApplication,
    setApplicationsFilter,

    // ── Joined Programs ──────────────────────────────────────────
    joinedPrograms:         state.joinedPrograms,
    currentJoinedProgram:   state.currentJoinedProgram,
    joinedProgramsLoading:  state.joinedProgramsLoading,

    fetchJoinedPrograms,
    fetchJoinedProgramById,

    // ── Attendance ───────────────────────────────────────────────
    attendanceDashboard:    state.attendanceDashboard,
    attendanceHistory:      state.attendanceHistory,
    checkInStatus:          state.checkInStatus,
    attendanceLoading:      state.attendanceLoading,
    attendanceFilters:      state.attendanceFilters,

    fetchAttendanceDashboard,
    fetchAttendanceHistory,
    performCheckIn,
    performCheckOut,
    setAttendanceFilter,

    // ── Hours ────────────────────────────────────────────────────
    volunteerHours:         state.volunteerHours,
    hoursLoading:           state.hoursLoading,

    fetchVolunteerHours,
  };

  return (
    <VolunteerContext.Provider value={value}>
      {children}
    </VolunteerContext.Provider>
  );
};

// ─── 6. CONSUMER HOOK ─────────────────────────────────────────────────────────

/**
 * useVolunteer — must be called inside a <VolunteerProvider> tree.
 *
 * @returns {ReturnType<typeof VolunteerProvider>} The full volunteer context value.
 */
export const useVolunteer = () => {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteer must be used within a VolunteerProvider');
  }
  return context;
};

export default VolunteerContext;
