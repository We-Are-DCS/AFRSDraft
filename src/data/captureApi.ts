export interface CaptureRequest {
  CustomerID: string;
  InteractionType: 'Click' | 'Impression' | 'Accept' | 'Skip';
  ActionID: string;
  Treatment: string;
  Channel: string;
  Outcome: string;
  Context: {
    Platform: string;
    SessionID: string;
    Timestamp: string;
    PageURL: string;
  };
}

export interface CaptureResponse {
  status: 200;
  InteractionID: string;
  Recorded: true;
  ModelUpdateQueued: true;
  PropensityDelta: number;
  NextBestAction: {
    ActionID: string;
    ActionName: string;
    Channel: string;
    pAccept: number;
    Treatment: string;
    Rationale: string;
  };
  ATRSRef: string;
}

export function buildCaptureRequest(
  customerID: string,
  actionID: string,
  treatment: string,
  channel: string,
  platform: string,
  sessionID: string,
  pageURL: string,
): CaptureRequest {
  return {
    CustomerID: customerID,
    InteractionType: 'Click',
    ActionID: actionID,
    Treatment: treatment,
    Channel: channel,
    Outcome: 'Clicked',
    Context: {
      Platform: platform,
      SessionID: sessionID,
      Timestamp: new Date().toISOString(),
      PageURL: pageURL,
    },
  };
}

export function buildCaptureResponse(
  actionID: string,
  nextActionID: string,
  nextActionName: string,
  nextChannel: string,
  nextTreatment: string,
  nextPAccept: number,
  propensityDelta: number,
  stageIndex: number,
  personaAvatar: string,
): CaptureResponse {
  return {
    status: 200,
    InteractionID: `INT-2026-${actionID.slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`,
    Recorded: true,
    ModelUpdateQueued: true,
    PropensityDelta: propensityDelta,
    NextBestAction: {
      ActionID: nextActionID,
      ActionName: nextActionName,
      Channel: nextChannel,
      pAccept: nextPAccept,
      Treatment: nextTreatment,
      Rationale: 'Click on paid-social ad → raised propensity → next action queued',
    },
    ATRSRef: `ATRS-2026-CAP-${String(stageIndex).padStart(3, '0')}-${personaAvatar}`,
  };
}
