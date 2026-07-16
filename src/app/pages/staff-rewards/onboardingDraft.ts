const KEY = "staffOnboard_draft";

export type IdType = "bvn" | "nin";
export type AccountCategory = "individual" | "sme";
export type OtpChannel = "sms" | "email" | "whatsapp";

export interface OnboardingProfile {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
}

export interface RelationshipOfficer {
  name: string;
  email: string;
  phone: string;
}

export interface OnboardingDraft {
  category?: AccountCategory;
  accountType?: string;
  consentAccepted?: boolean;
  idType?: IdType;
  idNumber?: string;
  phone?: string;
  email?: string;
  livenessFaceImage?: string; // data URL, "" if simulated (no camera)
  otpChannel?: OtpChannel;
  otpVerified?: boolean;
  profile?: OnboardingProfile;
  address?: string;
  signature?: string; // data URL
  nextOfKin?: string;
  occupation?: string;
  accountNumber?: string;
  ro?: RelationshipOfficer;
}

export function getDraft(): OnboardingDraft {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function patchDraft(patch: Partial<OnboardingDraft>): OnboardingDraft {
  const next = { ...getDraft(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearDraft(): void {
  sessionStorage.removeItem(KEY);
}
