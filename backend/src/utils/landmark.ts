import axios from "axios";

export const getWikiSummary = async (wikiUrl: string) => {
  try {
    const wikiResponse = await axios.get(wikiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "LandmarkApp/1.0",
      },
    });
    return wikiResponse.data;
  } catch (err: any) {
    console.error("Wikipedia API error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Headers:", err.response.headers);
      console.error("Data:", err.response.data);
    }
    throw new Error("Failed to fetch Wikipedia data");
  }
};
