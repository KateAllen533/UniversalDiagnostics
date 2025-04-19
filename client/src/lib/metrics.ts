import { UserEventType } from '@shared/schema';
import { apiRequest } from './queryClient';

// Generate a unique session ID if one doesn't exist
const getSessionId = (): string => {
  const existingId = localStorage.getItem('diagnosticSessionId');
  if (existingId) return existingId;
  
  const newId = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('diagnosticSessionId', newId);
  return newId;
};

// Get basic device info
const getDeviceInfo = (): Record<string, any> => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    timestamp: new Date().toISOString(),
  };
};

// Get browser info
const getBrowserInfo = (): Record<string, any> => {
  const browserInfo: Record<string, any> = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
  };
  
  // Add window dimensions
  if (window) {
    browserInfo.windowWidth = window.innerWidth;
    browserInfo.windowHeight = window.innerHeight;
  }
  
  return browserInfo;
};

/**
 * Track a user event/action
 * @param eventType The type of event to track
 * @param eventData Additional data about the event
 */
export const trackEvent = async (
  eventType: UserEventType, 
  eventData: Record<string, any> = {}
): Promise<void> => {
  try {
    // Default to user ID 1 if not authenticated
    const userId = 1; // In a real app, get this from auth state
    const sessionId = getSessionId();
    
    // Prepare the metric data
    const metricData = {
      userId,
      sessionId,
      eventType,
      eventData,
      deviceInfo: getDeviceInfo(),
      browserInfo: getBrowserInfo(),
    };
    
    // Send the tracking data to the API
    await apiRequest('POST', '/api/metrics', metricData);
    
    console.debug(`Tracked event: ${eventType}`);
  } catch (error) {
    // Don't break the app if tracking fails, just log it
    console.error('Error tracking event:', error);
  }
};

/**
 * Track a page view
 * @param pageName The name of the page being viewed
 */
export const trackPageView = (pageName: string): void => {
  trackEvent(UserEventType.PAGE_VIEW, { page: pageName });
};

/**
 * Track a connection attempt
 * @param connectionMethod The method used (USB, Bluetooth, etc.)
 * @param vehicleType The type of vehicle
 * @param success Whether the connection was successful
 */
export const trackConnection = (
  connectionMethod: string, 
  vehicleType: string, 
  success: boolean
): void => {
  const eventType = success 
    ? UserEventType.CONNECTION_SUCCESS 
    : UserEventType.CONNECTION_FAILURE;
  
  trackEvent(eventType, { connectionMethod, vehicleType });
};

/**
 * Track diagnostics run
 * @param sessionId The diagnostic session ID
 * @param vehicleInfo Basic vehicle info
 */
export const trackDiagnosticsRun = (
  sessionId: number, 
  vehicleInfo: Record<string, any>
): void => {
  trackEvent(UserEventType.DIAGNOSTICS_RUN, { 
    diagnosticSessionId: sessionId,
    vehicleInfo
  });
};

/**
 * Track trouble code scan
 * @param sessionId The diagnostic session ID
 * @param codeCount The number of codes found
 */
export const trackTroubleCodeScan = (
  sessionId: number, 
  codeCount: number
): void => {
  trackEvent(UserEventType.TROUBLE_CODE_SCAN, { 
    diagnosticSessionId: sessionId,
    codeCount
  });
};

/**
 * Track form submission
 * @param formType The type of form being submitted
 * @param formData Optional form data (excluding sensitive fields)
 */
export const trackFormSubmission = (
  formType: string, 
  formData: Record<string, any> = {}
): void => {
  // Remove any sensitive fields that shouldn't be tracked
  const safeFormData = { ...formData };
  
  // List of fields to exclude from tracking
  const sensitiveFields = ['password', 'token', 'secret', 'credentials'];
  
  // Remove sensitive fields
  Object.keys(safeFormData).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      delete safeFormData[key];
    }
  });
  
  trackEvent(UserEventType.FORM_SUBMISSION, { 
    formType,
    ...safeFormData
  });
};

/**
 * Track an error that occurred
 * @param errorType Type of error
 * @param errorMessage Error message
 * @param errorData Additional error data
 */
export const trackError = (
  errorType: string, 
  errorMessage: string, 
  errorData: Record<string, any> = {}
): void => {
  trackEvent(UserEventType.ERROR, { 
    errorType,
    errorMessage,
    ...errorData
  });
};

/**
 * Track feature usage
 * @param featureName Name of the feature being used
 * @param details Additional details about how the feature was used
 */
export const trackFeatureUsage = (
  featureName: string, 
  details: Record<string, any> = {}
): void => {
  trackEvent(UserEventType.FEATURE_USAGE, { 
    feature: featureName,
    ...details
  });
};