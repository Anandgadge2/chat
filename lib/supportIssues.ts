import type { SupportIssue } from '@/types/support';

export const SUPPORT_ISSUES: SupportIssue[] = [
  // Category A: Login & Account
  {
    code: 'A1',
    category: 'Login & Account',
    title: 'User not found during signup',
    solutionSteps: [
      'We need to register you in our system. Please share the following details:',
      '1. Your full name',
      '2. Your contact number',
      '3. Your designation',
      '4. Your department',
      'Our team will register you and send a confirmation within 1 working day.',
    ],
    requiresUserDetails: true,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'signup not working',
      'user not found',
      'cannot signup',
      'account not created',
      'registration failed',
      'new user registration',
      'signup issue',
      'user registration error',
    ],
  },
  {
    code: 'A2',
    category: 'Login & Account',
    title: 'Unable to login',
    solutionSteps: [
      '1. Tap "Forgot Password" on the login screen.',
      '2. Reset your password using your registered email or mobile number.',
      '3. Try logging in with the new password.',
      '4. If the problem persists, contact your site administrator to reactivate your account.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'login failed',
      'cannot login',
      'login not working',
      'login error',
      'credentials wrong',
      'wrong password',
      'account inactive',
      'unable to sign in',
      'login issue',
    ],
  },

  // Category B: Location, GPS & Geofence
  {
    code: 'B1',
    category: 'Location, GPS & Geofence',
    title: 'Out of geofence message',
    solutionSteps: [
      '1. Open the app and check your current location on the map.',
      '2. Move to an open area away from buildings, rooftops, or dense structures.',
      '3. Wait for 30 seconds to allow GPS to stabilize.',
      '4. Retry your action.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'geofence error',
      'out of geofence',
      'location error',
      'gps not working',
      'location not accurate',
      'outside geofence',
      'geofence warning',
      'location accuracy low',
    ],
  },
  {
    code: 'B2',
    category: 'Location, GPS & Geofence',
    title: 'Site or geofence not visible',
    solutionSteps: [
      'Your site has not been assigned yet. Please share the following details:',
      '1. Your full name',
      '2. Your contact number',
      '3. Your designation',
      '4. Your department',
      'Our team will assign your site and notify you.',
    ],
    requiresUserDetails: true,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'site not visible',
      'geofence not visible',
      'no geofence',
      'site not assigned',
      'geofence missing',
      'site missing',
      'cannot see site',
      'site not showing',
    ],
  },
  {
    code: 'B3',
    category: 'Location, GPS & Geofence',
    title: 'Geofence missing from map',
    solutionSteps: [
      'The geofence boundary needs to be created. Please share one of the following:',
      '1. Your current location and site name, OR',
      '2. KML file of the site boundary',
      'Our team will create the geofence for you.',
    ],
    requiresUserDetails: true,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'geofence missing',
      'geofence not created',
      'boundary not set',
      'geofence deleted',
      'map not showing boundary',
      'site boundary missing',
      'no boundary',
    ],
  },
  {
    code: 'B4',
    category: 'Location, GPS & Geofence',
    title: 'Location not fetching',
    solutionSteps: [
      '1. Go to your phone Settings > Apps > PugArch FSM > Permissions.',
      '2. Set Location permission to "Always Allow".',
      '3. Make sure GPS is turned ON in your phone settings.',
      '4. Turn on mobile data or WiFi.',
      '5. Close and reopen the PugArch FSM app.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'location not fetching',
      'gps not working',
      'location disabled',
      'location permission',
      'cannot get location',
      'location not available',
      'gps disabled',
      'location access denied',
    ],
  },

  // Category C: Attendance & Tracking
  {
    code: 'C1',
    category: 'Attendance & Tracking',
    title: 'Face recognition failed',
    solutionSteps: [
      '1. Go to your phone Settings > Apps > PugArch FSM > Permissions.',
      '2. Allow "Camera" permission.',
      '3. Return to the app and retry face recognition.',
      '4. If it still fails, please share a clear selfie with your full name and contact details.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'face recognition failed',
      'face scan not working',
      'face detection error',
      'face not recognized',
      'selfie not working',
      'camera permission denied',
      'face unlock failed',
      'facial recognition issue',
    ],
  },
  {
    code: 'C2',
    category: 'Attendance & Tracking',
    title: 'Attendance not syncing',
    solutionSteps: [
      '1. Check your internet connection (mobile data or WiFi).',
      '2. Open the PugArch FSM app and go to the Attendance section.',
      '3. Look for an "Upload" or "Sync" button and tap it.',
      '4. Wait for the sync to complete and you will see a confirmation message.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'attendance not syncing',
      'attendance upload failed',
      'cannot sync attendance',
      'offline attendance',
      'sync error',
      'attendance not updating',
      'upload failed',
    ],
  },
  {
    code: 'C3',
    category: 'Attendance & Tracking',
    title: 'Live tracking not updating',
    solutionSteps: [
      '1. Go to your phone Settings > Apps > PugArch FSM > Permissions.',
      '2. Set Location permission to "Always Allow" (not just "While Using App").',
      '3. Return to the app and restart it.',
      '4. Your live location should now update correctly.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'live tracking not updating',
      'tracking not working',
      'location not updating',
      'tracking frozen',
      'position not changing',
      'tracking delay',
      'location tracking issue',
    ],
  },
  {
    code: 'C4',
    category: 'Attendance & Tracking',
    title: 'Tracking showing wrong route',
    solutionSteps: [
      '1. Set Location permission to "Always Allow" in phone Settings > Apps > PugArch FSM > Permissions.',
      '2. Check if an app update is available in Play Store.',
      '3. If available, install the latest version.',
      '4. Restart the app and check the tracking route.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'tracking wrong route',
      'incorrect tracking',
      'wrong location shown',
      'inaccurate tracking',
      'route not correct',
      'tracking inaccurate',
      'wrong path shown',
    ],
  },
  {
    code: 'C5',
    category: 'Attendance & Tracking',
    title: 'Patrolling status not updating',
    solutionSteps: [
      '1. Set Location permission to "Always Allow" in phone Settings.',
      '2. Open Play Store, search for "PugArch FSM", and update to the latest version.',
      '3. Restart the app.',
      '4. Retry your patrolling or tracking action.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'patrolling status not updating',
      'status not changing',
      'patrol update issue',
      'status stuck',
      'patrolling frozen',
      'status update delay',
    ],
  },

  // Category D: App Crashes & Performance
  {
    code: 'D1',
    category: 'App Crashes & Performance',
    title: 'App crashing frequently',
    solutionSteps: [
      '1. Open Google Play Store and search for "PugArch FSM".',
      '2. If an "Update" button is available, tap it to update the app.',
      '3. If the app still crashes after updating, uninstall the app completely.',
      '4. Reinstall PugArch FSM from Play Store.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'app crashing',
      'app crashes frequently',
      'app keeps crashing',
      'frequent crashes',
      'app crash error',
      'app force close',
      'app not stable',
    ],
  },
  {
    code: 'D2',
    category: 'App Crashes & Performance',
    title: 'Slow app performance',
    solutionSteps: [
      '1. Close all unused apps running in the background.',
      '2. Restart your phone completely.',
      '3. Reopen the PugArch FSM app.',
      '4. If performance is still slow, consider uninstalling unused apps to free up device memory.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: false,
    keywords: [
      'app slow',
      'slow performance',
      'app lagging',
      'app not responsive',
      'slow loading',
      'performance issue',
      'app sluggish',
      'lag',
    ],
  },
  {
    code: 'D3',
    category: 'App Crashes & Performance',
    title: 'App not installing',
    solutionSteps: [
      '1. Check your Android version: Go to Settings > About Phone > Android Version.',
      '2. PugArch FSM requires Android 8.0 or above.',
      '3. Free up storage space. At least 200 MB of free space is recommended.',
      '4. Retry installation from Google Play Store.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'app not installing',
      'installation failed',
      'cannot install app',
      'install error',
      'app installation issue',
      'download failed',
      'incompatible device',
    ],
  },

  // Category E: Data & Sync
  {
    code: 'E1',
    category: 'Data & Sync',
    title: 'Data loss after logout',
    solutionSteps: [
      '1. Always ensure you have an active internet connection (mobile data or WiFi).',
      '2. Before logging out, open the app and look for a "Sync" or "Upload" button.',
      '3. Tap it to push all offline data to the server.',
      '4. Wait for the sync confirmation message.',
      '5. Only then tap the "Logout" button.',
    ],
    requiresUserDetails: false,
    escalationRequiredIfNotSolved: true,
    keywords: [
      'data loss',
      'data lost after logout',
      'lost attendance data',
      'data disappeared',
      'offline data loss',
      'data not saved',
      'sync before logout',
    ],
  },
];

export function getSupportIssueByCode(code: string): SupportIssue | undefined {
  return SUPPORT_ISSUES.find((issue) => issue.code === code);
}

export function getCategories(): string[] {
  const categories = new Set(SUPPORT_ISSUES.map((issue) => issue.category));
  return Array.from(categories);
}

export function getIssuesByCategory(category: string): SupportIssue[] {
  return SUPPORT_ISSUES.filter((issue) => issue.category === category);
}

export function getAllKeywords(): string[] {
  const keywords = new Set<string>();
  SUPPORT_ISSUES.forEach((issue) => {
    issue.keywords.forEach((keyword) => keywords.add(keyword));
  });
  return Array.from(keywords);
}

export function getCompactIssueList(): string {
  return SUPPORT_ISSUES.map(
    (issue) =>
      `${issue.code}: ${issue.title} (Keywords: ${issue.keywords.join(', ')})`
  ).join('\n');
}
