export const META_PIXEL_ID = "2146602486235214";

type MetaPixelPayload = Record<string, string | number | boolean | string[] | undefined>;

declare global {
  interface Window {
    fbq?: (
      action: "track" | "init",
      eventName: string,
      payload?: MetaPixelPayload,
      options?: MetaPixelPayload,
    ) => void;
  }
}

export function trackMetaPixelEvent(
  eventName: string,
  payload?: MetaPixelPayload,
  options?: MetaPixelPayload,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  window.fbq("track", eventName, payload, options);
}
