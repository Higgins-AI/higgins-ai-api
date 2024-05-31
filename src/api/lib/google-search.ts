import {google} from "googleapis";

const customSearchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID ?? ''
const googleCloudApiKey = process.env.GOOGLE_CLOUD_API_KEY ?? ''

export const customGoogleSearch = async (query: string) => {
  const googleSearch = google.customsearch({
    version: 'v1',
  });
  const searchResults = await googleSearch.cse.list({
    q: query,
    cx: customSearchEngineId,
    key: googleCloudApiKey,
  });

  return searchResults.data.items?.map((item) => {
    return { displayLink: item.displayLink, link: item.link };
  });
};
