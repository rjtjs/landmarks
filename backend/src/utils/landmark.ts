import axios from "axios";

interface WikiSummaryResponse {
  extract: string;
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
}

export const getWikiSummary = async (wikiUrl: string): Promise<WikiSummaryResponse> => {
  try {
    const wikiResponse = await axios.get<WikiSummaryResponse>(wikiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "LandmarkApp/1.0",
      },
    });
    return wikiResponse.data;
  } catch (err: unknown) {
    const error = err as {
      message?: string;
      response?: { status: number; headers: unknown; data: unknown };
    };
    console.error("Wikipedia API error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    }
    throw new Error("Failed to fetch Wikipedia data");
  }
};
